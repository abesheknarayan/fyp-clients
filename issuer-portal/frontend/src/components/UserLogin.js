import React, { useContext, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { Input, Container, Button } from "@chakra-ui/react";
import { userContext } from "../context/UserContext";
import { Redirect, useHistory } from "react-router-dom";
import { commonContext } from "../context/CommonContext";

function UserLogin() {
    const history = useHistory();
    const [aadhar, setAadhar] = useState('');
    const [password, setPassword] = useState('');
    const { user, saveUser,isLoggedin } = useContext(userContext);
    const { isIssuerLoggedin } = useContext(commonContext);
    console.log("in user login!!");
    console.log(isIssuerLoggedin,isLoggedin);

    if(isIssuerLoggedin) return <Redirect to="/issuer/dashboard" />

    if(isLoggedin) return <Redirect to="/user/dashboard" />
    const handleSubmit = async () => {
        try {
            if (!(aadhar && password)) {
                // do nothing
                return
            }
            let res = await axiosInstance.post('/auth/user/login', {
                aadharID: aadhar,
                password: password
            })
            if (res.data && res.data.userID) {
                console.log("successfull user login!!")
                saveUser(res.data)
                history.push("/user/dashboard")
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleChangeAadhar = (e) => {
        setAadhar(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    return (
        <React.Fragment>
            <Container centerContent>
                <h1> User Login Page </h1>
                <Input placeholder="aadhar id" size='md' value={aadhar} required onInput={handleChangeAadhar}></Input>
                <Input placeholder="password" size='md' value={password} required type="password" onInput={handleChangePassword}></Input>
                <Button onClick={handleSubmit}>Login</Button>
            </Container>
        </React.Fragment>
    )
}

export default UserLogin;