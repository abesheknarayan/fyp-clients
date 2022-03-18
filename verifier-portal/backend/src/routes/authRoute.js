import { Router } from "express";
import { userLoginHandler, userLogoutHandler } from "../controllers/auth/userAuth.js";
import { verifierLoginHandler, verifierLogoutHandler } from "../controllers/auth/verifierAuth.js";

const router = Router();


router.post("/verifier/login", verifierLoginHandler)
router.get("/verifier/logout", verifierLogoutHandler)
router.post("/user/login",userLoginHandler)
router.get("/user/logout",userLogoutHandler)

export default router;