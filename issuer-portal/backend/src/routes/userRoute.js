import { Router } from 'express';
import { getIssuableCredentials, getAllUserCredentialRequests, getAllUserCredentialsIssued } from '../controllers/credential/credentialController.js';

import { getUser } from '../controllers/user/userController.js';
import { userChecker } from '../middlewares/userChecker.js';

const router = Router();

router.get("/me", getUser)
router.get("/credentials/issuable", userChecker, getIssuableCredentials)
router.get("/credential/requests", userChecker, getAllUserCredentialRequests)
router.get("/credential/all", userChecker, getAllUserCredentialsIssued)

export default router;