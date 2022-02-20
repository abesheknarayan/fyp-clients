import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { Redirect } from 'react-router-dom';
import { axiosInstance } from "../utils/axios";
import { commonContext } from './CommonContext';

export const issuerContext = createContext();

function IssuerContextProvider(props) {
  const [issuer, setIssuer] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { isUserLoggedin, setIssuerLoginStatus } = useContext(commonContext)
  console.log('in issuer context', isUserLoggedin)

  const fetchIssuer = useCallback(async () => {
    try {
      // gets if issuer is already logged in using jwt
      // returns back jwt and issuer details
      console.log("fetching issuer")
      let resp = await axiosInstance.get('/issuer/me');
      // console.log(resp);
      if (resp.data) {
        setIssuerLoginStatus(true)
        setIssuer(resp.data);
        setIsLoggedin(true);
      }
    } catch (error) {
      setIssuerLoginStatus(false);
      setIsLoggedin(false);
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoggedin) fetchIssuer();
    return function cleanup() {
      setIssuerLoginStatus(false);
      setIsLoggedin(false);
    }
  }, [fetchIssuer, isUserLoggedin]);

  const saveIssuer = (issuer) => {
    console.log("saveIssuer called")
    console.log(issuer)
    setIssuerLoginStatus(true);
    setIssuer(issuer);
    setIsLoggedin(true);
  }

  const logout = async () => {
    try {
      console.log('logging out issuer!')
      let res = await axiosInstance.get("/auth/issuer/logout")
      setIssuerLoginStatus(false);
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