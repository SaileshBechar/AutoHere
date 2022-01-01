import * as Location from 'expo-location';
import { Trip } from './Trips/TripProvider';

export type RootStackParamList = {
    RouteTabs : undefined;
    AddLocation: {
        "coords" : Location.LocationObject["coords"] | undefined
    };
    StartTrip : {
        "trip" : Trip
    }
}

export type TabsParamList = {
    Home : undefined;
    Contacts: undefined;
    Locations: undefined;
    Trips: undefined
}

export type ContactStackParamList = {
    ListContacts : undefined;
    CreateContact : undefined;
    ImportContacts : undefined;
}

export type LocationStackParamList = {
    ListLocations : undefined;
}

export type HomeStackParamList = {
    Welcome: undefined;
}

export type TripStackParamList = {
    ListTrips: undefined;
    CreateTrip : undefined;
    AddContactsToTrip : undefined; 
    AddLocationToTrip : undefined; 
    StartTrip : {
        "trip" : Trip
    }
}