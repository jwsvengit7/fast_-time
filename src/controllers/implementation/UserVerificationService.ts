import express, { Request, Response } from "express";
import EmailUtils from "../../utils/emailUtils";
import UsersRepositories from "../../domain/repositories/UserRepository";
import AuthFilter from "../../middlewares/authFilter";

class UserVerification {
  public async VerifyOTPFastTime(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      const existingUser = await UsersRepositories.findUser(email, "email");

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentDateTime = new Date();
      if (existingUser.expired < currentDateTime) {
        return res.status(400).json({ error: "OTP has expired" });
      }

      if (existingUser.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
      existingUser.status = true;
      await existingUser.save();

      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  public async ResendOTPFastTime(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const existingUser = await UsersRepositories.findUser(email, "email");

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentDateTime = new Date();
      const otpData = EmailUtils.generateOtp();
      existingUser.otp = otpData.otp;
      existingUser.expired = otpData.expiry;
      existingUser.createdAt = currentDateTime;
      await existingUser.save();
      await EmailUtils.sendVerificationOTP(email, otpData.otp);

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  public async ResetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const { newPassword } = req.body;

      const existingUser = await UsersRepositories.findUser(email, "email");

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const salt = await EmailUtils.GenerateSalt();
      const hashedPassword: string = await EmailUtils.GeneratePassword(
        newPassword,
        salt
      );

      existingUser.password = hashedPassword;
      await existingUser.save();

      return res.status(200).json({ message: "Password Change successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  public async ForgetPassword(req: Request, res: Response) {
    try {
      const email = req.query.email as string;

      const existingUser = await UsersRepositories.findUser(email, "email");

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const token = EmailUtils.generateLink(res);
      const LINK = `${req.hostname}:8081${req.baseUrl}/verify-token?token=${token}&email=${email}`;

      console.log(LINK);
      await EmailUtils.sendPasswordResetLink(email, LINK);

      const currentDateTime = new Date();
      const otpData = EmailUtils.generateOtp();
      existingUser.otp = otpData.otp;
      existingUser.token = token;
      existingUser.createdAt = currentDateTime;
      await existingUser.save();

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  public async VerifyLink(req: Request, res: Response) {
    try {
      const token = req.query.token as string;
      const email = req.query.email as string;

      const existingUser = await UsersRepositories.findUser(email, "email");

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }
      if (existingUser.token != token) {
        return res.status(401).json({ error: "Invalid Token" });
      }
      const authFilter = new AuthFilter();
      if (!authFilter.verifyJWT(token)) {
        return res.status(404).json({ message: "Incorrect token" });
      }

      existingUser.status=true;
      existingUser.token="";
      await existingUser.save();

      return res.status(200).json({ message: "verified successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UserVerification };
