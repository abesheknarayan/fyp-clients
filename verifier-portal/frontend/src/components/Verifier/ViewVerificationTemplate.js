import { Container, Tbody, Table, Tr, Th, Td, Heading, Stack, Text } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { verifierContext } from "../../context/VerifierContext";
import { Web3Context } from "../../context/Web3Context";
import { axiosInstance } from "../../utils/axios";
import Navbar from './Navbar';

function ViewVerificationTemplate() {
    const { isLoggedin, verifier } = useContext(verifierContext);
    const { isVerifierLoggedin, isUserLoggedin } = useContext(commonContext);
    const { instance, web3Account } = useContext(Web3Context);
    const [verificationTemplate, setVerificationTemplate] = useState(null);
    const [credentialDefintion, setCredentialDefinition] = useState(null);
    const path = useLocation();
    const history = useHistory();
    let verificationTemplateId = path.pathname.split("/").slice(-1)[0];

    const getVerificationTemplate = useCallback(async () => {
        try {
            let result = await axiosInstance.get(`credential/verificationtemplate/${verificationTemplateId}`);
            setVerificationTemplate(result.data);
        }
        catch (err) {
            console.error(err);
        }
    })

    const getCredentialDefinition = useCallback(async () => {
        try {
            let result = await instance.methods
                .getCredentialDefinitionWithIDSSI(verificationTemplate.definitionId)
                .call();
            setCredentialDefinition(result);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (!isUserLoggedin && isVerifierLoggedin) getVerificationTemplate();
    }, [])

    useEffect(() => {
        if (!isUserLoggedin && isVerifierLoggedin) {
            if (verificationTemplate) getCredentialDefinition()
        };
    }, [verificationTemplate, instance])

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isVerifierLoggedin) return <Redirect to="/auth/verifier/login" />

    return (
        <React.Fragment>
            <Navbar />
            <Container centerContent>
                {
                    verificationTemplate && credentialDefintion && (
                        <React.Fragment>
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
                                            Credential Definition Name
                                        </Th>
                                        <Td>
                                            {credentialDefintion.name}
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Th>
                                            Credential Definition Version
                                        </Th>
                                        <Td>
                                            {credentialDefintion.version}
                                        </Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                            <Heading m='5' size='md' textAlign={'center'}>Required Attributes</Heading>
                            <Stack>
                                {
                                    verificationTemplate.requiredAttributes.map((attribute, index) => {
                                        return (
                                            <Text key={index} textAlign={'center'}>{attribute.value}</Text>
                                        )
                                    })
                                }
                            </Stack>
                        </React.Fragment>
                    )
                }

            </Container>
        </React.Fragment>
    )
}

export default ViewVerificationTemplate;