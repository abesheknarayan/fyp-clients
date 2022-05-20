import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { db } from '../utils/db';
import { ConvertArrayBuffertoHexString, ConvertHexStringtoArrayBuffer, decrypt, deriveKey } from '../utils/crypto';
import Navbar from './Navbar';
import { Container, Table, Tbody, Td, Tr, Textarea, Button, useClipboard, Stack, FormLabel, Input, useTab, useToast } from '@chakra-ui/react'

function LinkCredential() {
    const path = useLocation();
    let keyPairId = path.pathname.split("/").slice(-1)[0];
    const [keyPair, setKeyPair] = useState(null);
    const toast = useToast()
    const history = useHistory()
    const [encodedPublicKey,setEncodedPublicKey] = useState(null)
    const [credential, setCredential] = useState(null);
    const {hasCopied, onCopy} = useClipboard(keyPair?encodedPublicKey:null);

    const getCredentialFromIndexedDb = useCallback(async () => {
        try {
            let keypair = await db.keypairs.where("id").equals(Number(keyPairId)).toArray();
            setKeyPair(keypair[0]);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        getCredentialFromIndexedDb();
    }, [])

    useEffect(() => {
        if(keyPair)
            setEncodedPublicKey(encodePublicKey(keyPair.publicKey))
    },[keyPair])

    const returnToast = (result,msg) => {
        if (!result) {
            toast({
                title: `Error in linking credential: ${msg}`,
                status: 'error',
                isClosable: 'true',
                duration: 3000
            })
        }
        else {
            toast({
                title: 'Successfully linked credential to key pair',
                status: 'success',
                isClosable: 'true',
                duration: 3000
            })
        }
    }
    

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
            let decoder = new TextDecoder();
            let credentialBuffer = ConvertHexStringtoArrayBuffer(credential);
            let credentialObj = decoder.decode(credentialBuffer);
            let finalCredential = JSON.parse(credentialObj);
            let decryptedCredential = {};
            decryptedCredential.name = finalCredential.name;
            decryptedCredential.version = finalCredential.version;
            decryptedCredential.definitionId = finalCredential.definitionId;
            decryptedCredential.revocationId = await decrypt(privateKey,finalCredential.revocationId);
            decryptedCredential.publicWitnessIndex = finalCredential.publicWitnessIndex;
            decryptedCredential.attributes = {};
            for(let [key,value] of Object.entries(finalCredential.attributes))
            {
                let decryptedValue = await decrypt(privateKey,value.value);
                decryptedCredential.attributes[`${key}`] = {
                    attributeName: value.attributeName,
                    value: decryptedValue,
                    signature: value.signature,
                }
            }
            await db.credentials.add({
                keyPairId: keyPairId,
                credential: decryptedCredential,
            })
            let newKeyPair = keyPair;
            newKeyPair.used = true
            await db.keypairs.put(newKeyPair, keyPairId)
            returnToast(true,'Sucessfully linked credential')
            history.push('/credential/all')
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
                <FormLabel>Encoded Credential</FormLabel>
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