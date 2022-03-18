import mongoose from "mongoose";

const verifierSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const Verifier = mongoose.model("Verifiers",verifierSchema);
export default Verifier