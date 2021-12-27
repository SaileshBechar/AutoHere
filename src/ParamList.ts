import * as Location from 'expo-location';

export type ParamList = {
    Home : undefined;
    Map: {
        "coords" : Location.LocationObject["coords"] | undefined
    };
}