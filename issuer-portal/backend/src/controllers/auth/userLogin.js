import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import config from '../../config/config.js';
import User from "../../models/user.js";

const userLoginHandler = async (req, res) => {
    try {
        console.log("trying to login user");
        let { aadharID, password } = req.body;
        // console.log(aadharID,password)
        if (!(aadharID && password)) {
            res.status(400).send("invalid details provided!!");
        }

        const user = await User.findOne({ aadharId: aadharID })

        // console.log(user);
        if(!user) res.status(400).send("bad credentials")

        let passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch)
        if (passwordMatch) {
            const token = jwt.sign(
                {
                    userID: user.id
                },
                config.jwtSecret,
                {
                    expiresIn: "2h",
                }
            );

            let resp = {
                aadharID: user.aadharId,
                userID: user.id,
            }
            console.log(resp)
            console.log("successfully logged in user! Sending back jwt")
            return res.cookie("access_token", token, {
                httpOnly: true,
                secure: false

            }).status(200).json(resp);
        }
        return res.status(400).send("bad credentials!!")

    }
    catch (err) {
        console.log(err);
    }
}

const userLogoutHandler = async (req,res) => {
    try {
        console.log("logout issuer called!!")
        res.clearCookie("access_token")
        return res.status(200).send("successfully logged out!!")
    }
    catch (err) {
        console.error(err);
    }
}

export {
    userLoginHandler,
    userLogoutHandler
}