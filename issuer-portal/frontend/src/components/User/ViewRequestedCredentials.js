import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { axiosInstance } from "../../utils/axios";
import Navbar from './Navbar';

function ViewRequestedCredentials() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [requests, setRequests] = useState([])

    const getAllRequestedCredentials = useCallback(async () => {
        try {
            let result = await axiosInstance.get('/user/credential/requests');
            setRequests(result.data);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (isUserLoggedin && !isIssuerLoggedin) getAllRequestedCredentials();
    }, [])

    if (isIssuerLoggedin)
        return <Redirect to="/issuer/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />

    return (
        <React.Fragment >
            <Navbar />
            <Container centerContent>
                {
                    requests.length > 0 && (
                        <Stack>
                            <Heading margin='10' size='md'> Requested Credentials </Heading>
                            {
                                requests.map((req, index) => {
                                    return (
                                        <Text style={{textAlign:'center'}} key={index} margin={'2'}>
                                            {req.credentialName}
                                        </Text>
                                    )
                                })
                            }
                        </Stack>
                    )
                }
                {
                    !requests.length > 0 && (
                        <Heading size="lg" margin="10">
                            No requests !!
                        </Heading>
                    )
                }
            </Container>
        </React.Fragment>
    )
}


export default ViewRequestedCredentials;