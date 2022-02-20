import { Router } from 'express';
import { issuerLoginHandler, issuerLogoutHandler } from '../controllers/auth/issuerLogin.js';
import { userLoginHandler, userLogoutHandler } from '../controllers/auth/userLogin.js';


const router = Router();

router.post("/issuer/login", issuerLoginHandler)
router.get("/issuer/logout", issuerLogoutHandler)
router.post("/user/login",userLoginHandler)
router.get("/user/logout",userLogoutHandler)

export default router;