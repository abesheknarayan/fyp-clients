import mongoose from "mongoose";

const CredentialRequestSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    definitionId: String,
    credentialName: String,
    credentialVersion: String,
    aadharId: String,
    status: String,
    publicKey: {},
})

const CredentialRequest = mongoose.model("CredentialRequests",CredentialRequestSchema);

export default CredentialRequest;