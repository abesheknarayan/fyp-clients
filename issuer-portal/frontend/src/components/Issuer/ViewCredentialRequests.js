import { Container,Button,Table ,Th, Tr,Td, Tbody, Thead } from "@chakra-ui/react";
import { commonContext } from "../../context/CommonContext";
import { Redirect, useHistory } from "react-router-dom";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Navbar from './Navbar'
import { axiosInstance } from "../../utils/axios";

function ViewCredentialRequests() {
    const history = useHistory();
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [requests, setRequests] = useState([])


    const getAllCredentialRequests = useCallback(async () => {
        try {
            let resp = await axiosInstance.get("/credential/requests");
            console.log(resp);
            setRequests(resp.data);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (!isUserLoggedin && isIssuerLoggedin) getAllCredentialRequests();
        return function cleanup() {
            setRequests([])
        }
    }, [])

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    const handleIssueCredential = (e) => {
        history.push(`/credential/issue/${e.target.id}`);   
    }

    return (
        <React.Fragment>
            <Navbar />
            <Container>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>
                                Credential
                            </Th>
                            <Th>
                                Version
                            </Th>
                            <Th>
                                Aadhar Number
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            requests.map((request,index)=>{
                                return(
                                    <Tr key={index}>
                                        <Td> {request.credentialName} </Td>
                                        <Td> {request.credentialVersion} </Td>
                                        <Td> {request.aadharId} </Td>
                                        <Td> <Button variant={'outline'} colorScheme='linkedin' id={request._id} onClick={handleIssueCredential}> Issue </Button> </Td>
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

export default ViewCredentialRequests;