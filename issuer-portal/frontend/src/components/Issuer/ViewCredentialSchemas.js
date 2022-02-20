import { useContext,useEffect } from "react";
import { issuerContext } from "../../context/IssuerContext";
import { Redirect } from 'react-router-dom';

// page to view all created credential Schemas (from api not blockchain)
function ViewCredentialSchemas() {
    const {isLoggedIn} = useContext(issuerContext)
    
    if(!isLoggedIn) return <Redirect to="/" />
}

export default ViewCredentialSchemas;