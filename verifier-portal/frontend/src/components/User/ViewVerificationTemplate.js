import { Container, Tbody, Table, Tr, Th, Td, Heading, Stack, Text, FormControl, FormLabel, Button, Input, useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { Web3Context } from "../../context/Web3Context";
import { axiosInstance } from "../../utils/axios";
import { ConvertHexStringtoArrayBuffer, verifySignature } from "../../utils/crypto";
import Navbar from './Navbar';

function ViewVerificationTemplateUser() {
    const { isVerifierLoggedin, isUserLoggedin } = useContext(commonContext);
    const [verificationTemplate, setVerificationTemplate] = useState(null);
    const [credentialDefintion, setCredentialDefinition] = useState(null);
    const [verifiableCredential, setVerifiableCredential] = useState('');
    const path = useLocation();
    const history = useHistory();
    const toast = useToast();
    let verificationTemplateId = path.pathname.split("/").slice(-1)[0];

    const getVerificationTemplate = useCallback(async () => {
        try {
            let result = await axiosInstance.get(`user/verificationtemplate/${verificationTemplateId}`);
            setVerificationTemplate(result.data);
        }
        catch (err) {
            console.error(err);
        }
    })


    useEffect(() => {
        if (isUserLoggedin && !isVerifierLoggedin) getVerificationTemplate();
    }, [])

    if (isVerifierLoggedin)
        return <Redirect to="/verifier/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />

    const handleVerifiableCredentialChange = (e) => {
        setVerifiableCredential(e.target.value);
    }

    const returnToast = (result,msg) => {
        if (!result) {
            toast({
                title: `Error in Verification: ${msg}`,
                status: 'error',
                isClosable: 'true',
                duration: 9000
            })
        }
        else {
            toast({
                title: 'Verification successful',
                status: 'success',
                isClosable: 'true',
                duration: 9000
            })
        }
    }

    const submitVerifiableCredential = async () => {
        // take public keys from blockchain
        // verify attributes
        // verify signature
        // TODO: verify revocation
        try {
            let publicKey = verificationTemplate.credentialDefinitionPublicKey;
            let publicKeyJWK = {
                "crv": publicKey[0],
                "x": publicKey[1],
                "y": publicKey[2],
                "ext": true,
                "kty": "EC",
                "key_ops": ["verify"],
            }
            let decoder = new TextDecoder();
            let verifiableCredentialBuffer = ConvertHexStringtoArrayBuffer(verifiableCredential);
            let stringifiedCredential = decoder.decode(verifiableCredentialBuffer);
            let verifiableCredentialParsed = JSON.parse(stringifiedCredential);
            if (verificationTemplate.requiredAttributes.length !== verifiableCredentialParsed.attributes.length) {
                return returnToast(false,"Verifiable Credential's attributes does not match with Verification template");
            }
            for (let i = 0; i < verifiableCredentialParsed.attributes.length; i++) {
                if (verificationTemplate.requiredAttributes[i].value !== verifiableCredentialParsed.attributes[i].attributeName) {
                    return returnToast(false,"Attribute Names differ");
                }
                // verify signature
                let { value, signature } = verifiableCredentialParsed.attributes[i];
                let result = verifySignature(publicKeyJWK,value,signature);
                if(!result) {
                    returnToast(false,"Signature Verification Failed");
                }
            }

            // check revocation proof
            let revocationStatus = await axiosInstance.post(`/credential/revocation/${verifiableCredentialParsed.definitionId}`,{
                revocationProof: verifiableCredentialParsed.revocationProof,
            });


            if(!revocationStatus.data) {
                return returnToast(false,"Revocation Proof Failed")
            }


            return returnToast(revocationStatus.data,"Verification Successfull");
        }
        catch (err) {
            console.log(err);
            return returnToast(false);
        }

    }


    return (
        <React.Fragment>
            <Navbar />
            <Container centerContent maxW='fit-content'>
                {
                    verificationTemplate && (
                        <React.Fragment>
                            <Stack m='5' border='1px' borderRadius='lg' borderColor={'ButtonShadow'}>
                                <Table>
                                    <Tbody>
                                        <Tr>
                                            <Th>
                                                Verification Template Name
                                            </Th>
                                            <Td>
                                                {verificationTemplate.templateName}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Th>
                                                Credential Definition Id
                                            </Th>
                                            <Td maxW='lg'>
                                                {verificationTemplate.definitionId}
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                                <Heading m='5' size='md' textAlign={'center'}>Required Attributes</Heading>
                                <Stack>
                                    {
                                        verificationTemplate.requiredAttributes.map((attribute, index) => {
                                            return (
                                                <Text m='5' key={index} textAlign={'center'}>{attribute.value}</Text>
                                            )
                                        })
                                    }
                                </Stack>
                            </Stack>
                            <FormControl>
                                <FormLabel>
                                    Verifiable Credential
                                </FormLabel>
                                <Input placeholder="Enter encoded verifiable credential" onChange={handleVerifiableCredentialChange}>
                                </Input>
                            </FormControl>
                            <Button m='5' colorScheme={'linkedin'} onClick={submitVerifiableCredential}>
                                Submit Verifiable Credential
                            </Button>
                        </React.Fragment>
                    )
                }

            </Container>
        </React.Fragment>
    )
}

export default ViewVerificationTemplateUser;