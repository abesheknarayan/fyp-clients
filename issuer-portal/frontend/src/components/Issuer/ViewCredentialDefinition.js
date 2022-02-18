import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import { Redirect } from 'react-router-dom';

// page to view a single credential definition
function ViewCredentialDefinition() {
    const {isLoggedIn} = useContext(userContext)
    
    if(!isLoggedIn) return <Redirect to="/" />
}

export default ViewCredentialDefinition;