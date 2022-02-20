// script for seeding some predefined users
import bcrypt from 'bcrypt';


import database from '../utils/db.js'
import { createIssuer } from '../controllers/issuer/issuerController.js'
import { createUser } from '../controllers/user/userController.js';

database()

let seedIssuer = async () => {
    try {
        console.log("creating dummy issuer");
        let user = await createIssuer("govt", "password");
        console.log(user)
        let match = await bcrypt.compare("password",user.password)
        console.log(match)
    }
    catch (err) {
        console.error(err);
    }
}

await seedIssuer()

let seedUser = async () => {
    try {
        console.log("creating dummy User");
        await createUser("abeshek","password","12345675665645")
    }
    catch (err) {
        console.error(err);
    }
}

await seedUser()

process.exit()