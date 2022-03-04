import React, {
    createContext,
    useCallback,
    useState,
    useEffect,
    useContext,
} from "react";
import { Redirect } from 'react-router-dom';
import { axiosInstance } from "../utils/axios";
import { commonContext } from "./CommonContext";

export const userContext = createContext();

function UserContextProvider(props) {
    const { isIssuerLoggedin, setUserLoginStatus,userData,isUserLoggedin } = useContext(commonContext);
    const [user, setUser] = useState(userData);
    const [isLoggedin, setisLoggedin] = useState(isUserLoggedin);
    console.log('in user context')

    const fetchUser = useCallback(async () => {
        try {
            // gets if issuer is already logged in using jwt
            // returns back jwt and issuer details
            console.log("fetching user")
            let resp = await axiosInstance.get('/user/me');
            console.log(resp);
            if (resp.data) {
                setUserLoginStatus(true,resp.data);
                setUser(resp.data);
                setisLoggedin(true);
                return;
            }
            setUserLoginStatus(false,null);
            setUser(null);
            setisLoggedin(false);
        } catch (error) {
            setUserLoginStatus(false,user);
            setisLoggedin(false);
            console.log(error);
        }
    }, []);

    useEffect(() => {
        if (!isIssuerLoggedin) fetchUser();
        return function cleanup() {
            setUserLoginStatus(false,user);
            setisLoggedin(false);
        }
    }, [fetchUser,isIssuerLoggedin]);

    const saveUser = (user) => {
        // console.log("saveUser called")
        // console.log(user)
        setUserLoginStatus(true,user);
        setUser(user);
        setisLoggedin(true);
    }

    const logout = async () => {
        try {
            console.log('logging out user!')
            let res = await axiosInstance.get("/auth/user/logout")
            setUserLoginStatus(false,null);
            setUser(null);
            setisLoggedin(false);
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <userContext.Provider value={{ user, isLoggedin, saveUser, logout }}>
            {props.children}
        </userContext.Provider>
    );
}

export default UserContextProvider;