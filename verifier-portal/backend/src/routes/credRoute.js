import { Router } from "express";
import { checkRevocation, createVerificationTemplate, getAllVerificationTemplates, getVerificationTemplate } from "../controllers/credential/credentialController.js";
import { userChecker } from "../middlewares/userChecker.js";
import { checkVerifier } from "../middlewares/verifierChecker.js";

const router = Router();
router.get('/verificationtemplate/all',checkVerifier,getAllVerificationTemplates);
router.get('/verificationtemplate/:id',checkVerifier,getVerificationTemplate);

router.post("/verificationtemplate/create",checkVerifier,createVerificationTemplate)
router.post("/revocation/:id",userChecker,checkRevocation)

export default router;