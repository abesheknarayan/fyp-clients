import mongoose from "mongoose";

const credentialDefinitionSchema = new mongoose.Schema({    
    definitionId: String,
    publicKey: {},
    privateKey: {},
});

const CredentialDef = mongoose.model("CredentialDefinitions",credentialDefinitionSchema);
export default CredentialDef