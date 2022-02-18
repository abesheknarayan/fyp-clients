import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import { Redirect } from 'react-router-dom';

// page to view all created credentials by issuer (only details like revocationId,witness,userId maybe stored)
function ViewIssuedCredentials() {
    const {isLoggedIn} = useContext(userContext)
    
    if(!isLoggedIn) return <Redirect to="/" />
}

export default ViewIssuedCredentials;