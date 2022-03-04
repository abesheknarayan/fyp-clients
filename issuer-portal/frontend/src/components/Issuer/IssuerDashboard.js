import React, { useContext, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";
import { issuerContext } from "../../context/IssuerContext";
import { Web3Context } from "../../context/Web3Context";
import Navbar from './Navbar'

function IssuerDashboard() {
    const { isLoggedin, issuer, fetchIssuer } = useContext(issuerContext);
    const {isIssuerLoggedin,isUserLoggedin} = useContext(commonContext);
    const {web3Account} = useContext(Web3Context)
    console.log(isIssuerLoggedin,isUserLoggedin);
    console.log(issuer, isLoggedin)
    console.log('rendering')

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    return (
        <React.Fragment>
            <Navbar></Navbar>
            <h1> Issuer dashboard  </h1>
            <h2> Welcome {issuer.username} </h2>
            <h2> Issuer {web3Account} </h2>
        </React.Fragment>
    )
}

export default IssuerDashboard;