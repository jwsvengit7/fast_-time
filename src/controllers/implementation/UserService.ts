import express, { Response, Request } from "express";
import User, {
  UserAttributes,
  UserCreationAttributes,
} from "../../domain/models/User";
import { FindOptions } from "sequelize";
import EmailUtils from "../../utils/emailUtils";
class UserServices { 
  private mail;

  constructor() {
    this.RegsiterUserFastTime = this.RegsiterUserFastTime.bind(this);
    this.mail = new EmailUtils();
  }

  public async RegsiterUserFastTime(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Please provide username, email, and password" });
      }

      const salt = await this.mail.GenerateSalt();
      const hashedPassword: string = await this.mail.GeneratePassword(
        password,
        salt
      );

      const existingUser = await User.findOne({
        where: { email },
      } as FindOptions<UserAttributes>);
      if (existingUser && existingUser.status) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      const otpData = this.mail.generateOtp(); 

      if(existingUser !=null ){
        if(!existingUser.status){
            await this.mail.sendVerificationOTP(email, otpData.otp); 
            existingUser.otp=otpData.otp
            existingUser.expired=otpData.expiry
            return res
        .status(200)
        .json({ msg: "User register Verify your account " }); 
      }
      }else{

        const REFERERLINK = req.originalUrl;

      const newUser: UserCreationAttributes = { 
        username,
        email,
        password: hashedPassword,
        status:false,
        role,
        referer_link:REFERERLINK,
        otp:otpData.otp,
        expired:otpData.expiry,
        createdAt: new Date(),
      };
      
      const saveUser = await User.create(newUser);
      await this.mail.sendVerificationOTP(email, otpData.otp); 


      return res
        .status(200)
        .json({ msg: "User register Verify your account " });
    }
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UserServices };
