import { Container, Tbody, Th, Thead, Table, Tr, Td, Button } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../utils/db";
import Navbar from './Navbar';

function ViewAllCredentials() {

    const [credentials, setCredentials] = useState([]);
    const history = useHistory();

    const getAllCredentialsFromIndexedDB = useCallback(async () => {
        try {
            let result = await db.credentials.toArray();
            console.log(result);
            setCredentials(result);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        getAllCredentialsFromIndexedDB();
    }, [])

    const handleViewCredential = (e) => {
        history.push(`/credential/view/${e.target.id}`);
    }


    return (
        <React.Fragment>
            <Navbar />
            <Container centerContent>
                {
                    credentials.length > 0 &&
                    <React.Fragment>
                        <Table margin='5'>
                            <Thead>
                                <Tr>
                                    <Th>Credential</Th>
                                    <Th>Version</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    credentials.map((cred, index) => {
                                        console.log(cred);
                                        return (
                                            <Tr key={index}>
                                                <Td>{cred.credential.name}</Td>
                                                <Td>{cred.credential.version}</Td>
                                                <Td>
                                                    <Button id={cred.id} onClick={handleViewCredential}>
                                                        View
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                    </React.Fragment>
                }
            </Container>
        </React.Fragment>
    )
}

export default ViewAllCredentials;