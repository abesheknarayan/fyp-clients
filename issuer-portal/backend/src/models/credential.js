import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema({
    credentialDefinitionId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    credential :{}
})

const Credential = mongoose.model("Credentials",credentialSchema)
export default Credential;