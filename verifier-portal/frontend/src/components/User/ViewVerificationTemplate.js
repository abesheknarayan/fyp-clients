import { Container, Tbody, Table, Tr, Th, Td, Heading, Stack, Text } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { axiosInstance } from "../../utils/axios";
import Navbar from './Navbar';

function ViewVerificationTemplateUser() {
    const { isVerifierLoggedin, isUserLoggedin } = useContext(commonContext);
    const [verificationTemplate, setVerificationTemplate] = useState(null);
    const [credentialDefintion, setCredentialDefinition] = useState(null);
    const path = useLocation();
    const history = useHistory();
    let verificationTemplateId = path.pathname.split("/").slice(-1)[0];

    const getVerificationTemplate = useCallback(async () => {
        try {
            let result = await axiosInstance.get(`user/verificationtemplate/${verificationTemplateId}`);
            console.log(result);
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


    return (
        <React.Fragment>
            <Navbar />
            <Container centerContent>
                {
                    verificationTemplate && (
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

export default ViewVerificationTemplateUser;