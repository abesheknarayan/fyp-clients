import mongoose from "mongoose";

import VerificationTemplate from "../../models/verificationTemplate.js";


const createVerificationTemplate = async (req, res) => {
    try {
        let { definitionId, requiredAttributes,templateName,credentialDefinitionPublicKey } = req.body;
        console.log(definitionId, requiredAttributes);
        await VerificationTemplate.create({
            templateName: templateName,
            definitionId: definitionId,
            requiredAttributes: requiredAttributes,
            credentialDefinitionPublicKey: credentialDefinitionPublicKey,
        })
        return res.status(200);
    }
    catch (err) {
        console.error(err);
        return res.status(500);
    }
}

const getAllVerificationTemplates = async (req, res) => {
    try {
        let result = await VerificationTemplate.find({});
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
    }
}

const getVerificationTemplate = async(req,res) => {
    try{
        let {id} = req.params;
        let result = await VerificationTemplate.findById(id);
        if(!result) return res.status(400);
        console.log(result);
        return res.status(200).json(result);
    }
    catch(err)
    {
        console.error(err);
    }
}

export {
    createVerificationTemplate,
    getAllVerificationTemplates,
    getVerificationTemplate,
}