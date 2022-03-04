import mongoose from "mongoose";

const CredentialSchemaSchema = new mongoose.Schema({
    name: String,
    schemaId: String,
    version: String,
    creatorAddress: String,
    attributes: String
})

const CredentialSchema = mongoose.model("CredentialSchemas",CredentialSchemaSchema);

export default CredentialSchema;