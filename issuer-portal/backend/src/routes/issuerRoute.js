import {Router} from 'express';

import { getIssuer } from '../controllers/issuer/issuerController.js'

const router = Router();

router.get('/me',getIssuer)

export default router;