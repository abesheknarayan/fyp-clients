import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import config from './config/config.js'
import IssuerRoute from './routes/issuerRoute.js'
import AuthRoute from './routes/authRoute.js'
import UserRoute from './routes/userRoute.js'
import CredentialRoute from './routes/credRoute.js'
import database from './utils/db.js'

const app = express()

// app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(cookieParser())

app.use(express.urlencoded({extended:true}));

// mongodb connection
database()


// good bug, generally cant use * cuz if we need cookies then list of origins has to be specified along with setting credentials = true
app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}))


// all routes 
app.use('/auth',AuthRoute)
app.use('/issuer',IssuerRoute)
app.use('/user',UserRoute)
app.use('/credential',CredentialRoute)


app.get("/",(req,res)=>{
    res.send("issuer portal api")
})

app.listen(config.port,()=> {
    console.log(`app listening on port ${config.port}`);
})