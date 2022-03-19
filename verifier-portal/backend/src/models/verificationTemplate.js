import mongoose from "mongoose";

const verificationTemplateSchema = new mongoose.Schema({
    templateName: String,
    definitionId: String,
    requiredAttributes: []
});

const VerificationTemplate = mongoose.model("VerificationTemplates",verificationTemplateSchema);
export default VerificationTemplate;