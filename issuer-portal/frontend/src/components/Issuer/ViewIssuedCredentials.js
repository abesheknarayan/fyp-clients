import { useContext,useEffect } from "react";
import { issuerContext } from "../../context/IssuerContext";
import { Redirect } from 'react-router-dom';

// page to view all created credentials by issuer (only details like revocationId,witness,userId maybe stored)
function ViewIssuedCredentialsIssuer() {
    const {isLoggedIn} = useContext(issuerContext)
    
    if(!isLoggedIn) return <Redirect to="/" />
}

export default ViewIssuedCredentialsIssuer;