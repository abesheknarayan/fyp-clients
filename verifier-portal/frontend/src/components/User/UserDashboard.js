import { Container, Heading } from "@chakra-ui/react";
import React, { useContext } from "react"
import { Redirect } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { userContext } from "../../context/UserContext"
import Navbar from './Navbar';


function UserDashboard() {
    const { isVerifierLoggedin, isUserLoggedin } = useContext(commonContext);
    const { user, isLoggedin } = useContext(userContext);

    if (isVerifierLoggedin)
        return <Redirect to="/verifier/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />

    return (
        <React.Fragment>
            <Navbar />
            <Container centerContent>
                <Heading
                    fontWeight={600}
                    margin='5'
                    fontSize={{ base: 'xl', sm: '4xl', md: '5xl' }}
                    lineHeight={'110%'}>
                    User Dashboard <br />
                </Heading>
                <Heading
                    fontWeight={100}
                    margin='5'
                    fontSize={{ base: 'xl', sm: '4xl', md: 'xl' }}
                    lineHeight={'110%'}>
                    Aadhar ID : {user.aadharID} <br />
                </Heading>
                
            </Container>
        </React.Fragment>
    )
}

export default UserDashboard;