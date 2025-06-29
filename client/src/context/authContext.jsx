import React, { createContext, useContext, useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'


const AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const token  = localStorage.getItem("authToken")
        if(token){
            setUser({token })// optionally decode token if needed
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
        }
        setLoading(false)
    },[])

    const login = (token) =>{
        localStorage.setItem("authToken", token)
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
        setUser({token})
    }
    const logout = () =>{
        localStorage.removeItem("authToken")
        delete axiosInstance.defaults.headers.common["Authorization"]
        setUser(null)
        console.log("token deleted!")
        
    } 

  return (
    <AuthContext.Provider value={{user, login, logout, loading}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)