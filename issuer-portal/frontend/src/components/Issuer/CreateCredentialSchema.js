import React, { useContext, useEffect, useState } from "react";
import { Redirect } from 'react-router-dom';
import {
    Button, Container, Input,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";

import { Web3Context } from "../../context/Web3Context";
import { issuerContext } from "../../context/IssuerContext";
import Form from "../Common/form/Form";
import { commonContext } from "../../context/CommonContext";
import Navbar from "./Navbar";

function CreateCredentialSchema() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [schemaName, setSchemaName] = useState('');
    const [schemaVersion, setSchemaVersion] = useState('');
    const [attributes, setAttributes] = useState(null);
    const { instance, web3Account } = useContext(Web3Context);


    // not allowing simultaneous login
    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    const handleNameChange = (e) => {
        setSchemaName(e.target.value);
    }

    const handleVersionChange = (e) => {
        setSchemaVersion(e.target.value);
    }

    const setFieldAttributes = (val) => {
        setAttributes(val);
    }

    const handleCreateSchema = async () => {
        if (!(schemaName.length && schemaVersion.length)) return
        try {
            let stringifiedAttributes = JSON.stringify(attributes);
            console.log(stringifiedAttributes, typeof stringifiedAttributes)
            await instance.methods
                .createCredentialSchemaSSI(schemaName, schemaVersion, stringifiedAttributes)
                .send({ from: web3Account })
        }
        catch (err) {
            console.error(err);
        }

    }

    return (
        <React.Fragment>
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
                            Create Credential Schema
                        </Heading>
                        <FormControl id="name" isRequired>
                            <FormLabel>Schema Name</FormLabel>
                            <Input
                                placeholder="Schema Name"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                onInput={handleNameChange}
                            />
                        </FormControl>
                        <FormControl id="version" isRequired>
                            <FormLabel>Version</FormLabel>
                            <Input
                                type="text"
                                placeholder="Version"
                                onInput={handleVersionChange} />
                        </FormControl>
                        <FormControl id="attributes">
                            <FormLabel>Attributes</FormLabel>
                        </FormControl>
                        <Form setFieldAttributes={setFieldAttributes} />
                        <Stack spacing={6}>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleCreateSchema}
                            >
                                Create Schema
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
            </Container>
        </React.Fragment>
    )
}

export default CreateCredentialSchema;