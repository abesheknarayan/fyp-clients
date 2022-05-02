import { Container, Heading } from "@chakra-ui/react"
import React from "react"
import { db } from "../utils/db"
import Navbar from './Navbar'

function Dashboard() {
    return (
        <React.Fragment>
            <Navbar />
            <Container>
                <Heading
                    fontWeight={600}
                    margin='5'
                    fontSize={{ base: 'xl', sm: '4xl', md: '5xl' }}
                    lineHeight={'110%'}>
                    Wallet Dashboard <br />
                </Heading>
            </Container>
        </React.Fragment>
    )
}

export default Dashboard