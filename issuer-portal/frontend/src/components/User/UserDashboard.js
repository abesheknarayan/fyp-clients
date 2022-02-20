import React, { useContext } from "react"
import { Redirect } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { userContext } from "../../context/UserContext"


function UserDashboard() {
    const {isIssuerLoggedin,isUserLoggedin} = useContext(commonContext);
    const {user,isLoggedin} = useContext(userContext);
    console.log("rendering user dashboard")
    console.log(isIssuerLoggedin,isUserLoggedin,isLoggedin)
    if(!isLoggedin){ 
        console.log("here")
        return <Redirect to="/auth/user/login"/> }
    console.log(user);
    return (
        <React.Fragment>
            <h1> User Dashboard Page </h1>
            <h2> Welcome {user.aadharID} </h2>
        </React.Fragment>
    )
}

export default UserDashboard;