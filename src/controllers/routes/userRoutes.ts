import express from "express";
import { userCreation,userVerification } from "../../utils/obejctCreationUtils";

const router = express.Router();

router.post("/register",userCreation.RegsiterUserFastTime)
router.post("/verify-otp",userVerification.VerifyOTPFastTime)
router.get("/resend-otp",userVerification.ResendOTPFastTime)

export default router;   