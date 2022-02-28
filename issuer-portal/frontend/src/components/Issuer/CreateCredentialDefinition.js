import React, { useContext, useState } from "react";
import { issuerContext } from "../../context/IssuerContext";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";
import Navbar from './Navbar';
import Web3 from "web3";

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
import { Web3Context } from "../../context/Web3Context";


function CreateCredentialDefintion() {

    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const { instance, web3Account } = useContext(Web3Context);

    const [definitionName, setDefintionName] = useState('');
    const [definitonVersion, setDefinitionVersion] = useState('');
    const [definitionVerificationKey, setDefinitionVerificationKey] = useState('')
    const [schemaId, setSchemaId] = useState('');
    const [isRevocatable, setIsRevocatable] = useState(false);

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
        let val = definitionName.length && definitonVersion.length && definitionVerificationKey.length && schemaId.length;
        if (!val) return;
        try {
            console.log(definitionName,definitonVersion,Web3.utils.hexToAscii(definitionVerificationKey),Web3.utils.hexToAscii(schemaId),isRevocatable);
            await instance.methods
                  .createCredentialDefinitionSSI(definitionName,definitonVersion,(definitionVerificationKey),(schemaId),isRevocatable)
                  .send({from: web3Account})
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
                        <FormControl id="vkey" isRequired>
                            <FormLabel>Verification Key</FormLabel>
                            <Input
                                type="text"
                                placeholder="Verification Key"
                                onInput={handleVerificationKeyChange}
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