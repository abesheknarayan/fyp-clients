import { useContext,useEffect } from "react";
import { issuerContext } from "../../context/IssuerContext";
import { Redirect } from 'react-router-dom';

// component to view single credential schema
function ViewCredentialSchema() {
    const {isLoggedIn} = useContext(issuerContext)
    
    if(!isLoggedIn) return <Redirect to="/" />
}

export default ViewCredentialSchema;