import React, { useCallback, useContext, useEffect, useState } from "react";
import { issuerContext } from "../../context/IssuerContext";
import { Redirect } from 'react-router-dom';
import { Web3Context } from "../../context/Web3Context";
import { commonContext } from "../../context/CommonContext";
import { Button, Container } from "@chakra-ui/react";
import Web3 from "web3";
import ViewCredentialSchema from "./ViewCredentialSchema";
import Navbar from "./Navbar";


// page to view all created credential Schemas (from blockchain)
function ViewCredentialSchemas() {
    const { instance, web3Account } = useContext(Web3Context)
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [ownedSchemas, setOwnedSchemas] = useState([]);

    console.log(isIssuerLoggedin, isUserLoggedin)
    console.log(instance, web3Account)

    useEffect(() => {
        if (!isUserLoggedin && isIssuerLoggedin) getAllOwnedCredentialSchemas();
        return function cleanup() {
            setOwnedSchemas([])
        }
    }, [instance, web3Account])

    const getAllOwnedCredentialSchemas = useCallback(async () => {
        try {
            console.log(web3Account, "getting data from blockchain", instance)
            let result = await instance.methods.getAllOwnedCredentialSchemas().call({ from: web3Account })
            console.log(result);
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