import bcrypt from 'bcrypt';
import User from "../../models/user.js"
import config from "../../config/config.js"

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


export {
    createUser
}