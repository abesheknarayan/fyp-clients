import React, {
    createContext,
    useCallback,
    useState,
    useEffect,
    useContext,
  } from "react";
  import { axiosInstance } from "../utils/axios";
  import { commonContext } from './CommonContext';
  
  export const verifierContext = createContext();
  
  function VerifierContextProvider(props) {
    const { isUserLoggedin, verifierData, isVerifierLoggedin, setVerifierLoginStatus } = useContext(commonContext)
    const [verifier, setVerifier] = useState(verifierData);
    const [isLoggedin, setIsLoggedin] = useState(isVerifierLoggedin);
  
    const fetchVerifier = useCallback(async () => {
      try {
        // gets if verifier is already logged in using jwt
        // returns back jwt and verifier details
        let resp = await axiosInstance.get('/verifier/me');
        if (resp.data) {
          setVerifierLoginStatus(true, resp.data)
          setVerifier(resp.data);
          setIsLoggedin(true);
          return;
          
        }
        setVerifierLoginStatus(false, null);
        setVerifier(null);
        setIsLoggedin(false);
      } catch (error) {
        setVerifierLoginStatus(false, verifier);
        setIsLoggedin(false);
        console.error(error);
      }
    }, []);
  
    useEffect(() => {
      if (!isUserLoggedin) fetchVerifier();
      return function cleanup() {
        setVerifierLoginStatus(false, verifier);
        setIsLoggedin(false);
      }
    }, [fetchVerifier, isUserLoggedin]);
  
    const saveVerifier = (verifier) => {
      setVerifierLoginStatus(true, verifier);
      setVerifier(verifier);
      setIsLoggedin(true);
    }
  
    const logout = async () => {
      try {
        await axiosInstance.get("/auth/verifier/logout")
        setVerifierLoginStatus(false, null);
        setVerifier(null);
        setIsLoggedin(false);
      }
      catch (err) {
        console.error(err);
      }
    }
  
  
    return (
      <verifierContext.Provider value={{ verifier, isLoggedin, saveVerifier, logout }}>
        {props.children}
      </verifierContext.Provider>
    );
  }
  
  export default VerifierContextProvider;