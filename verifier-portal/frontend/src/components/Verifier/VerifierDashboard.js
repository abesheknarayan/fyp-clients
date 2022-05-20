import { Container, Heading, Table, Td, Tbody, Th, Tr } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";
import { verifierContext } from "../../context/VerifierContext";
import { Web3Context } from "../../context/Web3Context";
import Navbar from './Navbar'

function VerifierDashboard() {
    const { isLoggedin, verifier } = useContext(verifierContext);
    const { isVerifierLoggedin, isUserLoggedin } = useContext(commonContext);
    const { web3Account } = useContext(Web3Context)

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isVerifierLoggedin) return <Redirect to="/auth/verifier/login" />

    return (
        <React.Fragment>
            <Navbar></Navbar>
            <Container>
                <Heading
                    fontWeight={600}
                    margin='5'
                    fontSize={{ base: 'xl', sm: '4xl', md: '5xl' }}
                    lineHeight={'110%'}>
                    Verifier Dashboard <br />
                </Heading>
                <Table>
                    <Tbody>
                        <Tr>
                            <Th>
                                Username
                            </Th>
                            <Td>
                                {verifier.username}
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

export default VerifierDashboard;