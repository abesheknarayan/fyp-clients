import { Box, Text, Table, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";

// component to view single credential schema
function ViewCredentialSchema(props) {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    let attributes = JSON.parse(props.value.attributes);

    return (
        <Box border='1px' borderRadius='lg' borderColor='gray' padding='3' margin='3' width='max-content'>
            <Table>
                <Tbody>
                    <Tr>
                        <Th>
                            Schema Name
                        </Th>
                        <Td>
                            {props.value.name}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th>
                            Schema Version
                        </Th>
                        <Td>
                            {props.value.version}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th>
                            Schema Id
                        </Th>
                        <Td>
                            {props.value.id}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th>
                            Creator Address
                        </Th>
                        <Td>
                            {props.value.creator_address}
                        </Td>
                    </Tr>
                    {
                        attributes.map((attribute, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <Tr>
                                        <Th>
                                            Attribute {index + 1}
                                        </Th>
                                        <Td>
                                            {attribute.value}
                                        </Td>
                                    </Tr>
                                </React.Fragment>
                            )
                        })
                    }
                </Tbody>
            </Table>
        </Box>
    )

}

export default ViewCredentialSchema;