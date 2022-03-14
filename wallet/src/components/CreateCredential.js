import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import Navbar from './Navbar'
import {
    Container,
    Stack,
    Input,
    FormControl,
    FormLabel,
    Button,
    Heading,
    useClipboard,
    Flex,
    Textarea,
} from '@chakra-ui/react';
import { deriveKey, ConvertArrayBuffertoHexString } from "../utils/crypto";
import { db } from "../utils/db";

function CreateCredential() {
    const [credentialName, setCredentialName] = useState('');
    const [key, setKey] = useState(null);
    const { hasCopied, onCopy } = useClipboard(key);
    const history = useHistory();

    const handleChangeCredentialName = (e) => {
        setCredentialName(e.target.value);
    }

    const generateKeyPair = async () => {
        if (!(credentialName)) return;
        try {
            let key = await deriveKey();
            console.log(key);
            console.log(key.publicKey, key.privateKey);
            let stringifiedKey = JSON.stringify(key.publicKey);
            let encoder = new TextEncoder();
            let encodedKey = encoder.encode(stringifiedKey);
            setKey({
                encodedPublicKey: ConvertArrayBuffertoHexString(encodedKey),
                json: key
            });
        }
        catch (err) {
            console.error(err);
        }
    }

    const insertKeyPairToIndexedDb = useCallback(async () => {
        try {
            await db.keypairs.add({
                credentialName: credentialName,
                publicKey: key.json.publicKey,
                privateKey: key.json.privateKey,
                used:false,
            })
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (key) {
            insertKeyPairToIndexedDb();
        }
    }, [key])

    return (
        <React.Fragment>
            <Navbar />
            <Container p={4} centerContent >
                <Stack >
                    <Heading lineHeight={2} fontSize={{ base: 'xl', md: '2xl' }}>
                        Create a key pair for credential
                    </Heading>
                    <FormControl label="Credential" isRequired>
                        <FormLabel>Credential Name</FormLabel>
                        <Input
                            onInput={handleChangeCredentialName}
                            placeholder='Enter Credential Name'
                        />
                    </FormControl>
                    {
                        !key &&
                        <Button onClick={generateKeyPair}>
                            Generate Key Pair
                        </Button>
                    }
                    {
                        key &&
                        (
                            <Stack padding={5}>
                                <FormLabel>Encoded Public Key</FormLabel>
                                <Input value={key.encodedPublicKey} isReadOnly />
                                <Button margin={1} onClick={onCopy} >
                                    Copy
                                </Button>
                            </Stack>
                        )
                    }
                </Stack>
            </Container>
        </React.Fragment>
    )
}

export default CreateCredential;