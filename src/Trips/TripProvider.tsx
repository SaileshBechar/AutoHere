import React, { createContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../Contacts/ContactProvider';
import { Location, _createDefaultLocation } from '../Locations/LocationProvider';

export const TripContext = createContext<{
    inProgTrip : Trip;
    setInProgTrip : (trip : Trip) => void;
    tripArray : Trip[]
    setTripArray : (trip : Trip[]) => void
    getTrips : () => Promise<Trip[]>;
    saveTrips : (trips : Trip[]) => Promise<void>;
    getTripDict : () => Promise<{[LatLngKey: string] : SMSDict[]} | void>; // TODO: shouldnt be void lol
    saveTripDict : (tripDict : {[LatLngKey: string] : SMSDict[]}) => Promise<void>;
    }>({
        inProgTrip : {Name : "", Stops : []},
        setInProgTrip : () => {},
        tripArray : [], 
        setTripArray : () => {},
        getTrips : async () => [],
        saveTrips : async () => {},
        getTripDict : async () => {},
        saveTripDict : async () => {}
    })

export interface Trip {
    Name : string;
    Stops : TripStop[];
}

export interface TripStop {
    Contacts : Contact[];
    Location : Location;
}

export interface SMSDict {
    ContactName : string,
    PhoneNumber : string,
    LocationName : string
}

interface TripProviderProps {}

export const TripProvider: React.FC<TripProviderProps> = ({children}) => {
    const [inProgTrip, setInProgTrip] = useState<Trip>({Name : "", Stops : [{Contacts : [], Location: _createDefaultLocation()}]})
    const [tripArray, setTripArray] = useState<Trip[]>([]);

    return (
        <TripContext.Provider value={{
            inProgTrip,
            setInProgTrip,
            tripArray, 
            setTripArray,
            getTrips : async () => {
                try {
                    const jsonTrips = await AsyncStorage.getItem('Trips')
                    return jsonTrips !== null ? JSON.parse(jsonTrips) as Trip[] : [];
                  } catch(e) {
                    // error reading value
                    console.log("Error reading trips")
                    return []
                  }
            }, 
            saveTrips : async (trips : Trip[]) => {
                try {
                    const jsonTrips = JSON.stringify(trips)
                    await AsyncStorage.setItem('Trips', jsonTrips)
                    setTripArray(trips)
                } catch(e) {
                    console.log("Error saving trips")
                }
            },
            getTripDict : async () => {
                try {
                    const jsonTripDict = await AsyncStorage.getItem('TripDict')
                    return jsonTripDict !== null ? JSON.parse(jsonTripDict) as {[LatLngKey: string] : SMSDict[]} : {};
                  } catch(e) {
                    // error reading value
                    console.log("Error reading TripDict")
                    return {}
                  }
            }, 
            saveTripDict : async (tripDict : {[LatLngKey: string] : SMSDict[]}) => {
                try {
                    const jsonTripDict = JSON.stringify(tripDict)
                    await AsyncStorage.setItem('TripDict', jsonTripDict)
                } catch(e) {
                    console.log("Error saving TripDict")
                }
            }
        }}>{children}</TripContext.Provider>
    );
}