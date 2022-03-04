import { Box, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";

// component to view single credential schema
function ViewCredentialSchema(props) {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isIssuerLoggedin) return <Redirect to="/auth/issuer/login" />

    let attributes = JSON.parse(props.value.attributes);
    console.log(attributes);

    return (
        <Box border='1px' borderRadius='lg' borderColor='gray' padding='3' margin='3' width='max-content'>
            <Box padding='1' display='flex'> <Text> Schema Name: </Text> <Text paddingLeft='1' color='tomato'> {props.value.name} </Text> </Box>
            <Box padding='1' display='flex'> <Text> Schema Version: </Text> <Text paddingLeft='1' color='tomato' >  {props.value.version} </Text> </Box>
            <Box padding='1' display='flex'> <Text> Schema Id: </Text> <Text paddingLeft='1' color='tomato' >  {props.value.id} </Text> </Box>
            <Box padding='1' display='flex'> <Text> Creator Address: </Text> <Text paddingLeft='1' color='tomato'  >  {props.value.creator_address} </Text> </Box>
            <Text> Attributes  </Text>
            {
                attributes.map((attribute, index) => (
                    <div key={index}>
                        <Box padding='1' display='flex'> <Text> Attribute {index + 1}:  </Text> <Text paddingLeft='1' color='tomato'> {attribute.value}  </Text> </Box>
                        <Box padding='1' display='flex'> <Text> Type:  </Text> <Text paddingLeft='1' color='tomato'> {attribute.type}  </Text> </Box>
                    </div>
                ))
            }
        </Box>
    )

}

export default ViewCredentialSchema;