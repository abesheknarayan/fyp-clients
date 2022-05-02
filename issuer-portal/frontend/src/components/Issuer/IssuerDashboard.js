import React, { useContext } from "react";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";
import { issuerContext } from "../../context/IssuerContext";
import { Web3Context } from "../../context/Web3Context";
import Navbar from './Navbar'

import {
    Container,
    Heading,
    Table,
    Tbody,
    Tr,
    Td,
    Th,

} from '@chakra-ui/react';

function IssuerDashboard() {
    const { isLoggedin, issuer } = useContext(issuerContext);
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const { web3Account } = useContext(Web3Context)
    console.log(isIssuerLoggedin, isUserLoggedin);
    console.log(issuer, isLoggedin)
    console.log('rendering')

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    return (
        <React.Fragment>
            <Navbar></Navbar>
            <Container centerContent>
                <Heading
                    fontWeight={600}
                    margin='5'
                    fontSize={{ base: 'xl', sm: '4xl', md: '5xl' }}
                    lineHeight={'110%'}>
                    Issuer Dashboard <br />

                </Heading>
                <Table>
                    <Tbody>
                        <Tr>
                            <Th>
                                Username
                            </Th>
                            <Td>
                                {issuer.username}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>
                                Web3 Address
                            </Th>
                            <Td>
                                {web3Account}
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Container>
        </React.Fragment>
    )
}

export default IssuerDashboard;