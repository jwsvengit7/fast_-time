import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export interface MyJwtPayload extends JwtPayload {
  userId: string;
}