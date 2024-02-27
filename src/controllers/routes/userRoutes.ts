import express from "express";
import { userCreation,userVerification } from "../../utils/obejctCreationUtils";

const router = express.Router();

router.post("/register",userCreation.register)
router.post("/verify-otp",userVerification.verify_otp)

export default router;