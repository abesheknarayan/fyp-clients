import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    aadharId: {
        type: String,
        unique: true
    },
    password: String,
});


const User = mongoose.model("Users",userSchema);
export default User;