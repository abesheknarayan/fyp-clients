import { useContext } from "react"
import { Redirect } from "react-router-dom";
import { verifierContext } from "../../context/VerifierContext";

function VerifierLogout(){
    const { logout } = useContext(verifierContext)    
    logout();

    return <Redirect to="/" />
}

export default VerifierLogout;