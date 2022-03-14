import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../utils/db';
import { decrypt } from '../utils/crypto';
import Navbar from './Navbar';
import { Container, Table, Tbody, Td, Tr, Textarea, Editable, EditablePreview, EditableInput } from '@chakra-ui/react'

function LinkCredential() {
    const path = useLocation();
    let keyPairId = path.pathname.split("/").slice(-1)[0];
    const [keyPair, setKeyPair] = useState(null);
    const [credential, setCredential] = useState(null);
    console.log("rendering")

    const getCredentialFromIndexedDb = useCallback(async () => {
        try {
            let keypair = await db.keypairs.where("id").equals(Number(keyPairId)).toArray();
            console.log(keypair);
            setKeyPair(keypair[0]);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        getCredentialFromIndexedDb();
    }, [])

    const handleCredentialChange = (e) => {
        setCredential(e.target.value);
    }

    const handleSaveCredential = async () => {
        try {
            /* TODO: 
                decrypt the credential back using private key
                store it in indexed db
            */
            let privateKey = keyPair.privateKey;
            let decryptedCredential = decrypt(privateKey, credential);
            console.log(decryptedCredential);
            await db.credentials.add({
                keyPairId: keyPairId,
                credential: decryptedCredential,
            })
            let newKeyPair = keyPair;
            newKeyPair.used = true
            await db.keypairs.put(newKeyPair,keyPairId)
        }
        catch (err) {
            console.error(err);
        }
    }


    return (
        <React.Fragment>
            <Navbar />
            <Container centerContent>
                {
                    keyPair && (
                        <Table>
                            <Tbody>
                                <Tr>
                                    <Td>Credential</Td>
                                    <Td>{keyPair.credentialName}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    )
                }
                <Textarea onInput={handleCredentialChange} placeholder="Paste ur credential here">

                </Textarea>
            </Container>

        </React.Fragment>
    )
}

export default LinkCredential;