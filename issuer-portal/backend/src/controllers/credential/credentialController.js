import CredentialDefinition from '../../models/credentialDefintion.js'
import CredentialRequest from '../../models/credentialRequest.js'
import CredentialSchema from '../../models/credentialSchema.js'
import Credential from '../../models/credential.js'
import User from '../../models/user.js'
import mongoose from 'mongoose'

const createCredentialDefiniton = async (req, res) => {
    try {
        console.log("attempting to create credential defintion")
        if (!req.userID) {
            return res.status(401).send("access denied")
        }
        let { body } = req;
        await CredentialDefinition.create({
            name: body.name,
            definitionId: body.credentialId,
            version: body.version,
            issuerAddress: body.issuerAddress,
            schemaId: body.schemaId,
            isRevocatable: body.isRevocatable,
            publicKey: body.publicKey,
            privateKey: body.privateKey
        })
    }
    catch (err) {
        console.error(err);
    }
}


const createCredentialSchema = async (req, res) => {
    try {
        console.log("attempting to create credential schema")
        if (!req.userID) {
            return res.status(401).send("access denied")
        }
        let { body } = req;
        console.log(body)

        await CredentialSchema.create({
            name: body.name,
            schemaId: body.schemaId,
            version: body.version,
            creatorAddress: body.creatorAddress,
            attributes: body.attributes
        })
    }
    catch (err) {
        console.error(err);
    }
}

// method which gives the list of all credentials only their names and versions
const getIssuableCredentials = async (req, res) => {
    try {
        console.log("attempting to get issuable credentials")
        if (!req.userID) {
            return res.status(401).send("access denied")
        }
        let result = await CredentialDefinition.find({}, { name: 1, version: 1, definitionId: 1 });
        // console.log(result)
        res.status(200).send(result);

    }
    catch (err) {
        console.error(err);
    }
}

// complete details of credential along with schema and all that
const getCredentialDetials = async (req, res) => {
    try {
        let _id = req.params.id;
        // console.log(_id);
        let definition = await CredentialDefinition.findById({ _id }, {
            name: 1,
            definitionId: 1,
            version: 1,
            schemaId: 1,
            isRevocatable: 1
        })
        // console.log(definition);
        if (!definition) return res.status(404).send("invalid id")
        let schema = await CredentialSchema.findOne({ schemaId: definition.schemaId }, {
            name: 1,
            version: 1,
            attributes: 1,
        })
        // console.log(schema);
        if (!schema) return res.status(404).send("invalid")
        let response = {
            definition: definition,
            schema: schema
        }
        return res.status(200).json(response);
    }
    catch (err) {
        console.error(err);
    }
}

const requestCredential = async (req, res) => {
    try {
        let { definitionId, publicKey } = req.body;
        console.log(publicKey);
        let { userID } = req;
        let user = await User.findById(userID, { aadharId: 1 });
        let credentialDefinition = await CredentialDefinition.findById(
            definitionId, {
            name: 1,
            version: 1,
        })
        if (!createCredentialDefiniton) return res.status(400).send("Invalid Request");
        await CredentialRequest.create({
            userId: userID,
            aadharId: user.aadharId,
            definitionId: definitionId,
            credentialName: credentialDefinition.name,
            credentialVersion: credentialDefinition.version,
            publicKey: publicKey,
            status: "requested"
        })
    }
    catch (err) {
        console.error(err);
    }
}

const getAllCredentialRequests = async (req, res) => {
    try {
        console.log("attempting to get all credential requests")
        let data = await CredentialRequest.find({ status: "requested" });
        res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
    }
}

// give all details like requested user details, credential schema & def
const getDetailsForIssuance = async (req, res) => {
    try {
        let { userID } = req;
        const { id } = req.params;
        console.log(userID, id);
        let request = await CredentialRequest.findById(id);
        let user = await User.findById(userID, { aadharId: 1 });
        let credentialDefinition = await CredentialDefinition.findById(request.definitionId, {
            name: 1,
            version: 1,
            isRevocatable: 1,
            schemaId: 1,
            definitionId: 1,
            privateKey: 1,
            publicKey: 1, // remove this after testing
        })

        if (!credentialDefinition) return res.status(400).send("Invalid Request");
        if (request.status !== "requested") return res.status(400).send("Invalid Request");

        let credentialSchema = await CredentialSchema.findOne({ schemaId: credentialDefinition.schemaId }, {
            attributes: 1
        });

        return res.status(200).json({
            user: {
                aadharId: request.aadharId,
            },
            requestId: request.id,
            definition: credentialDefinition,
            schema: credentialSchema,
            userPublicKey: request.publicKey,
        })

    }
    catch (err) {
        console.error(err);
    }
}

const saveCredential = async (req, res) => {
    try {
        /*
          1. change request status to done
          2. store credential in db
        */
        let { requestId, credentialDefinitionDBId, credential } = req.body;
        let credentialRequest = await CredentialRequest.findById(requestId);
        credentialRequest.status = 'issued';
        await credentialRequest.save();
        let { userID } = req;
        await Credential.create({
            credentialDefinitionId: mongoose.Types.ObjectId(credentialDefinitionDBId),
            userId: mongoose.Types.ObjectId(credentialRequest.userId),
            credential: credential
        })
        return res.status(200);
    }
    catch (err) {
        console.error(err);
    }
}

const getAllUserCredentialRequests = async (req, res) => {
    try {
        console.log("user requesting all credential requests");
        let { userID } = req;
        let result = await CredentialRequest.find({ userId: userID, status: "requested" });
        console.log(result);
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
    }
}

const getAllUserCredentialsIssued = async (req, res) => {
    try {
        let { userID } = req;
        console.log(userID)
        let result = await Credential.find({ userId: userID });
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
    }
}

const getUserCredential = async (req,res) => {
    try{
        console.info("getting user credential")
        // find if userID is owner
        let {userID} = req;
        let {id} = req.params;
        let credential = await Credential.findById(id);
        if(!credential) {
            return res.status(400).send("No credential found");
        }
        if(credential.userId != (userID))
        {
            return res.status(400).send("Invalid request");
        }
        return res.status(200).json(credential);
    }
    catch(err)
    {
        console.error(err);
    }
}

export {
    createCredentialDefiniton,
    createCredentialSchema,
    getIssuableCredentials,
    getCredentialDetials,
    requestCredential,
    getAllCredentialRequests,
    getDetailsForIssuance,
    saveCredential,
    getAllUserCredentialRequests,
    getAllUserCredentialsIssued,
    getUserCredential,
}