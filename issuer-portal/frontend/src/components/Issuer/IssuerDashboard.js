import React, { useContext, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { issuerContext } from "../../context/IssuerContext";


function IssuerDashboard() {
    const { isLoggedin, issuer, fetchIssuer } = useContext(issuerContext);
    console.log(issuer, isLoggedin)
    console.log('rendering')

    if (!isLoggedin) return <Redirect to="/auth/issuer/login" />

    return (
        <React.Fragment>
            <h1> Issuer dashboard  </h1>
            <h2> Welcome {issuer.username} </h2>
        </React.Fragment>
    )
}

export default IssuerDashboard;