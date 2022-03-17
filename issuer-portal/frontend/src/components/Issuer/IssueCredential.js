import { Container, FormLabel, Tbody, Table, Tr, Td, Text, Heading, Flex, Stack, FormControl, Input, Button } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { axiosInstance } from "../../utils/axios";
import { Sign, VerifySignature, ConvertArrayBuffertoHexString, ConvertHexStringtoArrayBuffer, encryptWithPublicKey } from "../../utils/crypto";
import Navbar from './Navbar';


// field component for filling details during credential issue
// props should have attribute name, index, parent fn for updating parent state
function CredentialIssueDetailField(props) {
    const [value, setValue] = useState('');
    const handleValueChange = (e) => {
        setValue(e.target.value);
    }

    useEffect(() => {
        props.handleCredentialDetailsChange(props.name, value);
    }, [value])

    return (
        <FormControl isRequired>
            <FormLabel> {props.name} </FormLabel>
            <Input
                placeholder={props.name}
                onInput={handleValueChange}
                size='md'
                required
                width={'lg'}
            />

        </FormControl>
    )
}

function IssueCredential() {

    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [credential, setCredential] = useState(null);
    const [credentialFillableDetails, setCredentialFillableDetails] = useState({});
    const path = useLocation();
    const history = useHistory();
    let credentialDefinitionDBId = path.pathname.split("/").slice(-1)[0];
    console.log(credentialDefinitionDBId)
    console.log("rendering issue credentials component");


    const getCredentialDetials = useCallback(async () => {
        try {
            let resp = await axiosInstance.get(`/credential/issue/${credentialDefinitionDBId}`);
            console.log(resp.data);
            setCredential(resp.data);
        }
        catch (err) {
            console.error(err);
            history.push("/credential/requests")
        }
    })

    useEffect(() => {
        if (!isUserLoggedin && isIssuerLoggedin) getCredentialDetials();
        return function cleanup() {
            setCredential(null);
            setCredentialFillableDetails({});
        }
    }, [])

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    const handleCredentialDetailsChange = (name, value) => {
        let oldDetails = credentialFillableDetails;
        oldDetails[`${name}`] = value;
        setCredentialFillableDetails(oldDetails);

    }

    // big shit , sign each attribute and store it in db
    // TODO: Encrypt the whole data with pub key of requested user
    const handleIssueCredential = async () => {
        try {
            console.log(credentialFillableDetails);
            const { publicKey, privateKey } = credential.definition;
            const { userPublicKey } = credential;
            let newCredential = {};
            // metadata
            newCredential['name'] = credential.definition.name;
            newCredential['version'] = credential.definition.version;
            newCredential['definitionId'] = credential.definition.definitionId;
            newCredential.attributes = []
            // encrypting credential's value using user Public key
            for (let [key, value] of Object.entries(credentialFillableDetails)) {
                let encoder = new TextEncoder();
                let encodedDetail = encoder.encode(value);
                let signature = await Sign(encodedDetail, privateKey);
                let encryptedValue = await encryptWithPublicKey(userPublicKey, value);
                newCredential.attributes.push({
                    attributeName: key,
                    value: encryptedValue,
                    signature: signature,
                })
            }
            // store credential in db 
            console.log(newCredential);
            await axiosInstance.post('/credential/save',{
                requestId: credential.requestId,
                credentialDefinitionDBId: credentialDefinitionDBId,
                credential: newCredential,
            })
        }
        catch(err)
        {
            console.error(err);
        }
    }

    return (

        <React.Fragment>
            <Navbar />
            <Container centerContent>
                {credential && (
                    <React.Fragment>
                        <Heading fontSize='2xl' padding='10'>
                            Credential Metadata
                        </Heading>
                        <Table>
                            <Tbody>
                                <Tr>
                                    <Td>
                                        <FormLabel style={{ fontWeight: 'bold' }}>Credential Name</FormLabel>
                                    </Td>
                                    <Td>
                                        <Text> {credential.definition.name} </Text>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <FormLabel style={{ fontWeight: 'bold' }}>Credential Version</FormLabel>
                                    </Td>
                                    <Td>
                                        <Text> {credential.definition.version} </Text>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <FormLabel style={{ fontWeight: 'bold' }}>Aadhar Number</FormLabel>
                                    </Td>
                                    <Td>
                                        <Text> {credential.user.aadharId} </Text>
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                        <Heading fontSize='2xl' padding='10'>
                            Credential Details
                        </Heading>
                        <Flex justifyContent={'center'} >
                            <Stack
                                // padding="10"
                                spacing={4}
                                w={'inherit'}
                                maxW={'lg'}
                                rounded={'xl'}
                                p={6}
                            // my={12}
                            >
                                {
                                    JSON.parse(credential.schema.attributes).map((attribute, index) => {
                                        return (
                                            <CredentialIssueDetailField
                                                name={attribute.value}
                                                key={index}
                                                index={index}
                                                handleCredentialDetailsChange={handleCredentialDetailsChange}
                                            />
                                        )
                                    })
                                }
                            </Stack>
                        </Flex>
                        <Button
                            colorScheme='green'
                            onClick={handleIssueCredential}
                        >
                            Issue Credential
                        </Button>
                    </React.Fragment>
                )
                }
            </Container>
        </React.Fragment>
    )
}




export default IssueCredential;