import React, { useContext } from "react";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";
import { verifierContext } from "../../context/VerifierContext";
import { Web3Context } from "../../context/Web3Context";
import Navbar from './Navbar'

function VerifierDashboard() {
    const { isLoggedin, verifier } = useContext(verifierContext);
    const {isVerifierLoggedin,isUserLoggedin} = useContext(commonContext);
    const {web3Account} = useContext(Web3Context)
    console.log(isVerifierLoggedin,isUserLoggedin);
    console.log(verifier, isLoggedin)
    console.log('rendering')

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isVerifierLoggedin) return <Redirect to="/auth/verifier/login" />

    return (
        <React.Fragment>
            <Navbar></Navbar>
            <h1> Verifier dashboard  </h1>
            <h2> Welcome {verifier.username} </h2>
            <h2> Issuer {web3Account} </h2>
        </React.Fragment>
    )
}

export default VerifierDashboard;