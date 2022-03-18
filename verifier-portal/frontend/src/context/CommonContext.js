import { createContext, useState } from "react";

export const commonContext = createContext();

function CommonContextProvider(props) {
    const [isVerifierLoggedin, setIsVerifierLoggedin] = useState(localStorage.getItem("verifierLoginStatus") ? true : false);
    const [verifierData,setVerifier] = useState(localStorage.getItem("verifier")?localStorage.getItem("verifier"):null);
    const [isUserLoggedin, setIsUserLoggedin] = useState(localStorage.getItem("userLoginStatus") ? true : false);
    const [userData,setUser] = useState(localStorage.getItem("user")?localStorage.getItem("user"):null);
    console.log("in common context", isVerifierLoggedin, isUserLoggedin)


    const setVerifierLoginStatus = (val,verifier) => {
        setIsVerifierLoggedin(val)
        setVerifier(verifier)
        console.log("setting issuer to localstorage",val,verifier);
        if (val) {
            localStorage.setItem("verifierLoginStatus", val);
            localStorage.setItem("verifier",verifier);
        }
        else {
            localStorage.removeItem("verifierLoginStatus");
            localStorage.removeItem("verifier");
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
        <commonContext.Provider value={{ isVerifierLoggedin,verifierData,isUserLoggedin,userData, setVerifierLoginStatus, setUserLoginStatus }}>
            {props.children}
        </commonContext.Provider>
    )
}

export default CommonContextProvider;