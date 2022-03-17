import bcrypt from 'bcrypt';
import Issuer from "../../models/issuer.js"
import config from "../../config/config.js"
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const createIssuer = async(username,password) => {
    try {
        console.log("method createIssuer called")
        let passwordHash = await bcrypt.hash(password,config.saltRounds);
        let issuer =  await Issuer.create({
            username:username,
            password:passwordHash
        })
        return issuer;
    }
    catch(err)
    {
        console.error(err);
    }
}


// find if access_token cookie is valid jwt
const getIssuer = async(req,res) => {
    try{
        console.log("getIssuer method called!!")
        const token = req.cookies.access_token;
        if(!token) {
            return res.status(401).send("access denied");
        }
        const data = jwt.verify(token,config.jwtSecret);
        req.userID = data.userID
        console.log(data.userID)
        let user = await Issuer.findById(mongoose.Types.ObjectId(data.userID))
        // console.log(user);
        if(!user) return res.status(401).send("access denied");
        // console.log("authorized user")
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
    createIssuer,
    getIssuer
}