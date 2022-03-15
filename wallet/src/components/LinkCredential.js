import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../utils/db';
import { ConvertArrayBuffertoHexString, ConvertHexStringtoArrayBuffer, decrypt, deriveKey } from '../utils/crypto';
import Navbar from './Navbar';
import { Container, Table, Tbody, Td, Tr, Textarea, Button, useClipboard, Stack, FormLabel, Input } from '@chakra-ui/react'

function LinkCredential() {
    const path = useLocation();
    let keyPairId = path.pathname.split("/").slice(-1)[0];
    const [keyPair, setKeyPair] = useState(null);
    const [credential, setCredential] = useState(null);
    const {hasCopied, onCopy} = useClipboard(keyPair?keyPair.publicKey:null);

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
            console.log(privateKey);
            let decoder = new TextDecoder();
            let credentialBuffer = ConvertHexStringtoArrayBuffer(credential);
            let credentialObj = decoder.decode(credentialBuffer);
            let finalCredential = JSON.parse(credentialObj);
            let decryptedCredential = {};
            decryptedCredential.name = finalCredential.name;
            decryptedCredential.version = finalCredential.version;
            decryptedCredential.attributes = {};
            for(let [key,value] of Object.entries(finalCredential.attributes))
            {
                console.log(key);
                let decryptedValue = await decrypt(privateKey,value.value);
                decryptedCredential.attributes[`${key}`] = {
                    attributeName: value.attributeName,
                    value: decryptedValue,
                    signature: value.signature,
                }
            }
            console.log(decryptedCredential);
            await db.credentials.add({
                keyPairId: keyPairId,
                credential: decryptedCredential,
            })
            let newKeyPair = keyPair;
            newKeyPair.used = true
            await db.keypairs.put(newKeyPair, keyPairId)
        }
        catch (err) {
            console.error(err);
        }
    }

    const encodePublicKey = (publicKey) => {
        if(! publicKey) return;
        let stringifiedKey = JSON.stringify(publicKey);
        let encoder = new TextEncoder();
        let encodedKey = encoder.encode(stringifiedKey);
        return ConvertArrayBuffertoHexString(encodedKey);
    }


    return (
        <React.Fragment>
            <Navbar />
            <Container centerContent>
                {
                    keyPair && (
                        
                        <React.Fragment>
                            <Table>
                                <Tbody>
                                    <Tr>
                                        <Td>Credential</Td>
                                        <Td>{keyPair.credentialName}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                            <Stack padding={5}>
                                <FormLabel style={{textAlign:'center'}}>Encoded Public Key</FormLabel>
                                <Input value={encodePublicKey(keyPair.publicKey)} isReadOnly />
                                <Button margin={1} onClick={onCopy} >
                                    Copy
                                </Button>
                            </Stack>
                        </React.Fragment>
                    )
                }

                <Textarea onInput={handleCredentialChange} placeholder="Paste ur credential here">
                </Textarea>
                <Button margin={2} onClick={handleSaveCredential}>
                    Link Credential
                </Button>
            </Container>

        </React.Fragment>
    )
}

export default LinkCredential;