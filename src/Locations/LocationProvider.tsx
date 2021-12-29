import React, { useState } from 'react'

export interface Location {
    Name : string;
    Longitude : number;
    Latitude : number;
    Radius : number;
}

const _createDefaultLocation = () => { return {
    Name: "",
    Longitude : 0,
    Latitude : 0,
    Radius : 1000,
}}

export const LocationContext = React.createContext<{
    inProgLocation : Location;
    setInProgLocation : (location : Location) => void;
    isSheetOpen : boolean;
    setSheetOpen : (value : boolean) => void;
    locationArray : Location[];
    setLocationArray: (locationDict : Location[]) => void;
    }>({
        inProgLocation : _createDefaultLocation(),
        setInProgLocation : () => {},
        isSheetOpen : false,
        setSheetOpen : () => {},
        locationArray : [],
        setLocationArray : () => {}
    })


interface LocationProviderProps {}

export const LocationProvider: React.FC<LocationProviderProps> = ({children}) => {
    const [inProgLocation, setInProgLocation] = useState<Location>(_createDefaultLocation())
    const [isSheetOpen, setSheetOpen ] = useState(false)
    const [locationArray, setLocationArray] = useState<Location[]>([])

    return (
        <LocationContext.Provider value={{
            inProgLocation,
            setInProgLocation,
            isSheetOpen,
            setSheetOpen,
            locationArray,
            setLocationArray
        }}>{children}</LocationContext.Provider>
    );
}