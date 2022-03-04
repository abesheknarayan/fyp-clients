import mongoose from "mongoose";

const credentialDefinitionSchema = new mongoose.Schema({    
    name: String,
    definitionId: String,
    version: String,
    issuerAddress: String,
    schemaId: String,
    isRevocatable: Boolean,
    publicKey: {},
    privateKey: {},
});

const CredentialDefinition = mongoose.model("CredentialDefinitions",credentialDefinitionSchema);
export default CredentialDefinition;