import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { axiosInstance } from "../utils/axios";
import { commonContext } from './CommonContext';

export const issuerContext = createContext();

function IssuerContextProvider(props) {
  const { isUserLoggedin, issuerData, isIssuerLoggedin, setIssuerLoginStatus } = useContext(commonContext)
  const [issuer, setIssuer] = useState(issuerData);
  const [isLoggedin, setIsLoggedin] = useState(isIssuerLoggedin);

  const fetchIssuer = useCallback(async () => {
    try {
      // gets if issuer is already logged in using jwt
      // returns back jwt and issuer details
      let resp = await axiosInstance.get('/issuer/me');
      if (resp.data) {
        setIssuerLoginStatus(true, resp.data)
        setIssuer(resp.data);
        setIsLoggedin(true);
        return;
        
      }
      setIssuerLoginStatus(false, null);
      setIssuer(null);
      setIsLoggedin(false);
    } catch (error) {
      setIssuerLoginStatus(false, issuer);
      setIsLoggedin(false);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoggedin) fetchIssuer();
    return function cleanup() {
      setIssuerLoginStatus(false, issuer);
      setIsLoggedin(false);
    }
  }, [fetchIssuer, isUserLoggedin]);

  const saveIssuer = (issuer) => {
    setIssuerLoginStatus(true, issuer);
    setIssuer(issuer);
    setIsLoggedin(true);
  }

  const logout = async () => {
    try {
      await axiosInstance.get("/auth/issuer/logout")
      setIssuerLoginStatus(false, null);
      setIssuer(null);
      setIsLoggedin(false);
    }
    catch (err) {
      console.error(err);
    }
  }


  return (
    <issuerContext.Provider value={{ issuer, isLoggedin, saveIssuer, logout }}>
      {props.children}
    </issuerContext.Provider>
  );
}

export default IssuerContextProvider;