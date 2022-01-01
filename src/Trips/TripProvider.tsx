import React, { createContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../Contacts/ContactProvider';
import { Location, _createDefaultLocation } from '../Locations/LocationProvider';

export const TripContext = createContext<{
    inProgTrip : Trip;
    setInProgTrip : (trip : Trip) => void;
    getTrips : () => Promise<Trip[]>;
    saveTrips : (trips : Trip[]) => Promise<void>;
    }>({
        inProgTrip : {Name : "", Stops : []},
        setInProgTrip : () => {},
        getTrips : async () => [],
        saveTrips : async () => {}
    })

export interface Trip {
    Name : string;
    Stops : TripStop[];
}

export interface TripStop {
    Contacts : Contact[];
    Location : Location;
}

interface TripProviderProps {}

export const TripProvider: React.FC<TripProviderProps> = ({children}) => {
    const [inProgTrip, setInProgTrip] = useState<Trip>({Name : "", Stops : [{Contacts : [], Location: _createDefaultLocation()}]})

    return (
        <TripContext.Provider value={{
            inProgTrip,
            setInProgTrip,
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
                } catch(e) {
                    console.log("Error saving trips")
                }
            },
        }}>{children}</TripContext.Provider>
    );
}