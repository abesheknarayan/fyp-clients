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

        let passwordMatch = await bcrypt.compare(password,user.password);
        // console.log(passwordMatch)
        if (user && passwordMatch) {
            const token = jwt.sign(
                {
                    userID: user.id
                },
                config.jwtSecret,
                {
                    expiresIn:"2h",
                }
            );
            let resp = {
                userID: user.id,
                token: token
            }
            console.log("successfully logged in user! Sending back jwt")
            return res.status(200).json(resp);
        }
        res.status(400).send("bad credentials!!")

    }
    catch (err) {
        console.log(err);
    }
}

const userLogoutHandler = () => {

}

export {
    userLoginHandler,
    userLogoutHandler
}