import database from "../utils/db.js";
import CredentialSchema from '../models/credentialSchema.js'
import CredentialDefinition from '../models/credentialDefintion.js'
import Credential from '../models/credential.js'
import CredentialRequest from '../models/credentialRequest.js'



database();

const clearDb = async() => {
    try{
        console.log("... clearing all collections in db except users and issuers");
        await CredentialSchema.collection.drop();
        await CredentialDefinition.collection.drop();
        await CredentialRequest.collection.drop();
        await Credential.collection.drop();
        console.log("... done ...")
    }
    catch(err)
    {
        console.error(err);
    }
}

await clearDb();

process.exit();