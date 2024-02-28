import { Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../domain/models/User";
import { MAIL_PASSWORD, MAIL_PORT, MAIL_SERVER, MAIL_USER,SECRET } from "./valuesUtils";
import dotenv from 'dotenv';
import {signupTemplateForLink,signupTemplate} from "./templates";

dotenv.config();

interface UserOrAdminDocument {
    id: number; 
    email: string;
    app:string;
    product_code:string

  }

  interface UserOrAdminLinkDocument {
    time: Date;
    app:string;
    product_code:string
  }


 class EmailUtils { 

 
    public static generateOtp = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiry = new Date();
        expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
        return { otp, expiry };
      };

      
      public static generateLink = ( 
        res: Response) => {
        const expiry = new Date();
        expiry.setTime(new Date().getTime() + 50 * 60 * 100);
        const payload:UserOrAdminLinkDocument = {
            time: expiry,
            app:"FAST_TIME",
            product_code:"00943"
          };
        
          try {
            const token = jwt.sign(payload, SECRET, { expiresIn: "5min" });
            res.cookie("token", token, {
              httpOnly: true,
              maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            return token;
          } catch (error) {
            console.error(error);
            throw new Error("Error generating link");
          }
      };
      



public  static generateToken = (
  user: User,
  res: Response
) => { 
  const payload: UserOrAdminDocument = {
    id: user.id,
    email: user.email,
    app:"FAST_TIME",
    product_code:"00945"

  };

  try {
    const token = jwt.sign(payload, SECRET, { expiresIn: "30d" });
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

public static validateToken = (
  user: User ,
  token: string
) => {
  try {
    const decodedToken: any = jwt.verify(token, SECRET);
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

static GenerateSalt = async function()  {
  return await bcrypt.genSalt();
};

public static  GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

public static sendVerificationOTP = async (email: string, otp: number) => {
  
  try {
    const transporter = nodemailer.createTransport({
      host: MAIL_SERVER,
      port:MAIL_PORT,

      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD, 
      },
    }) ;

    const mailOptions = signupTemplate(email,otp) 

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending account verification OTP");
  }
};

public static sendVerificationEmail = async (email: string,user:User) => {
  try {
    const transporter = nodemailer.createTransport({
        host: MAIL_SERVER,
        port:MAIL_PORT,
  
        secure: false,
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASSWORD, 
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

public static  sendPasswordResetLink = async (email: string, link: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: MAIL_SERVER,
      port:MAIL_PORT,

      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD, 
      },
    });

    const mailOptions = signupTemplateForLink(email,link) 

    await transporter.sendMail(mailOptions);
  } catch (error) { 
    console.error(error);
    throw new Error("Error sending password reset OTP");
  }
};

}

export default EmailUtils; 