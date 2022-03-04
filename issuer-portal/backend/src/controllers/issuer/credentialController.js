import CredentialDefinition from '../../models/credentialDefintion.js'
import CredentialSchema from '../../models/credentialSchema.js'

const createCredentialDefiniton = async (req,res) => {
    try {
        console.log("attempting to create credential defintion")
        if(!req.userID) {
            return res.status(401).send("access denied")
        }
        let {body} = req;
        // console.log(userID,body);
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


const createCredentialSchema = async(req,res) => {
    try { 
        console.log("attempting to create credential schema")
        if(!req.userID) {
            return res.status(401).send("access denied")
        }
        let {body} = req;
        console.log(body)
        
        await CredentialSchema.create({
            name: body.name,
            schemaId: body.schemaId,
            version: body.version,
            creatorAddress: body.creatorAddress,
            attributes: body.attributes
        })
    }
    catch(err)
    {
        console.error(err);
    }
}

export {
    createCredentialDefiniton,
    createCredentialSchema,
}