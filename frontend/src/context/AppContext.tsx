import axios from "axios";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { AppContextType } from "../types";
import { useEffect } from "react";
import { authService } from "../main";

const AppContext = createContext<AppContextType | undefined>(undefined)
interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [location, setlocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [city, setCity] = useState("Fecthing Location...");

    async function fetchUser() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuth(false);
                return;
            }
            const { data } = await axios.get(`${authService}/api/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            setUser(data);
            setIsAuth(true);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchUser();

    }, []);
    useEffect(() => {
        if (!navigator.geolocation) {
            setCity("current location");
            return;
        }
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    setlocation({
                        latitude,
                        longitude,
                        formattedAddress: data.display_name || "current location",
                    });
                    setCity(
                        data.address.city || data.address.town || data.address.village || "current location"
                    );
                } catch (error) {
                    console.error("Error fetching address:", error);
                    setlocation({
                        latitude: null,
                        longitude: null,
                        formattedAddress: "current location",
                    });
                    setCity("current location");
                } finally {
                    setLoadingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation blocked/ignored:", error);
                setlocation({
                    latitude: null,
                    longitude: null,
                    formattedAddress: "current location",
                });
                setCity("current location");
                setLoadingLocation(false);
            }
        );
    }, []);
    return <AppContext.Provider value={{ isAuth, loading, user, setUser, setLoading, setIsAuth,location,loadingLocation,city }}>{children}</AppContext.Provider>;
};


export const useAppData = (): AppContextType => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error("useAppData must be used within AppProvider");
    }
    return context;
}