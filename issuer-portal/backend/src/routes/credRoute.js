import { Router } from "express";
import { getCredentialDetials, requestCredential, getAllCredentialRequests, getDetailsForIssuance, saveCredential, getUserCredential, getTotalIssuedCredentials, getAllIssuedCredentials, deleteCredential } from "../controllers/credential/credentialController.js";
import { userChecker } from '../middlewares/userChecker.js'
import { checkIssuer } from '../middlewares/issuerChecker.js';
const router = new Router();

router.get("/requests", checkIssuer, getAllCredentialRequests)
router.get("/issue/:id",checkIssuer,getDetailsForIssuance);
router.get("/:id", userChecker, getCredentialDetials);
router.get("/issued/all",checkIssuer,getAllIssuedCredentials)
router.get("/issued/:id",userChecker,getUserCredential);
router.get("/definition/totalissued/:id",checkIssuer,getTotalIssuedCredentials);

router.post("/save",checkIssuer,saveCredential)
router.post("/request", userChecker, requestCredential);
router.post("/delete",checkIssuer,deleteCredential);


export default router;