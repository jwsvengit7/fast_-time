import express from "express";
 import { userService,userVerification } from "../../utils/obejctCreationUtils";

const router = express.Router();


/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     description: Register a new user
 *     responses: 
 *       '200':
 *         description: Successfully registered
 *       '400':
 *         description: Bad request
 */
router.post("/register",userService.RegsiterUserFastTime)

/**
 * @swagger
 * /api/v1/forget-password:
 *   get:
 *     description: forget-password
 *     responses:
 *       '200':
 *         description: Successful operation
 */

router.post("/verify-otp",userVerification.VerifyOTPFastTime)
/**
 * @swagger
 * /api/v1/verify-otp:
 *   post:
 *     description: forget-password
 *     responses:
 *       '200':
 *         description: Successful operation
 */
router.get("/resend-otp",userVerification.ResendOTPFastTime)

/**
 * @swagger
 * /api/v1/resend-otp:
 *   get:
 *     description: forget-password
 *     responses:
 *       '200':
 *         description: Successful operation
 */
router.get("/forget-password",userVerification.ForgetPassword)


router.get("/verify-token",userVerification.VerifyLink)

export default router;    