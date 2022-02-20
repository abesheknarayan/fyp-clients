import React, { useContext, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { issuerContext } from "../../context/IssuerContext";
import { Web3Context } from "../../context/Web3Context";


function IssuerDashboard() {
    const { isLoggedin, issuer, fetchIssuer } = useContext(issuerContext);
    const {web3Account} = useContext(Web3Context)
    console.log(issuer, isLoggedin)
    console.log('rendering')

    if (!isLoggedin) return <Redirect to="/auth/issuer/login" />

    return (
        <React.Fragment>
            <h1> Issuer dashboard  </h1>
            <h2> Welcome {issuer.username} </h2>
            <h2> Issuer {web3Account} </h2>
        </React.Fragment>
    )
}

export default IssuerDashboard;