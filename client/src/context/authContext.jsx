import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setUserToken({ token }); // optionally decode token if needed
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
        fetchUser()
    }
    setLoading(false);
  },[]);

  async function fetchUser() {
      try {
        setLoading(true)
        const {data} = await axiosInstance.get("/user/me");
        setUser(data.user)
      } catch (err) {
        console.log("Error while fetching User", err.message);
        logout()
      }finally{
        setLoading(false)
      }
    }

  const login = (token) => {
    localStorage.setItem("authToken", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUserToken({ token });
    fetchUser()
  };
  const logout = () => {
    localStorage.removeItem("authToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUserToken(null);
    console.log("token deleted!");
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
