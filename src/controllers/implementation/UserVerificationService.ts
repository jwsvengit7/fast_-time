import { FindOptions } from "sequelize";
import express,{Request,Response} from 'express'
import User, { UserAttributes } from "../../domain/models/User";
import OTP from "../../domain/models/OTP";
import { UserServices } from "./UserService";

class UserVerification  {
    constructor(){
     
    }
    public async verify_otp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            
            const existingUser = await User.findOne({
                where: { email },
            } as FindOptions<UserAttributes>);
            
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const otpUser = await OTP.findOne({ where: { userId: existingUser.id } });
    
            if (!otpUser) {
                return res.status(404).json({ error: 'OTP record not found' });
            }
    
            const currentDateTime = new Date();
            if (otpUser.expired < currentDateTime) {
                return res.status(400).json({ error: 'OTP has expired' });
            }
    
            if (otpUser.otp !== otp) {
                return res.status(400).json({ error: 'Invalid OTP' });
            }
    
            return res.status(200).json({ message: 'OTP verified successfully' });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
    
}

export {UserVerification}