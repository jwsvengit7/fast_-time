// middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { MyJwtPayload } from "../utils/utils";
import { SECRET } from "../utils/valuesUtils";
export default class AuthFilter{
    private jwtsecret = SECRET as string
    constructor(){

    }
  authenticateUser = (
  req: Request ,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.query.token ||
      req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    console.log("Token:", token);
    const decodedToken = this.verifyToken(token)
    console.log("Decoded Token:", decodedToken);
    req.userId = decodedToken.userId;
    console.log(decodedToken.role);

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


  verifyJWT(token:string) {
    const decodedToken = this.verifyToken(token)
   const time =  decodedToken.time;
   const currentDateTime = new Date();
   console.log(time)
   console.log(currentDateTime)
   if (time < currentDateTime) {
       return false
   }
    return  true;

}

verifyToken(token:string){
    return  jwt.verify(token, this.jwtsecret) as MyJwtPayload;

}

}