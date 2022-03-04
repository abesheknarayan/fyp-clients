import { useContext } from "react";
import { Redirect } from 'react-router-dom';
import { commonContext } from "../../context/CommonContext";
commonContext


function ViewAllCredentials() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    console.log("rendering user dashboard")
    console.log(isIssuerLoggedin, isUserLoggedin)
    
    if(isIssuerLoggedin) 
        return <Redirect to="/issuer/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />

}

export default ViewAllCredentials;