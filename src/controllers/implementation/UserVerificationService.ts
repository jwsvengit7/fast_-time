import { FindOptions } from "sequelize";
import express,{Request,Response} from 'express'
import User, { UserAttributes } from "../../domain/models/User";
import { UserServices } from "./UserService";
import EmailUtils from "../../utils/emailUtils";

class UserVerification  {
    private mail;
    constructor(){
        this.mail = new EmailUtils();
     
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
    
            const otpUser = await User.findOne({ where: { id: existingUser.id } });
    
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

    public async resendOTPFromUser(req: Request, res: Response) {
        try {
            const { email } = req.params;
            
            const existingUser = await User.findOne({
                where: { email },
            } as FindOptions<UserAttributes>);
            
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const otpUser = await User.findOne({ where: { id: existingUser.id } });
    
            if (!otpUser) {
                return res.status(404).json({ error: 'OTP record not found' });
            }
    
            const currentDateTime = new Date();
            const otpData = this.mail.generateOtp()
            otpUser.otp=otpData.otp;
            otpUser.expired=otpData.expiry
            otpUser.createdAt=currentDateTime
            await otpUser.save()
            await this.mail.sendVerificationOTP(email, otpData.otp); 

    
            return res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
    
}

export {UserVerification}