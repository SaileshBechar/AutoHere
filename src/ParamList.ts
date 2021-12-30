import * as Location from 'expo-location';

export type RootStackParamList = {
    RouteTabs : undefined;
    AddLocation: {
        "coords" : Location.LocationObject["coords"] | undefined
    };
    // StartTrip
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
    StartTrip: undefined;
}

export type TripStackParamList = {
    ListTrips: undefined;
    StartTrip: undefined;
}