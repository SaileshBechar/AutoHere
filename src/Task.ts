import { GeofencingEventType, LocationObject, LocationRegion, stopGeofencingAsync, stopLocationUpdatesAsync } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { SMSDict } from './Trips/TripProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Notify } from './Trips/StartTrip';

interface TaskManagerGeoFence {
    data : {
        eventType : GeofencingEventType,
        region : LocationRegion
    }, 
    error : TaskManager.TaskManagerError
};

interface TaskManagerLocation {
    data : {
        location : LocationObject
    }, 
    error : TaskManager.TaskManagerError
};

export const GeoFenceTask = async <TaskManagerGeoFence>({ data : {eventType, region}, error } : TaskManagerGeoFence) => {


    if (error) {
      // check `error.message` for more details.
      console.log("SendSMS Error Occurred")
      return;
    }

    if (eventType === GeofencingEventType.Enter) {
      console.log("You've entered region:", region);
    } else if (eventType === GeofencingEventType.Exit) {
      console.log("You've left region:", region);
    }
    
    try {
        const jsonTripDict = await AsyncStorage.getItem('TripDict')
        const tripDict = jsonTripDict !== null ? JSON.parse(jsonTripDict) as {[LatLngKey: string] : SMSDict[]} : {};
        console.log(tripDict)
        const latlngkey = region.latitude.toString() + "_" + region.longitude.toString()
        if (latlngkey in tripDict) {
            tripDict[latlngkey].map((contactInfo) => {
                const [first, ...second] = contactInfo.ContactName.split(" ")
                const msg = "Hey " + first + ", Sailesh is Here!"
                console.log(msg)
                Notify(msg)
            })
            delete tripDict[latlngkey]

            try {
                const jsonTripDict = JSON.stringify(tripDict)
                await AsyncStorage.setItem('TripDict', jsonTripDict)
            } catch(e) {
                console.log("Error saving TripDict")
            }
            return true
    }
      } catch(e) {
        // error reading value
        console.log("Error reading TripDict")
        return {}
    }
    

    return true
}

export const LocationTask = <TaskManagerLocation>({ data : {locations}, error } : TaskManagerLocation) => {
    if (error) {
        // check `error.message` for more details.
        console.log("LocationTask Error Occurred")
        return;
    }
    return true
}
