import mongoose from "mongoose";

const verificationTemplateSchema = new mongoose.Schema({
    definitionId: String,
    requiredAttributes: []
});

const VerificationTemplate = mongoose.model("VerificationTemplates",verificationTemplateSchema);
export default VerificationTemplate;