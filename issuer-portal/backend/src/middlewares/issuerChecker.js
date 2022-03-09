// parsing jwt comes here
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config/config.js';
import Issuer from '../models/issuer.js';

const checkIssuer = async (req,res,next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).send("access denied");
        }
        console.log("here");
        const data = jwt.verify(token, config.jwtSecret);
        req.userID = data.userID
        console.log(data.userID)
        let user = await Issuer.findById(mongoose.Types.ObjectId(data.userID))
        // console.log(user);
        console.log("here2");
        if (!user) return res.status(401).send("access denied");
        console.log("authorized user in middleware")
        next();
    }
    catch (err) {
        console.error(err);
    }
}

export { checkIssuer };