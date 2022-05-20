import { Container, Table, Thead, Tbody, Tr, Th, Td, Button,Heading } from "@chakra-ui/react";
import { commonContext } from "../../context/CommonContext";
import { Redirect } from "react-router-dom";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Navbar from './Navbar'
import { axiosInstance } from "../../utils/axios";
import { Web3Context } from "../../context/Web3Context";
import { config } from "../../config/config";
import { revocateCredential } from "../../utils/crypto";

// page to view all created credentials by issuer (only details like revocationId,witness,userId maybe stored)
function ViewIssuedCredentialsIssuer() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [credentials, setCredentials] = useState([])
    const { instance, web3Account } = useContext(Web3Context);


    const fetchAllIssuedCredentials = useCallback(async () => {
        try {
            let res = await axiosInstance.get('/credential/issued/all');
            setCredentials(res.data);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (!isUserLoggedin && isIssuerLoggedin) fetchAllIssuedCredentials();
        return function cleanup() {
            setCredentials([])
        }
    }, [])

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />


    const handleRevocation = async (e) => {
        let { id } = e.target;
        // revocate the credential here
        // 1. Delete from db
        // 2. Change accumulator and public witnesses

        let credentialDefinitionId = credentials[id].credentialDefinitionId;

        let oldAccumulatorValue = await instance.methods
            .getAccumulatorForCredentialDefinition(credentialDefinitionId)
            .call();


        let oldPublicWitnessList = await instance.methods
            .getAllPublicWitnesses(credentialDefinitionId)
            .call()

        let privateWitness = config.primes[credentials[id].publicWitnessIndex];
        let { accumulatorValue, publicWitnessList } = revocateCredential(oldAccumulatorValue, oldPublicWitnessList, privateWitness, credentials[id].publicWitnessIndex)


        await instance.methods
            .updateRevocationRegistryOnCredentialIssuance(credentialDefinitionId, publicWitnessList, accumulatorValue)
            .send({ from: web3Account })

        await axiosInstance.post('/credential/delete', {
            credentialId: credentials[id].credentialId
        })
        setCredentials([...credentials.splice(0, id), ...credentials.splice(id + 1)])
    }


    return (
        <React.Fragment>
            <Navbar />
            <Container>
                {
                    credentials.length > 0 && (
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Credential Name</Th>
                                    <Th>Aadhar Id</Th>
                                    <Th>Revocate Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    credentials && (
                                        credentials.map((cred, index) => {
                                            return (
                                                <Tr>
                                                    <Td>{cred.credentialName}</Td>
                                                    <Td>{cred.userAadhar}</Td>
                                                    <Td><Button id={index} onClick={handleRevocation} size='sm' colorScheme={'red'} >Revocate</Button></Td>
                                                </Tr>
                                            )
                                        })
                                    )
                                }
                            </Tbody>
                        </Table>
                    )
                }
                {
                    !credentials.length > 0 && (
                        <Heading size={'lg'} margin={'10'}>No Credentials Issued !!</Heading>
                    )
                }

            </Container>
        </React.Fragment>
    )
}

export default ViewIssuedCredentialsIssuer;