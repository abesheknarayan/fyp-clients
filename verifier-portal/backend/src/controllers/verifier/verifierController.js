import bcrypt from 'bcrypt';
import Verifier from '../../models/verifier.js';
import config from "../../config/config.js";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const createVerifier = async(username,password) => {
    try {
        console.log("method createIssuer called")
        let passwordHash = await bcrypt.hash(password,config.saltRounds);
        let verifier =  await Verifier.create({
            username:username,
            password:passwordHash
        })
        return verifier;
    }
    catch(err)
    {
        console.error(err);
    }
}

// find if access_token cookie is valid jwt
const getVerifier = async(req,res) => {
    try{
        console.log("getIssuer method called!!")
        const token = req.cookies.access_token;
        if(!token) {
            return res.status(401).send("access denied");
        }
        const data = jwt.verify(token,config.jwtSecret);
        req.userID = data.userID
        console.log(data.userID)
        let user = await Verifier.findById(mongoose.Types.ObjectId(data.userID))
        if(!user) return res.status(401).send("access denied");
        return res.status(200).json({
            username: user.username,
            userID: data.userID
        })
    }
    catch(err){
        console.log(err);
        return res.status(400).send("Invalid Cookie");
    }
}



export {
    createVerifier,
    getVerifier,
}

