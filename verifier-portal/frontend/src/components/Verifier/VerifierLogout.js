import { useContext } from "react"
import { Redirect } from "react-router-dom";
import { verifierContext } from "../../context/VerifierContext";

function VerifierLogout(){
    const { logout } = useContext(verifierContext)    
    console.log("in issuer logout component")
    logout();

    return <Redirect to="/" />
}

export default VerifierLogout;