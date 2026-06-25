import type React from "react";

export interface User {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: string;
}
export interface LocationData{
    latitude: number;
    longitude: number;
    formattedAddress: string;
}

export interface AppContextType{
    user: User | null;
    loading:boolean;
    isAuth:boolean;
    setUser:React.Dispatch<React.SetStateAction< User | null>>;
    setLoading:React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth:React.Dispatch<React.SetStateAction<boolean>>;
    location: LocationData;
    loadingLocation: boolean;
    city:string;
    
}
export interface IRestaurant {
    _id: string,
    name: string;
    description ?: string;
    image: string;
    ownerId: string;
    phone: number;
    isVerified: boolean;

    autoLocation:{
        type: "point",
        coordinates: [number, number]; //[longitude, latitude]
        formattedAddress: string;
    };
    isOpen: boolean;
    createdAt: Date;
}
