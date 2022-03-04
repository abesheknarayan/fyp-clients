import { createContext, useState } from "react";

export const commonContext = createContext();

function CommonContextProvider(props) {
    const [isIssuerLoggedin, setIsIssuerLoggedin] = useState(localStorage.getItem("issuerLoginStatus") ? true : false);
    const [issuerData,setIssuer] = useState(localStorage.getItem("issuer")?localStorage.getItem("issuer"):null);
    const [isUserLoggedin, setIsUserLoggedin] = useState(localStorage.getItem("userLoginStatus") ? true : false);
    const [userData,setUser] = useState(localStorage.getItem("user")?localStorage.getItem("user"):null);
    console.log("in common context", isIssuerLoggedin, isUserLoggedin)


    const setIssuerLoginStatus = (val,issuer) => {
        setIsIssuerLoggedin(val)
        setIssuer(issuer)
        console.log("setting issuer to localstorage",val,issuer);
        if (val) {
            localStorage.setItem("issuerLoginStatus", val);
            localStorage.setItem("issuer",issuer);
        }
        else {
            localStorage.removeItem("issuerLoginStatus");
            localStorage.removeItem("issuer");
        }

    }

    const setUserLoginStatus = (val,user) => {
        setIsUserLoggedin(val);
        setUser(user);
        if (val) {
            localStorage.setItem("userLoginStatus", val);
            localStorage.setItem("user",user);
        }
        else {
            localStorage.removeItem("userLoginStatus");
            localStorage.removeItem("user");
        }
    }

    return (
        <commonContext.Provider value={{ isIssuerLoggedin,issuerData,isUserLoggedin,userData, setIssuerLoginStatus, setUserLoginStatus }}>
            {props.children}
        </commonContext.Provider>
    )
}

export default CommonContextProvider;