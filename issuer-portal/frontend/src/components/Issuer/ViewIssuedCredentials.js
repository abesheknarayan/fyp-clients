import { Container } from "@chakra-ui/react";
import { commonContext } from "../../context/CommonContext";
import { Redirect } from "react-router-dom";
import React, { useContext } from "react";
import Navbar from './Navbar'

// page to view all created credentials by issuer (only details like revocationId,witness,userId maybe stored)
function ViewIssuedCredentialsIssuer() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    return (
        <React.Fragment>
            <Navbar />
            <Container>
                Page to view all Issued Credentials for revocation purpose
            </Container>
        </React.Fragment>
    )
}

export default ViewIssuedCredentialsIssuer;