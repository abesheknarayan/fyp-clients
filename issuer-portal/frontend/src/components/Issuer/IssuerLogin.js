import React, { useContext, useState } from "react";
import { Button, Container, Input } from '@chakra-ui/react';
import { axiosInstance } from "../../utils/axios";
import { issuerContext } from "../../context/IssuerContext";
import { Redirect, useHistory } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";

function IssuerLogin() {
    const history = useHistory()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { saveIssuer, isLoggedin } = useContext(issuerContext)
    const { isUserLoggedin } = useContext(commonContext);

    console.log(isUserLoggedin)

    // not allowing simultaneous login
    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (isLoggedin) return <Redirect to='/issuer/dashboard' />

    const handleSubmit = async () => {
        try {
            if (!(username && password)) {
                // do nothing
                return
            }
            let res = await axiosInstance.post('/auth/issuer/login', {
                username: username,
                password: password
            })
            // successfull login
            if (res.data && res.data.userID) {
                console.log("successfull login!!")
                console.log(saveIssuer)
                saveIssuer(res.data)
                history.push("/issuer/dashboard")
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    return (
        <React.Fragment>
            <Container centerContent>
                <h1> Issuer Login Page </h1>
                <Input placeholder="username" size='md' value={username} required onInput={handleChangeUsername}></Input>
                <Input placeholder="password" size='md' value={password} required type="password" onInput={handleChangePassword}></Input>
                <Button onClick={handleSubmit}>Login</Button>
            </Container>
        </React.Fragment>
    )
}

export default IssuerLogin;