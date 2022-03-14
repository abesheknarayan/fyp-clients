import { Container, Table, Tbody, Td, Tr, Button, Thead, Th } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../utils/db";
import Navbar from './Navbar';


/* TODO: 
show a list of all unlinked key pairs
*/

function LinkCredentials() {

    const [keypairs, setKeyPairs] = useState([])
    const history = useHistory();
;
    const getUnusedKeyPairsFromIndexedDb = useCallback(async () => {
        try {
            let result = await db.keypairs.toArray();
            console.log(result);
            setKeyPairs(result);
        }
        catch (err) {
            console.error(err);
        }
    })
    useEffect(() => {
        getUnusedKeyPairsFromIndexedDb();
    }, [])

    const handleLinkCredential = (e) => {
        history.push(`/credential/link/${e.target.id}`);
    }


    return (
        <React.Fragment>
            <Navbar />
            <Container>
                <Table>
                    <Thead>
                        <Tr>
                            <Th> Credential </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            keypairs.map((keypair, index) => {
                                return (
                                    <Tr key={index}>
                                        <Td>{keypair.credentialName}</Td>
                                        <Td>
                                            <Button id={keypair.id} onClick={handleLinkCredential}> Link </Button>
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

export default LinkCredentials;