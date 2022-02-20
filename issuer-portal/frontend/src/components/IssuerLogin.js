import React, { useContext, useState } from "react";
import {Button, Container, Input } from '@chakra-ui/react';
import { axiosInstance } from "../utils/axios";
import { issuerContext } from "../context/IssuerContext";
import { Redirect, useHistory } from 'react-router-dom';

function IssuerLogin() {
    const history = useHistory()
    const [username, setUsername] = useState('');
    const [passsword, setPassword] = useState('');
    const { saveIssuer,isLoggedin } = useContext(issuerContext)
    console.log(isLoggedin)

    if(isLoggedin) return <Redirect to='/issuer/dashboard' />

    const handleSubmit = async() => {
        try {
            if(!(username && passsword)) {
                // do nothing
                return
            }
            let res = await axiosInstance.post('/auth/issuer/login',{
                username:username,
                password:passsword
            })
            // console.log(res);
            // successfull login
            if(res.data && res.data.userID) {
                console.log("successfull login!!")
                console.log(saveIssuer)
                saveIssuer(res.data)
                history.push("/issuer/dashboard")
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const handleChangeUsername = (e) => {
        setUsername(e.target.value)
        // console.log(username,e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
        // console.log(passsword,e.target.value);
    }

    return (
        <React.Fragment>
            <Container centerContent>
                <Input placeholder="username" size='md' value={username} required onInput={handleChangeUsername}></Input>
                <Input placeholder="password" size='md' value={passsword} required type="password" onInput={handleChangePassword}></Input>
                <Button onClick={handleSubmit}>Login</Button>
            </Container>
        </React.Fragment>
    )
}

export default IssuerLogin;