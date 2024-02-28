import express, { Response, Request } from "express";
import { loginUserSchema, variables } from "../../utils/utils";
import UsersRepositories from "../../domain/repositories/UserRepository";
import bcrypt from "bcryptjs";
import EmailUtils from "../../utils/emailUtils";
class Authentication{

    public async AuthLogin(req:Request,res:Response){
        try{
            const validateLogin = loginUserSchema.validate(req.body,variables);
            if (validateLogin.error) {
                return res
                  .status(400)
                  .json({ error: validateLogin.error.details[0].message });
              }

            const {email,password}:any  = req.body;

    const user = await UsersRepositories.findUser( email ,"email");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.status) {
      return res.status(401).json({ error: "User account not verified" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }


    const token = EmailUtils.generateToken(user, res);

    return res.status(200).json({ message: "Login successful",
     userId:user.id,
     email:user.email,
     role:user.role,
     status:user.status,
     token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
    }
    }


export default Authentication;