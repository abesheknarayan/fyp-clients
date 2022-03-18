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
    // console.log('in verifier context', isLoggedin, verifier, isUserLoggedin)
  
    const fetchVerifier = useCallback(async () => {
      try {
        // gets if verifier is already logged in using jwt
        // returns back jwt and verifier details
        console.log("fetching verifier")
        let resp = await axiosInstance.get('/verifier/me');
        console.log(resp);
        if (resp.data) {
          console.log("here 22")
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
      console.log("saveVerifier called")
      console.log(verifier)
      setVerifierLoginStatus(true, verifier);
      setVerifier(verifier);
      setIsLoggedin(true);
    }
  
    const logout = async () => {
      try {
        console.log('logging out verifier!')
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