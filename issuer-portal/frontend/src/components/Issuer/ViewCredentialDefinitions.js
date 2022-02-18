import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import { Redirect } from 'react-router-dom';

function ViewCredentialDefinitions() {
    const {isLoggedIn} = useContext(userContext)
    
    if(!isLoggedIn) return <Redirect to="/" />
}

export default ViewCredentialDefinitions;