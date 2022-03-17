import { Box, Tbody, Text, Th, Td, Tr, Table } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";

// component to view single credential schema
function ViewCredentialDefinition(props) {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    return (
        <React.Fragment>
            <Box border='1px' borderRadius='lg' borderColor='gray' padding='3' margin='3' width='max-content'>

                <Table>
                    <Tbody>
                        <Tr>
                            <Th>
                                Credential Name
                            </Th>
                            <Td>
                                {props.value.name}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>
                                Credential Version
                            </Th>
                            <Td>
                                {props.value.version}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>
                                Definition Id
                            </Th>
                            <Td>
                                {props.value.id}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>
                                Schema Id
                            </Th>
                            <Td>
                                {props.value.credSchema_id}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>
                                Signature Curve
                            </Th>
                            <Td>
                                {props.value.V_Key.curve}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>
                                Verification Key X
                            </Th>
                            <Td>
                                {props.value.V_Key.x}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>
                                Verification Key Y
                            </Th>
                            <Td>
                                {props.value.V_Key.y}
                            </Td>
                        </Tr>

                        <Tr>
                            <Th>
                                Creator Address
                            </Th>
                            <Td>
                                {props.value.issuer_address}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>
                                Revocatable
                            </Th>
                            <Td>
                                {props.value.is_revocatable ? "Yes" : "No"}
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>

        </React.Fragment>
    )

}

export default ViewCredentialDefinition;