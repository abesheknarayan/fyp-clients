import CredentialDef from '../../models/credentialDefintion.js'

const createCredentialDefiniton = async (req,res) => {
    try {
        console.log("attempting to create credential defintion")
        if(!req.userID) {
            return res.status(401).send("access denied")
        }
        let {userID,body} = req;
        // console.log(userID,body);
        await CredentialDef.create({
            definitionId: body.credentialId,
            publicKey: body.publicKey,
            privateKey: body.privateKey 
        })
    }
    catch (err) {
        console.error(err);
    }
}

export {
    createCredentialDefiniton
}