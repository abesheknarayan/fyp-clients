import React, { useContext } from "react"
import { Redirect } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { userContext } from "../../context/UserContext"
import Navbar from './Navbar';


function UserDashboard() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const { user, isLoggedin } = useContext(userContext);
    
    if(isIssuerLoggedin) 
        return <Redirect to="/issuer/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />

    return (
        <React.Fragment>
            <Navbar />
            <h1> User Dashboard Page </h1>
            <h2> Welcome {user.aadharID} </h2>
        </React.Fragment>
    )
}

export default UserDashboard;