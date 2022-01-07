import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Location {
    Name : string;
    Longitude : number;
    Latitude : number;
    Radius : number;
}

export const _createDefaultLocation = () => { return {
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
    setLocationArray : (locationArray : Location[]) => void;
    getLocations : () => Promise<Location[]>
    saveLocations : (locations : Location[]) => Promise<void>;
    }>({
        inProgLocation : _createDefaultLocation(),
        setInProgLocation : () => {},
        isSheetOpen : false,
        setSheetOpen : () => {},
        locationArray : [],
        setLocationArray : () => {},
        getLocations : async () => [],
        saveLocations : async () => {}
    })


interface LocationProviderProps {}

export const LocationProvider: React.FC<LocationProviderProps> = ({children}) => {
    const [inProgLocation, setInProgLocation] = useState<Location>(_createDefaultLocation())
    const [locationArray, setLocationArray] = useState<Location[]>([]);
    const [isSheetOpen, setSheetOpen ] = useState(false)

    return (
        <LocationContext.Provider value={{
            inProgLocation,
            setInProgLocation,
            isSheetOpen,
            setSheetOpen,
            locationArray,
            setLocationArray,
            getLocations : async () => {
                try {
                    const jsonLocations = await AsyncStorage.getItem('Locations')
                    return jsonLocations !== null ? JSON.parse(jsonLocations) as Location[] : [];
                  } catch(e) {
                    // error reading value
                    console.log("Error reading locations")
                    return []
                  }
            }, 
            saveLocations : async (locations : Location[]) => {
                try {
                    const jsonLocations = JSON.stringify(locations)
                    await AsyncStorage.setItem('Locations', jsonLocations)
                    setLocationArray(locations)
                } catch(e) {
                    console.log("Error saving locations")
                }
            },
        }}>{children}</LocationContext.Provider>
    );
}