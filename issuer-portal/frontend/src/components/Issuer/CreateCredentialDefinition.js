import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from 'react-router-dom';
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
    useToast,
    
} from "@chakra-ui/react";


import { Web3Context } from "../../context/Web3Context";
import { commonContext } from "../../context/CommonContext";
import { genKeyPair, initRevocationRegistry } from '../../utils/crypto'
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
    const toast = useToast()
    const history = useHistory()

    useEffect(() => {
        if (!isUserLoggedin && isIssuerLoggedin) generateKeyPair();
    }, [])

    const returnToast = (result,msg) => {
        if (!result) {
            toast({
                title: `Error in creating credential definition: ${msg}`,
                status: 'error',
                isClosable: 'true',
                duration: 3000
            })
        }
        else {
            toast({
                title: 'Successfully created credential definition',
                status: 'success',
                isClosable: 'true',
                duration: 3000
            })
        }
    }

    const generateKeyPair = useCallback(async () => {
        try {
            let keyPair = await genKeyPair();
            let formattedPublicKey = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
            let formattedPrivateKey = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
            setDefinitionSigningKey(formattedPrivateKey);
            setDefinitionVerificationKey(formattedPublicKey);
        }
        catch (err) {
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
            if (isRevocatable == false) {
                let resp = await instance.methods
                    .createCredentialDefinitionSSI(definitionName, definitonVersion, { curve: definitionVerificationKey.crv, x: definitionVerificationKey.x, y: definitionVerificationKey.y }, (schemaId), isRevocatable)
                    .send({ from: web3Account })

                let definitionId = resp.events.SendCredentialDefinitionId.returnValues._credential_definition_id;
                await axiosInstance.post('/issuer/credentialdefinition/create', {
                    name: definitionName,
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
            else {
                let { generator, publicWitnessList, prime, privateAccumulatorValue, publicAccumulatorValue, privateWitnessList } = initRevocationRegistry();
                let resp = await instance.methods
                    .createCredentialDefinitionSSIWithRevocation(definitionName, definitonVersion, { curve: definitionVerificationKey.crv, x: definitionVerificationKey.x, y: definitionVerificationKey.y }, (schemaId), isRevocatable, publicWitnessList, generator, prime, publicAccumulatorValue)
                    .send({from: web3Account})

                let definitionId = resp.events.SendCredentialDefinitionId.returnValues._credential_definition_id;

                await axiosInstance.post('/issuer/credentialdefinition/create', {
                    name: definitionName,
                    credentialId: definitionId,
                    version: definitonVersion,
                    issuerAddress: web3Account,
                    schemaId: schemaId,
                    isRevocatable: isRevocatable,
                    publicKey: definitionVerificationKey,
                    privateKey: definitionSigningKey,
                    prime: prime,
                    generator: generator,
                    publicAccumulatorValue: publicAccumulatorValue,
                    publicWitnessList: publicWitnessList,
                })
            }
            returnToast(true,"Sucessfully created credential definition")
            history.push('/credentialdefinition/all')
        }
        catch (err) {
            console.error(err);
            returnToast(false,err)
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