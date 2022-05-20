import { Heading, Stack, Tbody, Table, Thead, Tr, Td, Th, Button, Container } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { axiosInstance } from "../../utils/axios";
import Navbar from './Navbar';

function ViewIssuedCredentials() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [credentials, setCredentials] = useState([]);
    const history = useHistory();

    const getAllUserCredentials = useCallback(async () => {
        try {
            let result = await axiosInstance.get("/user/credential/all");
            setCredentials(result.data);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (isUserLoggedin && !isIssuerLoggedin) getAllUserCredentials();
    }, [])

    if (isIssuerLoggedin)
        return <Redirect to="/issuer/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />

    const handleViewCredential = (e) => {
        history.push(`/credential/issued/view/${e.target.id}`)
    } 

    return (
        <React.Fragment >
            <Navbar />
            <Container centerContent >
                {
                    credentials.length > 0 && (
                        <Stack margin='10'>
                            <Heading margin='10' style={{textAlign:'center'}} size='md' >
                                Your Credentials
                            </Heading>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th> Credential  </Th>
                                        <Th> Version </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        credentials.map((credential, index) => {
                                            return (
                                                <Tr key = {index}>
                                                    <Td>{credential.credential.name}</Td>
                                                    <Td>{credential.credential.version}</Td>
                                                    <Td><Button id = {credential._id} onClick={handleViewCredential}> View </Button></Td>
                                                </Tr>

                                            )
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </Stack>
                    )}
                {
                    !credentials.length > 0 && (
                        <Heading size='md'> No Credentials </Heading>
                    )
                }
            </Container>
        </React.Fragment>
    )
}

export default ViewIssuedCredentials;