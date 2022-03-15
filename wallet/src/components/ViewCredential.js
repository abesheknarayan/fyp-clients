import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from './Navbar';
import { db } from "../utils/db";
import { Container, Heading, Tbody, Thead, Table, Th, Td, Tr } from "@chakra-ui/react";

function ViewCredential() {
    const path = useLocation();
    let credentialId = path.pathname.split("/").slice(-1)[0];
    const [credential, setCredential] = useState(null);
    const history = useHistory();
    const getCredentialFromIndexedDb = useCallback(async () => {
        try {
            let credential = await db.credentials.where('id').equals(Number(credentialId)).toArray();
            console.log(credential);
            if (credential.length != 1) {
                return history.push('/dashboard');
            }
            let cred = {};
            cred.name = credential[0].credential.name;
            cred.version = credential[0].credential.version;
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
                                                <Tr >
                                                    <Td>{attribute.attributeName}</Td>
                                                    <Td>{attribute.value}</Td>
                                                    <Td maxW={'lg'}>{attribute.signature}</Td>
                                                </Tr>
                                            )
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </React.Fragment>
                    )
                }
            </Container>
        </React.Fragment>
    )
}

export default ViewCredential;