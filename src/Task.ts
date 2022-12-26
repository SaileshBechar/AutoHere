import { GeofencingEventType, LocationObject, LocationRegion, stopGeofencingAsync, stopLocationUpdatesAsync } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { SMSDict } from './Trips/TripProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Notify } from './Trips/StartTrip';
import * as SMS from 'expo-sms';

export interface TaskManagerGeoFence {
    data : {
        eventType : GeofencingEventType,
        region : LocationRegion
    } | any, 
    error : TaskManager.TaskManagerError | null
};

export interface TaskManagerLocation {
    data : {
        location : LocationObject
    } | any, 
    error : TaskManager.TaskManagerError | null
};

export const GeoFenceTask = async <T extends TaskManagerGeoFence>({ data : {eventType, region}, error } : TaskManagerGeoFence) => {


    if (error) {
      // check `error.message` for more details.
      console.log("SendSMS Error Occurred")
      return;
    }

    let smsMSG = ""
    if (eventType === GeofencingEventType.Enter) { // TODO: Use some kind of React thing?
      console.log("You've entered region:", region);
      smsMSG = "Sailesh is here!"
    } else if (eventType === GeofencingEventType.Exit) {
      console.log("You've left region:", region);
      smsMSG = "Sailesh is leaving " + region.identifier
    }

    const isAvailable = await SMS.isAvailableAsync();
    
    try {
        const jsonTripDict = await AsyncStorage.getItem('TripDict')
        const tripDict = jsonTripDict !== null ? JSON.parse(jsonTripDict) as {[LatLngKey: string] : SMSDict[]} : {};
        console.log(tripDict)
        const latlngkey = region.latitude.toString() + "_" + region.longitude.toString()
        if (latlngkey in tripDict) {
            tripDict[latlngkey].map((contactInfo) => {
                const [firstName, ...secondNames] = contactInfo.ContactName.split(" ")
                const msg = "Hey " + firstName + ", Sailesh is Here!"
                
                if (isAvailable) {
                    console.log("SMS available!")
                    sendSMS([contactInfo.PhoneNumber], msg)
                } else {
                    const error = "No SMS enabled on device"
                    console.log(error)
                    Notify(error)
                }
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

export const sendSMS = async (phoneNumber : string[], msg : string) => {
    const { result } = await SMS.sendSMSAsync(
        phoneNumber,
        msg,
    );
}
export const LocationTask = <T extends TaskManagerLocation>({ data, error } : TaskManagerLocation) => {
    if (error) {
        // check `error.message` for more details.
        console.log("LocationTask Error Occurred")
        return;
    }
    return true
}
