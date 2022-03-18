import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import config from '../../config/config.js';
import Verifier from '../../models/verifier.js';

const verifierLoginHandler = async (req, res) => {
    try {
        console.log("trying to login verifier");
        let { username, password } = req.body;
        console.log(username, password)
        if (!(username && password)) {
            res.status(400).send("invalid details provided!!");
        }

        const verifier = await Verifier.findOne({ username: username })
        if (!verifier) {
            return res.status(400);
        }
        console.log(verifier,password)
        let passwordMatch = await bcrypt.compare(password, verifier.password);
        // console.log(passwordMatch)
        if (passwordMatch) {
            const token = jwt.sign(
                {
                    userID: verifier.id
                },
                config.jwtSecret,
                {
                    expiresIn: "2h",
                }
            );

            let resp = {
                username: username,
                userID: verifier.id,
            }
            // console.log(resp)
            console.log("successfully logged in verifier! Sending back jwt")
            return res.cookie("access_token",token,{
                httpOnly:true,
                secure:false

            }).status(200).json(resp);
        }
        return res.status(400).send("bad credentials!!")

    }
    catch (err) {
        console.log(err);
    }
}

const verifierLogoutHandler = (req,res) => {
    try {
        console.log("logout verifier called!!")
        res.clearCookie("access_token")
        return res.status(200).send("successfully logged out!!")
    }
    catch (err) {
        console.error(err);
    }
}

export {
    verifierLoginHandler,
    verifierLogoutHandler
}