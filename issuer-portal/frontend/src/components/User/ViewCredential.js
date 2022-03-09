import {
    Container, Text,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Box,
    Button,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { axiosInstance } from "../../utils/axios";
import Navbar from './Navbar'


// component for viewing single credential
function ViewCredential() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const path = useLocation();
    const [credential, setCredential] = useState(null)
    let credentialDefinitionDBId = path.pathname.split("/").slice(-1)[0];
    console.log(credentialDefinitionDBId)

    const fetchCredentialDetails = useCallback(async () => {
        try {
            let credential = await axiosInstance.get(`/credential/${credentialDefinitionDBId}`);
            console.log(credential.data);
            setCredential(credential.data)
        }
        catch (err) {
            console.error(err);
        }
    })


    useEffect(() => {
        if (!isIssuerLoggedin && isUserLoggedin) fetchCredentialDetails();
        return function cleanup() {
            setCredential(null);
        }
    }, [])

    if (isIssuerLoggedin)
        return <Redirect to="/issuer/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />
    
    
    const handleRequestSubmit = async() => {
        try{
            await axiosInstance.post(`/credential/request`,{
                definitionId: credentialDefinitionDBId
            }); 

        }
        catch(err)
        {
            console.error(err);
        }
    }

    return (
        <React.Fragment >
            <Navbar />
            
            {
                credential && (
                    
                    <Container  centerContent>
                        <Text fontSize={'xl'} margin={'10'} > Credential Detail </Text>
                        <Table variant='simple'>
                            <Tbody>
                                <Tr>
                                    <Td>Credential Name:</Td>
                                    <Td>{credential.definition.name}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Credential Version</Td>
                                    <Td>{credential.definition.version}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Schema Name</Td>
                                    <Td>{credential.schema.name}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Schema Version</Td>
                                    <Td>{credential.schema.version}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                        <Text fontSize={'xl'} margin={'10'} > Attributes </Text>
                        <Table variant='simple'>
                            <Tbody>
                                {JSON.parse(credential.schema.attributes).map((attribute,index)=>{
                                    return (
                                        <Tr key={index}>
                                            <Td> {attribute.value} </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                        <Button margin={'10'} colorScheme={'blue'} onClick={handleRequestSubmit}>Request Credential</Button>
                    </Container>
                )
            }
            {
                !credential && (
                    <Container >
                        <Text>
                            Credential Not Found !!
                        </Text>
                    </Container>
                )
            }

        </React.Fragment>
    )
}

export default ViewCredential;