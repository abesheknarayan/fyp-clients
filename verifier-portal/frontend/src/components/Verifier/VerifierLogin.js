import React, { useContext, useState } from "react";
import { axiosInstance } from "../../utils/axios";
import { Redirect, useHistory } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";

import {
    Button, Container, Input,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Stack,
} from "@chakra-ui/react";
import { verifierContext } from "../../context/VerifierContext";

function VerifierLogin() {
    const history = useHistory()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { saveVerifier, isLoggedin } = useContext(verifierContext)
    const { isUserLoggedin } = useContext(commonContext);


    // not allowing simultaneous login
    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (isLoggedin) return <Redirect to='/verifier/dashboard' />

    const handleSubmit = async () => {
        try {
            if (!(username && password)) {
                // do nothing
                return
            }
            let res = await axiosInstance.post('/auth/verifier/login', {
                username: username,
                password: password
            })
            // successfull login
            if (res.data && res.data.userID) {
                saveVerifier(res.data)
                history.push("/verifier/dashboard")
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    return (
        <React.Fragment>
            <Container centerContent>
                <Flex
                    justify={'center'}
                >
                    <Stack
                        padding="10"
                        spacing={4}
                        w={'full'}
                        maxW={'md'}
                        rounded={'xl'}
                        boxShadow={'lg'}
                        p={6}
                        my={12}>
                        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                            Verifier Login
                        </Heading>
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                placeholder="Username"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                onInput={handleChangeUsername}
                            />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                placeholder="Password"
                                onInput={handleChangePassword}
                                required
                            />
                        </FormControl>
                        <Stack spacing={6}>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleSubmit}
                            >
                                Login
                            </Button>
                            <Button variant={'link'} size='sm' colorScheme={'blue'} 
                              onClick={()=>{history.push("/auth/user/login")}}
                            > 
                                Not a verifier? Login as User
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
            </Container>
        </React.Fragment>
    )
}

export default VerifierLogin;