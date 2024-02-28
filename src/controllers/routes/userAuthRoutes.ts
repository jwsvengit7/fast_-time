import express from "express";
 import { authService } from "../../utils/obejctCreationUtils";

const router = express.Router();

router.post("/login",authService.AuthLogin)

export default router