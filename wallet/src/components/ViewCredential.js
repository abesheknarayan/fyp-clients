import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from './Navbar';
import { db } from "../utils/db";
import { Container, Heading, Tbody, Thead, Table, Th, Td, Tr, Button } from "@chakra-ui/react";

function ViewCredential() {
    const path = useLocation();
    let credentialId = path.pathname.split("/").slice(-1)[0];
    const [credential, setCredential] = useState(null);
    const history = useHistory();
    const getCredentialFromIndexedDb = useCallback(async () => {
        try {
            let credential = await db.credentials.where('id').equals(Number(credentialId)).toArray();
            if (credential.length != 1) {
                return history.push('/dashboard');
            }
            let cred = {};
            
            cred.name = credential[0].credential.name;
            cred.version = credential[0].credential.version;
            cred.definitionId = credential[0].credential.definitionId;
            cred.revocationId = credential[0].credential.revocationId?credential[0].credential.revocationId:null;
            cred.publicWitnessIndex = credential[0].credential.publicWitnessIndex?credential[0].credential.publicWitnessIndex:null;
            cred.attributes = []
            for (let index in credential[0].credential.attributes) {
                cred.attributes.push(credential[0].credential.attributes[index])
            }
            setCredential(cred);
        }
        catch (err) {
            console.error(err);
        }
    })
    useEffect(() => {
        getCredentialFromIndexedDb();
    }, [])

    const handleCreateVerifiableCredential = () => {
        history.push(`/verifiablecredential/create/${credentialId}`)
    }

    return (
        <React.Fragment>
            <Navbar />
            <Container centerContent>
                {
                    credential && (
                        <React.Fragment>
                            <Heading margin='5' size={'md'}> Credential Metadata </Heading>
                            <Table>
                                <Tbody>
                                    <Tr>
                                        <Th>Credential</Th>
                                        <Td>{credential.name}</Td>
                                    </Tr>
                                    <Tr>
                                        <Th>Version</Th>
                                        <Td>{credential.version}</Td>
                                    </Tr>
                                    <Tr>
                                        <Th>Definition Id </Th>
                                        <Td>{credential.definitionId}</Td>
                                    </Tr>
                                    <Tr>
                                        <Th>Revocation Id </Th>
                                        <Td>{credential.revocationId?credential.revocationId:'NULL'}</Td>
                                    </Tr>
                                    <Tr>
                                        <Th>Public Witness Index </Th>
                                        <Td>{credential.publicWitnessIndex?credential.publicWitnessIndex:'NULL'}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                            <Heading margin='5' size='md'>Attributes</Heading>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Attribute</Th>
                                        <Th>Value</Th>
                                        <Th>Signature</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        credential.attributes.map((attribute, index) => {
                                            return (
                                                <Tr key = {index} >
                                                    <Td>{attribute.attributeName}</Td>
                                                    <Td>{attribute.value}</Td>
                                                    <Td maxW={'lg'}>{attribute.signature}</Td>
                                                </Tr>
                                            )
                                        })
                                    }
                                </Tbody>
                            </Table>
                            <Button onClick={handleCreateVerifiableCredential} m='5' colorScheme={'green'}>
                                Create Verifiable Credential 
                            </Button>
                        </React.Fragment>
                    )
                }
            </Container>
        </React.Fragment>
    )
}

export default ViewCredential;