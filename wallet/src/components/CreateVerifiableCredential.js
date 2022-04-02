import { Button, Checkbox, Container, Heading, Stack, Table, Tbody, Td, Tfoot, Th, Thead, Tr, useClipboard, FormLabel, Input } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import { checkRevocation, ConvertArrayBuffertoHexString, generateProof } from "../utils/crypto";
import { db } from "../utils/db";
import Navbar from './Navbar';

function CreateVerifiableCredential() {
    const path = useLocation();
    let credentialId = path.pathname.split("/").slice(-1)[0];
    const history = useHistory();
    const [credential, setCredential] = useState(null);
    const { instance, web3Account } = useContext(Web3Context);
    const [verifiablecredential, setVerifiableCredential] = useState(null);
    const { hasCopied, onCopy } = useClipboard(verifiablecredential ? verifiablecredential : '');
    let selectedAttributes = []

    const getCredentialFromIndexedDb = useCallback(async () => {
        try {
            let credential = await db.credentials.where('id').equals(Number(credentialId)).toArray();
            if (credential.length != 1) {
                return history.push('/dashboard');
            }
            let cred = {};
            cred.name = credential[0].credential.name;
            cred.version = credential[0].credential.version;
            cred.definitionId = credential[0].credential.definitionId;
            cred.revocationId = credential[0].credential.revocationId ? credential[0].credential.revocationId : null;
            cred.publicWitnessIndex = credential[0].credential.publicWitnessIndex ? credential[0].credential.publicWitnessIndex : null;
            cred.attributes = []
            for (let index in credential[0].credential.attributes) {
                cred.attributes.push(credential[0].credential.attributes[index])
            }
            console.log(cred);
            setCredential(cred);

        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        getCredentialFromIndexedDb();
    }, [])

    useEffect(() => {
        if (credential && credential.attributes.length > 0) {
            selectedAttributes = new Array(credential.attributes.length).fill(false)
            console.log(selectedAttributes)
        }
    }, [credential])

    const handleAttributeCheck = (e) => {
        selectedAttributes[e.target.id] = e.target.checked;
    }

    const handleCreateVerifiableCredential = async () => {
        let selectedAttributesList = [];
        selectedAttributes.forEach((attribute, index) => {
            if (attribute) {
                selectedAttributesList.push(credential.attributes[index]);
            }
        })
        // get credential definition from blockchain
        let credentialDefinition = await instance.methods
            .getCredentialDefinitionWithIDSSI(credential.definitionId)
            .call()
        // console.log(credentialDefinition);
        // console.log(credential);
        let revocationProof = credentialDefinition.is_revocatable ? {} : null;
        if (credentialDefinition.is_revocatable) {
            // give proof with private witness 
            let accumulatorValue = await instance.methods
                .getAccumulatorForCredentialDefinition(credential.definitionId)
                .call();
            let publicWitness = await instance.methods
                .getPublicWitnessWithIndex(credential.definitionId, credential.publicWitnessIndex)
                .call()
            // console.log(publicWitness)
            // console.log(accumulatorValue)
            let { prime_number: primeNumber, generator } = accumulatorValue;
            console.log(accumulatorValue,credentialDefinition)
            revocationProof =  generateProof(credential.revocationId,publicWitness, primeNumber)
        }
        console.log(revocationProof)
        let verifiableCredential = {
            name: credential.name,
            version: credential.version,
            definitionId: credential.definitionId,
            attributes: selectedAttributesList,
            revocationProof: revocationProof,
        }
        // just encode it
        let encoder = new TextEncoder();
        let stringifiedCredential = JSON.stringify(verifiableCredential);
        let encodedCredentialBuffer = encoder.encode(stringifiedCredential);
        let encodedCredentialHex = ConvertArrayBuffertoHexString(encodedCredentialBuffer);
        setVerifiableCredential(encodedCredentialHex);
    }

    return (
        <React.Fragment>
            <Navbar />
            <Container centerContent maxW={'fit-content'}>
                {credential &&
                    <React.Fragment>
                        <Table>
                            <Tbody>
                                <Tr>
                                    <Th>
                                        Credential Name
                                    </Th>
                                    <Td>
                                        {credential.name}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Th>
                                        Credential Version
                                    </Th>
                                    <Td>
                                        {credential.version}
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Th>
                                        Credential Definition Id
                                    </Th>
                                    <Td >
                                        {credential.definitionId}
                                    </Td>
                                </Tr>
                            </Tbody>

                        </Table>
                        <Heading size='md' m='5' textAlign={'center'}>Select Attributes</Heading>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Attribute</Th>
                                    <Th>Value</Th>
                                    <Th>Select/Unselect</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    credential.attributes.map((attribute, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>
                                                    {attribute.attributeName}
                                                </Td>
                                                <Td>
                                                    {attribute.value}
                                                </Td>
                                                <Td>
                                                    <Checkbox id={index} key={index} onChange={handleAttributeCheck}>

                                                    </Checkbox>
                                                </Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                        <Button m='5' colorScheme={'blue'} onClick={handleCreateVerifiableCredential}>
                            Create Verifiable Credential
                        </Button>
                        {
                            verifiablecredential &&
                            (
                                <React.Fragment>
                                    <Stack padding={5}>
                                        <FormLabel>Encoded Verifiable Credential</FormLabel>
                                        <Input value={verifiablecredential} isReadOnly />
                                        <Button margin={1} onClick={onCopy} >
                                            Copy
                                        </Button>
                                    </Stack>
                                </React.Fragment>

                            )
                        }
                    </React.Fragment>
                }

            </Container>
        </React.Fragment>
    )
}

export default CreateVerifiableCredential;