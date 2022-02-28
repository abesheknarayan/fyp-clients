import { Box, Container, Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";

// component to view single credential schema
function ViewCredentialDefinition(props) {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    return (
        <Box border='1px' borderRadius='lg' borderColor='gray' padding='3' margin='3' width='max-content'>
            <Box padding='1' display='flex'> <Text> Defintion Name: </Text> <Text paddingLeft='1' color='tomato'> {props.value.name} </Text> </Box>
            <Box padding='1' display='flex'> <Text> Defintion Version: </Text> <Text paddingLeft='1' color='tomato' >  {props.value.version} </Text> </Box>
            <Box padding='1' display='flex'> <Text> Definition Id: </Text> <Text paddingLeft='1' color='tomato' >  {props.value.id} </Text> </Box>
            <Box padding='1' display='flex'> <Text> Verification Key: </Text> <Text paddingLeft='1' color='tomato' >  {props.value.v_key} </Text> </Box>
            <Box padding='1' display='flex'> <Text> Schema Id: </Text> <Text paddingLeft='1' color='tomato' >  {props.value.credSchema_id} </Text> </Box>
            <Box padding='1' display='flex'> <Text> Creator Address: </Text> <Text paddingLeft='1' color='tomato'  >  {props.value.issuer_address} </Text> </Box>
            <Box padding='1' display='flex'> <Text> Revocatable </Text> <Text paddingLeft='1' color='tomato' >  {props.value.is_revocatable} </Text> </Box>
        </Box>
    )

}

export default ViewCredentialDefinition;