import axios from "axios";
import { createContext, useState, type ReactNode } from "react";
import type { AppContextType } from "../../types";
import { useEffect } from "react";

const AppContext = createContext<AppContextType | undefined >(undefined)
interface AppProviderProps{
    children:ReactNode;
}

export const AppProvider = ({children}:AppProviderProps)=>{
    const[user,setUser]=useState(null);
    const[isAuth,setIsAuth]=useState(false);
    const[loading,setLoading] = useState(true);
    const [location,setlocation] = useState(null);
    const [loadingLocation,setLoadingLocation]=useState(false);
    const [city,setCity]=useState("Fecthing Location...");

    async function fetchUser(){
        try {
            const token = localStorage.getItem("token");
            if(!token){
                setIsAuth(false);
                return;
            }
            const {data}= await axios.get(`{authService}/api/auth/me`,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            setUser(data.user);
            setIsAuth(true);
            
        } catch (error) {
            console.log(error);
            
        } finally{
            setloading(false)
        }
    }
    useEffect(()=>{
        fetchUser();

    },[]);
    return <AppContext.Provider value={{isAuth,loading,user,setUser,setLoading,setIsAuth}}>{children}</AppContext.Provider>
};

