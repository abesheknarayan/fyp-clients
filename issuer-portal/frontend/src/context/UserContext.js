import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { axiosInstance } from "../utils/axios";

export const userContext = createContext();

function UserContextProvider(props) {
  const [user, setUser] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(null);

  const fetchUser = useCallback(async () => {
      try {
        // gets if user is already logged in using jwt
        let resp = await axiosInstance.get('/api/user/me');
        if (resp.data) {
          setUser({
            // user fields can be updated later
            aadharID: resp.data.aadharID,
            userID: resp.data.userID,
          });

        }
      } catch (error) {
        console.log(error);
      }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const saveUser = (user) => {
    setUser(user);
    localStorage.setItem('userId', user.userID);
    setIsLoggedin(true);
  }

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem('userID');
    setIsLoggedin(false);
  }

  return (
    <userContext.Provider value={{ user }}>
      {props.children}
    </userContext.Provider>
  );
}

export default UserContextProvider;