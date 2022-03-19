import { Router } from "express";
import { createVerificationTemplate, getAllVerificationTemplates, getVerificationTemplate } from "../controllers/credential/credentialController.js";
import { checkVerifier } from "../middlewares/verifierChecker.js";

const router = Router();
router.get('/verificationtemplate/all',checkVerifier,getAllVerificationTemplates);
router.get('/verificationtemplate/:id',checkVerifier,getVerificationTemplate);

router.post("/verificationtemplate/create",checkVerifier,createVerificationTemplate)

export default router;