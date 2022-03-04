import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import Navbar from './Navbar';

function ViewRequestedCredentials() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    console.log("rendering user's requests")
    console.log(isIssuerLoggedin, isUserLoggedin)
    
    if(isIssuerLoggedin) 
        return <Redirect to="/issuer/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />

    return (
        <React.Fragment >
            <Navbar  />
            <h1> All user's credential request comes here!!  </h1>
        </React.Fragment>
    )
}


export default ViewRequestedCredentials;