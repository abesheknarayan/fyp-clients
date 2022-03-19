import { Router } from "express";
import { getAllVerificationTemplates, getVerificationTemplate } from "../controllers/credential/credentialController.js";
import { getUser } from "../controllers/user/userController.js";
import { userChecker } from "../middlewares/userChecker.js";

const router = Router();

router.get('/me',getUser);

router.get("/verificationtemplate/all",userChecker,getAllVerificationTemplates)
router.get("/verificationtemplate/:id",userChecker,getVerificationTemplate);

export default router;