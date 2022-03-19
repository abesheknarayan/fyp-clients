import { Button, Container, FormControl, FormLabel, Input, Stack, Table, Tbody, Tr, Th, Td, Heading, Checkbox } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { verifierContext } from "../../context/VerifierContext";
import { Web3Context } from "../../context/Web3Context";
import { axiosInstance } from "../../utils/axios";
import Navbar from './Navbar';

function CreateVerificationTemplate() {
    const { isLoggedin, verifier } = useContext(verifierContext);
    const { isVerifierLoggedin, isUserLoggedin } = useContext(commonContext);
    const { instance, web3Account } = useContext(Web3Context)
    const [credentialDefinitionId, setCredentialDefinitionId] = useState('')
    const [verificationTemplateName,setVerificationTemplateName] = useState('')
    const [credentialDefinition, setCredentialDefinition] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const history = useHistory();
    let selectedAttributes = [];

    const getCredentialSchema = useCallback(async () => {
        try {
            let schemaId = credentialDefinition.credSchema_id;
            let result = await instance.methods
                .getCredentialSchemaWithIDSSI(schemaId)
                .call();
            console.log(result);
            let attributes = JSON.parse(result.attributes);
            setAttributes(attributes);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (credentialDefinition) getCredentialSchema();
    }, [credentialDefinition])

    useEffect(()=>{
        if(attributes.length > 0) {
            selectedAttributes = new Array(attributes.length).fill(false)
        }
    },[attributes])



    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isVerifierLoggedin) return <Redirect to="/auth/verifier/login" />

    const handldCredentialDefinitionId = (e) => {
        setCredentialDefinitionId(e.target.value);
    }

    const handleGetCredentialDefinition = async () => {
        try {
            let result = await instance.methods
                .getCredentialDefinitionWithIDSSI(credentialDefinitionId)
                .call()
            console.log(result);
            setCredentialDefinition(result);
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleAttributeCheck = (e) => {
        selectedAttributes[e.target.id] = e.target.checked;
    }

    const handleVerificationTemplateNameChange = (e) => {
        setVerificationTemplateName(e.target.value);
    }

    const handleVerificationTemplateCreate = async() => {
        try{
            // store verificatio template in db
            // def id, selected attributes array
            let selectedAttributesList = [];
            selectedAttributes.forEach((attribute,index)=>{
                if(attribute){
                    selectedAttributesList.push(attributes[index]);
                }
            })
            console.log(selectedAttributesList);
            await axiosInstance.post('/credential/verificationtemplate/create',{
                templateName: verificationTemplateName,
                definitionId: credentialDefinition.id,
                requiredAttributes: selectedAttributesList,
            })
            history.push('/verificationtemplate/view/all');
        }

        catch(err)
        {
            console.error(err);
        }
    }


    return (
        <React.Fragment>
            <Navbar />
            <Container p='5' centerContent size={'4xl'}>
            <FormControl m='5' isRequired>
                    <FormLabel>
                        Verification Template Name
                    </FormLabel>
                    <Input placeholder='Enter Verification Template Name' onInput={handleVerificationTemplateNameChange} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>
                        Credential Definition Id
                    </FormLabel>
                    <Input placeholder='Enter Credential definition id' onInput={handldCredentialDefinitionId} />
                </FormControl>
                <Button m='5' onClick={handleGetCredentialDefinition}> Get Credential Definition </Button>
                {credentialDefinition &&
                    <Stack>
                        <Heading textAlign={'center'} size='md'>Credential Metadata</Heading>
                        <Table>
                            <Tbody>
                                <Tr>
                                    <Th>
                                        Credential Name
                                    </Th>
                                    <Td>
                                        {credentialDefinition.name}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Th>
                                        Credential Version
                                    </Th>
                                    <Td>
                                        {credentialDefinition.version}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Th>
                                        Issuer Address
                                    </Th>
                                    <Td>
                                        {credentialDefinition.issuer_address}
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                        <Heading m='5' textAlign={'center'} size='md'> Select Attributes </Heading>
                        <Stack spacing={'5'} direction={'column'}>
                            {
                                attributes.map((attribute, index) => {
                                    console.log(attribute)
                                    return (
                                        <Checkbox id={index} key={index} onChange={handleAttributeCheck}>
                                            {attribute.value}
                                        </Checkbox>
                                    )
                                })
                            }
                        </Stack>
                        <Button margin='auto' colorScheme={'green'} onClick={handleVerificationTemplateCreate}> Create Verification Template </Button>
                    </Stack>
                }
            </Container>
        </React.Fragment>
    )
}

export default CreateVerificationTemplate;