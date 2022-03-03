import {Router} from 'express';
import { createCredentialDefiniton } from '../controllers/issuer/credentialController.js';
import { getIssuer } from '../controllers/issuer/issuerController.js'
import checkIssuer from '../middlewares/issuerChecker.js';

const router = Router();

router.get('/me',getIssuer)

router.post("/credentialdefinition/create",checkIssuer,createCredentialDefiniton)

export default router;