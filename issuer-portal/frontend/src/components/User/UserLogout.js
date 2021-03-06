import { useContext } from "react"
import { Redirect } from "react-router-dom";
import { userContext } from "../../context/UserContext";

function UserLogout(){
    const { logout } = useContext(userContext)    
    logout();

    return <Redirect to="/" />
}

export default UserLogout;