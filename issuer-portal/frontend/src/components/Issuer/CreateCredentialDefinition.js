import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import {
    Button, Container, Input,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Stack,
    Switch,
    Box,
} from "@chakra-ui/react";
import { generateKeyPair } from 'crypto'


import { Web3Context } from "../../context/Web3Context";
import { commonContext } from "../../context/CommonContext";
import { genKeyPair } from '../../utils/crypto'
import { config } from '../../config/config'
import { axiosInstance } from "../../utils/axios";

function CreateCredentialDefintion() {

    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const { instance, web3Account } = useContext(Web3Context);
    const [definitionName, setDefintionName] = useState('');
    const [definitonVersion, setDefinitionVersion] = useState('');
    const [definitionVerificationKey, setDefinitionVerificationKey] = useState(null)
    const [definitionSigningKey, setDefinitionSigningKey] = useState(null);
    const [schemaId, setSchemaId] = useState('');
    const [isRevocatable, setIsRevocatable] = useState(false);

    useEffect(() => {
        if(!isUserLoggedin && isIssuerLoggedin) generateKeyPair();
    }, [])

    const generateKeyPair = useCallback(async()=>{
        try {
            let keyPair = await genKeyPair();
            console.log(keyPair)
            console.log(keyPair.privateKey,keyPair.publicKey)
            let formattedPublicKey = await window.crypto.subtle.exportKey('jwk',keyPair.publicKey);
            let formattedPrivateKey = await window.crypto.subtle.exportKey('jwk',keyPair.privateKey);
            setDefinitionSigningKey(formattedPrivateKey);
            setDefinitionVerificationKey(formattedPublicKey);
        }  
        catch(err){
            console.error(err);
        }
    })

    // not allowing simultaneous login
    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    const handleNameChange = (e) => {
        setDefintionName(e.target.value);
    }

    const handleVersionChange = (e) => {
        setDefinitionVersion(e.target.value);
    }

    const handleVerificationKeyChange = (e) => {
        setDefinitionVerificationKey(e.target.value)
    }

    const handleSchemaIdChange = (e) => {
        setSchemaId(e.target.value);
    }

    const handleIsRevocatableChange = (e) => {
        setIsRevocatable(e.target.checked);
    }

    const handleCreateDefinition = async () => {
        let val = definitionName.length && definitonVersion.length && definitionVerificationKey && schemaId.length;
        if (!val) return;
        try {
            // create some random primes
            // get credential_definition id from response 
            console.log(definitionVerificationKey.e,typeof definitionVerificationKey.n)
            let resp = await instance.methods
                .createCredentialDefinitionSSI(definitionName, definitonVersion,(definitionVerificationKey.e),definitionVerificationKey.n, (schemaId), isRevocatable)
                .send({ from: web3Account })
            console.log(resp.events.SendCredentialDefinitionId.returnValues._credential_definition_id);

            let definitionId = resp.events.SendCredentialDefinitionId.returnValues._credential_definition_id;
            console.log(definitionId);
            await axiosInstance.post('/issuer/credentialdefinition/create',{
                name:  definitionName,
                credentialId: definitionId,
                version: definitonVersion,
                issuerAddress: web3Account,
                schemaId: schemaId,
                isRevocatable: isRevocatable,
                publicKey: definitionVerificationKey,
                privateKey: definitionSigningKey
            })
            // store (cred def id,key pair) tuple in mongodb for further use

        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <React.Fragment >
            <Navbar />
            <Container centerContent>
                <Flex
                    justify={'center'}
                >
                    <Stack
                        padding="10"
                        spacing={4}
                        w={'full'}
                        maxW={'md'}
                        rounded={'xl'}
                        boxShadow={'lg'}
                        p={6}
                        my={12}>
                        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                            Create Credential Definition
                        </Heading>
                        <FormControl id="name" isRequired>
                            <FormLabel>Definition Name</FormLabel>
                            <Input
                                placeholder="Credential Definition Name"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                onInput={handleNameChange}
                            />
                        </FormControl>
                        <FormControl id="version" isRequired>
                            <FormLabel>Version</FormLabel>
                            <Input
                                type="text"
                                placeholder="version"
                                onInput={handleVersionChange}
                            />
                        </FormControl>
                        <FormControl id="schemaid" isRequired>
                            <FormLabel>Schema Id</FormLabel>
                            <Input
                                type="text"
                                placeholder="Schema Id"
                                onInput={handleSchemaIdChange}
                            />
                        </FormControl>
                        <FormControl id="revocatable" isRequired>
                            <Box display="flex">
                                <FormLabel htmlFor="revocatableSwitch" >Is Revocatable?</FormLabel>
                                <Switch id="revocatableSwitch" isRequired onChange={handleIsRevocatableChange} />
                            </Box>
                        </FormControl>
                        <Stack spacing={6}>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleCreateDefinition}
                            >
                                Create Definition
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
            </Container>
        </React.Fragment>
    )

}

export default CreateCredentialDefintion;