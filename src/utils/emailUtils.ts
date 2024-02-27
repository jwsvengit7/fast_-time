import { Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../domain/models/User";
import { MAIL_PASSWORD, MAIL_PORT, MAIL_SERVER, MAIL_USER } from "./valuesUtils";
import dotenv from 'dotenv';
import signupTemplate from "./templates";

dotenv.config();

interface UserOrAdminDocument {
    id: number; 
    email: string;
  }


export default class EmailUtils{ 
    private jwtsecret = "" ;
    private server =MAIL_SERVER ;
    private port = MAIL_PORT ;
    private password =MAIL_PASSWORD ;
    private user =MAIL_USER 
    
    constructor(){

    }
public generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { otp, expiry };
};




public  generateToken = (
  user: User,
  res: Response
) => {
  const payload: UserOrAdminDocument = {
    id: user.id,
    email: user.email,
  };

  try {
    const token = jwt.sign(payload, this.jwtsecret, { expiresIn: "30d" });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating token");
  }
};

public  validateToken = (
  user: User ,
  token: string
) => {
  try {
    const decodedToken: any = jwt.verify(token, this.jwtsecret);
    if (decodedToken.id !== user.id || decodedToken.email !== user.email) {
      return false;
    }
    const expiry = new Date(decodedToken.exp * 1000);
    if (expiry.getTime() < new Date().getTime()) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

public  GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

public  GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

public  sendVerificationOTP = async (email: string, otp: number) => {
  
  try {
    const transporter = nodemailer.createTransport({
      host: this.server,
      port:this.port,

      secure: false,
      auth: {
        user: this.user,
        pass: this.password, 
      },
    }) ;

    const mailOptions = signupTemplate(email,otp) 

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending account verification OTP");
  }
};

public  sendVerificationEmail = async (email: string,user:User) => {
  try {
    const transporter = nodemailer.createTransport({
        host: this.server,
        port:this.port,

      auth: {
        user: this.user,
        pass: this.password,
      },
    });

    const mailOptions = {
      from: "Fast Time <chiorlujack@gmail.com>",
      to: email,
      subject: "Account Verification Successful",
      html: ` 
        <div style="max-width:700px; font-size:110%; border:10px solid #ddd; padding:50px 20px; margin:auto;">
          <h2 style="text-transform:uppercase; text-align:center; color:teal;">Welcome to MediGuard</h2>
          <p>Your account has been verified and activated by the admin.</p>
          <p>Thank you for joining MediGuard. You can now login to your account and access all the features.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending verification email");
  }
};

public  sendPasswordResetOTP = async (email: string, otp: number) => {
  try {
    const transporter = nodemailer.createTransport({
        host: this.server,
        port: this.port,
      auth: {
        user: this.user,
        pass: this.password,
      },
    });

    const mailOptions = {
      from: "Fast Time <chiorlujack@gmail.com>",
      to: email,
      subject: "Password Reset OTP",
      html: `
   <div style="max-width:700px; font-size:110%; border:10px solid #ddd; 
  padding:50px 20px; margin:auto; ">
  <p>Your OTP to reset your password is:</p>
    <h1>${otp}</h1>
    <p>Please enter this OTP to reset your password.</p>
    <p>Note that the OTP is only valid for 30 minutes.</p>
    <p>If you did not make this request, please ignore this email.</p>
    `, 
    };

    await transporter.sendMail(mailOptions);
  } catch (error) { 
    console.error(error);
    throw new Error("Error sending password reset OTP");
  }
};

}