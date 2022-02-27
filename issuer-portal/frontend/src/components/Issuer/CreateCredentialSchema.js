import React, { useContext, useEffect } from "react";
import { issuerContext } from "../../context/IssuerContext";
import Form from "../Common/form/Form";

import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";
import { Container } from "@chakra-ui/react";

function CreateCredentialSchema() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);

    console.log(isIssuerLoggedin, isUserLoggedin)

    // not allowing simultaneous login
    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    return (
        <React.Fragment>
            <Container centerContent>
                <h1> Create Credential Schema </h1>
                <Form />
            </Container>
        </React.Fragment>
    )
}

export default CreateCredentialSchema;