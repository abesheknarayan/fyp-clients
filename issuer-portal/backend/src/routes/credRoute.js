import { Router } from "express";
import { getCredentialDetials, requestCredential, getAllCredentialRequests, getDetailsForIssuance, saveCredential, getUserCredential } from "../controllers/credential/credentialController.js";
import { userChecker } from '../middlewares/userChecker.js'
import { checkIssuer } from '../middlewares/issuerChecker.js';
const router = new Router();

router.get("/requests", checkIssuer, getAllCredentialRequests)
router.get("/issue/:id",checkIssuer,getDetailsForIssuance);
router.post("/save",checkIssuer,saveCredential)
router.get("/:id", userChecker, getCredentialDetials);
router.post("/request", userChecker, requestCredential);
router.get("/issued/:id",userChecker,getUserCredential)


export default router;