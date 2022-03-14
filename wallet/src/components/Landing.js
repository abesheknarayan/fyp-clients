import React from "react";

import {
    Box,
    Heading,
    Container,
    Button,
    Stack,
} from '@chakra-ui/react';
import { useHistory } from "react-router-dom";

function Landing() {
    const history = useHistory();
    return (
        <React.Fragment>
            <>
                <Container maxW={'3xl'}>
                    <Stack
                        as={Box}
                        textAlign={'center'}
                        spacing={{ base: 8, md: 14 }}
                        py={{ base: 20, md: 36 }}>
                        <Heading
                            fontWeight={600}
                            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                            lineHeight={'110%'}>
                            SSI Wallet <br />

                        </Heading>
                    </Stack>
                    <Stack
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}
                    >
                        <Button
                            colorScheme={'green'}
                            bg={'green.400'}
                            onClick={() => { history.push("/dashboard") }}
                        >
                            Dashboard
                        </Button>
                    </Stack>
                </Container>
            </>
        </React.Fragment>
    )
}

export default Landing;