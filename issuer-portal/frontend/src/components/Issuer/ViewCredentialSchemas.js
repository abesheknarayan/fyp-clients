import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect } from 'react-router-dom';
import { Web3Context } from "../../context/Web3Context";
import { commonContext } from "../../context/CommonContext";
import { Container } from "@chakra-ui/react";
import ViewCredentialSchema from "./ViewCredentialSchema";
import Navbar from "./Navbar";


// page to view all created credential Schemas (from blockchain)
function ViewCredentialSchemas() {
    const { instance, web3Account } = useContext(Web3Context)
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [ownedSchemas, setOwnedSchemas] = useState([]);


    useEffect(() => {
        if (!isUserLoggedin && isIssuerLoggedin) getAllOwnedCredentialSchemas();
        return function cleanup() {
            setOwnedSchemas([])
        }
    }, [instance, web3Account])

    const getAllOwnedCredentialSchemas = useCallback(async () => {
        try {
            let result = await instance.methods.getAllOwnedCredentialSchemas().call({ from: web3Account })
            setOwnedSchemas(result);
        }
        catch (err) {
            console.error(err);
        }
    });


    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />




    return (
        <React.Fragment >
            <Navbar></Navbar>
            <Container width='fit-content' display='flex' centerContent >
                {ownedSchemas.map((schema, index) => < ViewCredentialSchema value={schema} key={index} />)}
            </Container>
        </React.Fragment>
    )
}

export default ViewCredentialSchemas;