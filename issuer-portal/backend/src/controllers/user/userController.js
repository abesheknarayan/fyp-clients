import bcrypt from 'bcrypt';
import User from "../../models/user.js"
import jwt from 'jsonwebtoken'
import config from "../../config/config.js"
import mongoose from 'mongoose';

const createUser = async(username,password,aadharId) => {
    try {
        console.log("method createUser called")
        let passwordHash = await bcrypt.hash(password,config.saltRounds);
        let user = await User.create({
            username:username,
            password:passwordHash,
            aadharId: aadharId
        })
        return user;
    }
    catch(err)
    {
        console.error(err);
    }
}


// find if access_token cookie is valid jwt
const getUser = async(req,res) => {
    try{
        console.log("getUser method called!!")
        const token = req.cookies.access_token;
        if(!token) {
            return res.status(401).send("access denied");
        }
        const data = jwt.verify(token,config.jwtSecret);
        req.userID = data.userID
        console.log(data.userID)
        let user = await User.findById(mongoose.Types.ObjectId(data.userID))
        if(!user) return res.status(401).send("access denied");
        console.log("authorized user")
        return res.status(200).json({
            aadharID: user.aadharId,
            userID: data.userID
        })
    }
    catch(err){
        console.log(err);
    }
}

export {
    createUser,
    getUser
}