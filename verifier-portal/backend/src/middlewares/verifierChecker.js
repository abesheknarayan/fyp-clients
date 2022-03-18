// parsing jwt comes here
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config/config.js';
import Verifier from '../models/verifier.js';

const checkVerifier = async (req,res,next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).send("access denied");
        }
        const data = jwt.verify(token, config.jwtSecret);
        req.userID = data.userID
        console.log(data.userID)
        let user = await Verifier.findById(mongoose.Types.ObjectId(data.userID))
        if (!user) return res.status(401).send("access denied");
        console.log("authorized user in middleware")
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(400).send("Invalid Cookie");
    }
}

export { checkVerifier };