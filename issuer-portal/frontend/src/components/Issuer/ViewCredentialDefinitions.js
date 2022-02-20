import { useContext,useEffect } from "react";
import { issuerContext } from "../../context/IssuerContext";
import { Redirect } from 'react-router-dom';

function ViewCredentialDefinitions() {
    const {isLoggedIn} = useContext(issuerContext)
    
    if(!isLoggedIn) return <Redirect to="/" />
}

export default ViewCredentialDefinitions;