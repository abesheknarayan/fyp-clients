import React, { useContext, useState } from "react";
import { axiosInstance } from "../../utils/axios";
import { userContext } from "../../context/UserContext";
import { Redirect, useHistory } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";

import {
    Button, Container, Input,
    Flex,
    FormControl,
    FormLabel,
    Heading,    
    Stack,
} from "@chakra-ui/react";


function UserLogin() {
    const history = useHistory();
    const [aadhar, setAadhar] = useState('');
    const [password, setPassword] = useState('');
    const { saveUser,isLoggedin } = useContext(userContext);
    const { isIssuerLoggedin,isUserLoggedin } = useContext(commonContext);

    if(isIssuerLoggedin) return <Redirect to="/issuer/dashboard" />

    if(isLoggedin) return <Redirect to="/user/dashboard" />

    const handleSubmit = async () => {
        try {
            if (!(aadhar && password)) {
                // do nothing
                return
            }
            let res = await axiosInstance.post('/auth/user/login', {
                aadharID: aadhar,
                password: password
            })
            if (res.data && res.data.userID) {
                saveUser(res.data)
                history.push("/user/dashboard")
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleChangeAadhar = (e) => {
        setAadhar(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
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
                            User Login
                        </Heading>
                        <FormControl id="aadhar" isRequired>
                            <FormLabel>Aadhar Id</FormLabel>
                            <Input
                                placeholder="Aadhar Id"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                onInput={handleChangeAadhar}
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
                              onClick={()=>{history.push("/auth/issuer/login")}}
                            > 
                                Not an user? Login as Issuer
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
            </Container>
        </React.Fragment>
    )
}

export default UserLogin;