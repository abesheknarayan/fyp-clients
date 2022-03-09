import { Button, Container } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { axiosInstance } from "../../utils/axios";
import Navbar from './Navbar';

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react'

function ViewIssuableCredentials() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const history = useHistory();

    const [credentials, setIssuableCredentials] = useState([]);
    console.log("rendering user issuable credentials")
    console.log(isIssuerLoggedin, isUserLoggedin)

    const fetchIssuableCredentials = useCallback(async () => {
        try {
            let res = await axiosInstance.get("/user/credentials/issuable")
            setIssuableCredentials(res.data);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        fetchIssuableCredentials();
        return function cleanup() {
            setIssuableCredentials([])
        }
    }, [])

    if (isIssuerLoggedin)
        return <Redirect to="/issuer/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />


    const handleViewCredential = (e) => {
        history.push(`/user/credential/view/${e.target.id}`)
    }

    return (
        <React.Fragment >
            <Navbar />
            <Container >
                <Table variant='simple'>
                    <TableCaption>Credentials Issued by Issuer</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Credential </Th>
                            <Th>Version</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            credentials.map((cred, index) => {
                                return (
                                    <Tr key={index} >
                                        <Td >{cred.name}</Td>
                                        <Td>{cred.version}</Td>
                                        <Td>
                                            <Button id={cred._id} onClick={handleViewCredential}>View</Button>
                                        </Td>
                                    </Tr>
                                )
                            })

                        }
                    </Tbody>

                </Table>
            </Container>
        </React.Fragment>
    )
}

export default ViewIssuableCredentials