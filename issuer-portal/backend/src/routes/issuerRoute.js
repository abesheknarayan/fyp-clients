import {Router} from 'express';
import { createCredentialDefiniton,createCredentialSchema } from '../controllers/issuer/credentialController.js';
import { getIssuer } from '../controllers/issuer/issuerController.js'
import checkIssuer from '../middlewares/issuerChecker.js';

const router = Router();

router.get('/me',getIssuer)

// router.get("/credentialschema/all")
// router.get("/credentialdefinition/all");

router.post("/credentialschema/create",checkIssuer,createCredentialSchema)
router.post("/credentialdefinition/create",checkIssuer,createCredentialDefiniton)

export default router;