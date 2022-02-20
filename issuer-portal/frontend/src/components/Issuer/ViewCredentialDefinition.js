import { useContext, useEffect } from "react";
import { issuerContext } from "../../context/IssuerContext";
import { Redirect } from 'react-router-dom';

// page to view a single credential definition
function ViewCredentialDefinition() {
    const {isLoggedIn} = useContext(issuerContext)
    
    if(!isLoggedIn) return <Redirect to="/" />
}

export default ViewCredentialDefinition;