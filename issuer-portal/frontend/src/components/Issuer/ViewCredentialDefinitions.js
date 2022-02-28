import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect } from 'react-router-dom';
import { Web3Context } from "../../context/Web3Context";
import { commonContext } from "../../context/CommonContext";
import { Container } from "@chakra-ui/react";
import ViewCredentialDefinition from "./ViewCredentialDefinition";
import Navbar from "./Navbar";


// page to view all created credential Schemas (from blockchain)
function ViewCredentialDefinitions() {
    const { instance, web3Account } = useContext(Web3Context)
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [ownedDefinitions, setOwnedDefinitions] = useState([]);

    console.log(isIssuerLoggedin, isUserLoggedin)
    console.log(instance, web3Account)

    useEffect(() => {
        if (!isUserLoggedin && isIssuerLoggedin) getAllOwnedCredentialDefinitions();
        return function cleanup() {
            setOwnedDefinitions([])
        }
    }, [instance, web3Account])

    const getAllOwnedCredentialDefinitions = useCallback(async () => {
        try {
            console.log(web3Account, "getting data from blockchain", instance)
            let result = await instance.methods.getAllOwnedCredentialDefinitions().call({ from: web3Account })
            console.log(result);
            setOwnedDefinitions(result);
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
                {ownedDefinitions.map((definition, index) => < ViewCredentialDefinition value={definition} key={index} />)}
            </Container>
        </React.Fragment>
    )
}

export default ViewCredentialDefinitions;