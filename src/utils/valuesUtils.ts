import dotenv from 'dotenv';

dotenv.config();

export const PORT = 8081;
export const SERVER = "localhost";
export const SECRET = process.env.JWT_SECRET as string;
export const MAIL_SERVER = process.env.MAIL_SERVER as string;
export const MAIL_PORT =  parseInt(process.env.MAIL_PORT as string);
export const MAIL_USER =  process.env.MAIL_USER as string;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD as string;
 