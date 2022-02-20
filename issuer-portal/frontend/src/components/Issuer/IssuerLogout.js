import { useContext } from "react"
import { Redirect } from "react-router-dom";
import { issuerContext } from "../../context/IssuerContext"

function IssuerLogout(){
    const { logout } = useContext(issuerContext)    
    console.log("in issuer logout component")
    logout();

    return <Redirect to="/" />
}

export default IssuerLogout