import {Router} from 'express';
import { getIssuableCredentials } from '../controllers/credential/credentialController.js';

import { getUser } from '../controllers/user/userController.js';
import { userChecker } from '../middlewares/userChecker.js';

const router = Router();

router.get("/me",getUser)
router.get("/credentials/issuable",userChecker,getIssuableCredentials)

export default router;