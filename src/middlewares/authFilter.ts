// middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { MyJwtPayload } from "../utils/utils";
export default class AuthFilter{
    private jwtsecret = "" as string
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
    const decodedToken = jwt.verify(token, this.jwtsecret) as MyJwtPayload;
    console.log("Decoded Token:", decodedToken);
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

}