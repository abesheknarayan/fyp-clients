import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import config from '../../config/config.js';
import Issuer from '../../models/issuer.js'

const issuerLoginHandler = async (req, res) => {
    try {
        console.log("trying to login issuer");
        let { username, password } = req.body;
        console.log(username, password)
        if (!(username && password)) {
            res.status(400).send("invalid details provided!!");
        }

        const issuer = await Issuer.findOne({ username: username })
        if (!issuer) {
            return res.status(400);
        }
        console.log(issuer,password)
        let passwordMatch = await bcrypt.compare(password, issuer.password);
        // console.log(passwordMatch)
        if (passwordMatch) {
            const token = jwt.sign(
                {
                    userID: issuer.id
                },
                config.jwtSecret,
                {
                    expiresIn: "2h",
                }
            );

            let resp = {
                username: username,
                userID: issuer.id,
            }
            // console.log(resp)
            console.log("successfully logged in issuer! Sending back jwt")
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

const issuerLogoutHandler = (req,res) => {
    try {
        console.log("logout user called!!")
        res.clearCookie("access_token")
        return res.status(200).send("successfully logged out!!")
    }
    catch (err) {
        console.error(err);
    }
}

export {
    issuerLoginHandler,
    issuerLogoutHandler
}