import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import config from './config/config.js'
import VerifierRoute from './routes/verifierRoute.js'
import AuthRoute from './routes/authRoute.js'
import UserRoute from './routes/userRoute.js'
import CredentialRoute from './routes/credRoute.js'
import database from './utils/db.js'

import Web3 from 'web3';
import Contract from '@truffle/contract'
import SSIContract from './contracts-build/SSI.json';



const app = express()

// app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));

// mongodb connection
database()

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
} else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
}

export const SSI = Contract(SSIContract)
SSI.setProvider(web3.currentProvider);

var contract,accounts;



// good bug, generally cant use * cuz if we need cookies then list of origins has to be specified along with setting credentials = true
app.use(cors({
    origin: 'http://localhost:3002',
    credentials: true
}))


// all routes 
app.use('/auth', AuthRoute)
app.use('/verifier', VerifierRoute)
app.use('/user', UserRoute)
app.use('/credential', CredentialRoute)


app.get("/", (req, res) => {
    res.send("issuer portal api")
})

app.listen(config.port, async () => {
    try {
        console.log(`app listening on port ${config.port}`);
        accounts = await web3.eth.getAccounts();
        contract = await SSI.deployed();
    }
    catch(err)
    {
        console.error(err);
    }
})

export {
    contract,
    accounts,
}