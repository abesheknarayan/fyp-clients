import { Container, FormLabel, Tbody, Table, Tr, Td, Text, Heading, Flex, Stack, FormControl, Input, Button,useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { config } from "../../config/config";
import { commonContext } from "../../context/CommonContext";
import { Web3Context } from "../../context/Web3Context";
import { axiosInstance } from "../../utils/axios";
import { Sign, VerifySignature, ConvertArrayBuffertoHexString, ConvertHexStringtoArrayBuffer, encryptWithPublicKey, addNewCredential } from "../../utils/crypto";
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
    const { instance, web3Account } = useContext(Web3Context);
    const path = useLocation();
    const toast = useToast()
    const history = useHistory();
    let credentialRequestId = path.pathname.split("/").slice(-1)[0];


    const getCredentialDetials = useCallback(async () => {
        try {
            let resp = await axiosInstance.get(`/credential/issue/${credentialRequestId}`);
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

    const returnToast = (result,msg) => {
        if (!result) {
            toast({
                title: `Error in issuing credential: ${msg}`,
                status: 'error',
                isClosable: 'true',
                duration: 3000
            })
        }
        else {
            toast({
                title: 'Successfully issued credential',
                status: 'success',
                isClosable: 'true',
                duration: 3000
            })
        }
    }
    
    // big shit , sign each attribute and store it in db
    /*
    TODO:
    - get a private witness (prime number) and add it to credential
    - change accumulator value
    - add private and public witness to issuer db
    - add public witness to blockchain and update accumulator value
    */
   const handleIssueCredential = async () => {
       try {
           // get data witness and accumulator data from blockchain
        
           let witnessData = await instance.methods
               .getAllPublicWitnesses(credential.definition.definitionId)
               .call();
        
           let accumulatorData = await instance.methods
               .getAccumulatorForCredentialDefinition(credential.definition.definitionId)
               .call()
        
           let oldPublicWitnessList = witnessData;
           let oldPublicAccumulatorValue = accumulatorData.accumulator_value;
           let primeNumber = accumulatorData.prime_number;
           
            let privateWitnessIndex = witnessData.length;
            let privateWitness = config.primes[privateWitnessIndex];
            const { publicKey, privateKey } = credential.definition;
            const { userPublicKey } = credential;
            let newCredential = {};
            // metadata
            // TODO: get prime and update accumulator value in db and 
            newCredential['name'] = credential.definition.name;
            newCredential['version'] = credential.definition.version;
            newCredential['definitionId'] = credential.definition.definitionId;
            newCredential['revocationId'] = await encryptWithPublicKey(userPublicKey, privateWitness)
            newCredential['publicWitnessIndex'] = privateWitnessIndex;
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
            // change all public witnesses,accumulator value and store it in blockchain



            // update accumulator value
            let { publicWitnessList, publicAccumulatorValue } = addNewCredential(oldPublicAccumulatorValue, oldPublicWitnessList, privateWitness, primeNumber)


            // change in blockchain
            await instance.methods
                .updateRevocationRegistryOnCredentialIssuance(credential.definition.definitionId, publicWitnessList, publicAccumulatorValue)
                .send({ from: web3Account });

            await axiosInstance.post('/credential/save', {
                requestId: credential.requestId,
                credentialRequestId: credentialRequestId,
                credential: newCredential,
                publicAccumulatorValue: publicAccumulatorValue,
                publicWitnessList: publicWitnessList,
            })
            returnToast(true,'Sucessfully issued credential')
            history.push('/credential/issued')
        }
        catch (err) {
            console.error(err);
            returnToast(false,'Error in issuing credential')
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