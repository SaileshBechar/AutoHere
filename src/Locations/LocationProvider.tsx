import React, { useState } from 'react'

export interface Location {
    Longitude : number;
    Latitude : number;
    Radius : number;
}

const _createDefaultLocation = () => { return {
    Longitude : 0,
    Latitude : 0,
    Radius : 1000,
}}

export const SheetContext = React.createContext<{
    inProgLocation : Location;
    setInProgLocation : (location : Location) => void;
    isSheetOpen : boolean;
    setSheetOpen : (value : boolean) => void
    }>({
        inProgLocation : _createDefaultLocation(),
        setInProgLocation : () => {},
        isSheetOpen : false,
        setSheetOpen : () => {}
    })


interface LocationProviderProps {}

export const LocationProvider: React.FC<LocationProviderProps> = ({children}) => {
    const [inProgLocation, setInProgLocation] = useState<Location>(_createDefaultLocation())
    const [isSheetOpen, setSheetOpen ] = useState(false)

    return (
        <SheetContext.Provider value={{
            inProgLocation,
            setInProgLocation,
            isSheetOpen,
            setSheetOpen
        }}>{children}</SheetContext.Provider>
    );
}