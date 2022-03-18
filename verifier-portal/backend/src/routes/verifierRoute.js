import { Router } from "express";
import { getVerifier } from "../controllers/verifier/verifierController.js";

const router = Router();

router.get('/me',getVerifier);

export default router;