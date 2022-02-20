import mongoose from "mongoose";

const issuerSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const Issuer = mongoose.model("Issuers",issuerSchema);
export default Issuer