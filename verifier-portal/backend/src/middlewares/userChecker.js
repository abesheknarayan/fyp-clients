// parsing jwt tokens and check if user is not issuer

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config/config.js';
import User from '../models/user.js';

const userChecker = async(req,res,next) => {
    try{
        console.log("userchecker method called!!")
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
        next();
    }
    catch(err){
        console.error(err);
        return res.status(400).send("Invalid Cookie");
    }
}

export {
    userChecker,
}