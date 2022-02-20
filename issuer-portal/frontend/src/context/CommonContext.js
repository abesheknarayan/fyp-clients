import { createContext, useEffect, useState } from "react";

export const commonContext = createContext();

function CommonContextProvider(props) {
    const [isIssuerLoggedin, setIsIssuerLoggedin] = useState(localStorage.getItem("issuerLoginStatus") ? true : false);
    const [isUserLoggedin, setIsUserLoggedin] = useState(localStorage.getItem("userLoginStatus") ? true : false);
    console.log("in common context", isIssuerLoggedin, isUserLoggedin)


    const setIssuerLoginStatus = (val) => {
        setIsIssuerLoggedin(val)
        if (val) {
            localStorage.setItem("issuerLoginStatus", val);
        }
        else {
            localStorage.removeItem("issuerLoginStatus");
        }

    }

    const setUserLoginStatus = (val) => {
        setIsUserLoggedin(val);
        if (val) {
            localStorage.setItem("userLoginStatus", val);
        }
        else {
            localStorage.removeItem("userLoginStatus");
        }
    }

    return (
        <commonContext.Provider value={{ isIssuerLoggedin, isUserLoggedin, setIssuerLoginStatus, setUserLoginStatus }}>
            {props.children}
        </commonContext.Provider>
    )
}

export default CommonContextProvider;