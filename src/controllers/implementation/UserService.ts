import express, { Response, Request } from "express";
import User, {
  
  UserCreationAttributes,
} from "../../domain/models/User";
import UsersRepositories from "../../domain/repositories/UserRepository";
import { createUserValidator, variables } from "../../utils/utils";
import EmailUtils from "../../utils/emailUtils";
class UserServices   { 



  public async RegsiterUserFastTime(req: Request, res: Response) {
    try { 
      const validationResult = createUserValidator.validate(req.body, variables);

      if (validationResult.error) {
        return res
          .status(400)
          .json({ error: validationResult.error.details[0].message });
      }
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Please provide username, email, and password" });
      }


      console.log(12)

      const salt = await EmailUtils.GenerateSalt();
      const hashedPassword: string = await EmailUtils.GeneratePassword(
        password,
        salt
      );

      const existingUser = await UsersRepositories.findUser(email,"email");
      if (existingUser && existingUser.status) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      console.log(123)

      const otpData = EmailUtils.generateOtp(); 

      if(existingUser !=null ){
        if(!existingUser.status){
            await EmailUtils.sendVerificationOTP(email, otpData.otp); 
            existingUser.otp=otpData.otp
            existingUser.expired=otpData.expiry
            await  existingUser.save()
            return res
        .status(200)
        .json({ msg: "User register Verify your account via otp " }); 
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
      
      await User.create(newUser);
      await EmailUtils.sendVerificationOTP(email, otpData.otp); 


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
