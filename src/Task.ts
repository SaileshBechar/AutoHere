import { GeofencingEventType, LocationObject, LocationRegion, stopGeofencingAsync, stopLocationUpdatesAsync } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { SMSDict } from './Trips/TripProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as SMS from 'expo-sms';

const SENDER = "Sailesh"

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

    const isAvailable = await SMS.isAvailableAsync();
    
    try {
        const jsonTripDict = await AsyncStorage.getItem('TripDict')
        const tripDict = jsonTripDict !== null ? JSON.parse(jsonTripDict) as {[LatLngKey: string] : SMSDict[]} : {};
        console.log("Trip Dictionary:", tripDict)
        const latlngkey = region.latitude.toString() + "_" + region.longitude.toString()
        tripDict[latlngkey].map((contactInfo) => {
            if (latlngkey in tripDict && eventType === GeofencingEventType.Enter) {
                const [firstName, ...secondNames] = contactInfo.ContactName.split(" ")
                if (isAvailable) {
                    console.log("You've entered region:", region);
                    console.log("SMS available!")
                    const enterMsg = "Hey " + firstName + ", " + SENDER + " is Here!"
                    Notify(enterMsg)
                    sendSMS(contactInfo.PhoneNumber, enterMsg)
                } else {
                    const error = "No SMS enabled on device"
                    console.log(error)
                    Notify(error)
                }    
                delete tripDict[latlngkey]
            }
            else if (!(latlngkey in tripDict) && eventType === GeofencingEventType.Exit) {
                console.log("You've left region:", region);
                const exitMsg = SENDER + " is now leaving " + contactInfo.LocationName
                Notify(exitMsg)
                sendSMS(contactInfo.PhoneNumber, exitMsg)
            }
        })
        try {
            const jsonTripDict = JSON.stringify(tripDict)
            await AsyncStorage.setItem('TripDict', jsonTripDict)
        } catch(e) {
            console.log("Error saving TripDict")
        }
        return true
    } catch(e) {
        // error reading value
        console.log("Error reading TripDict")
        return {}
    }
    

    return true
}

export const sendSMS = async (phoneNumber : string, msg : string) => {
    try {
        console.log("Sending Message", phoneNumber, msg)
        fetch('https://us-central1-autoheredatabase.cloudfunctions.net/sendMessage', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                msg: msg,
                phone: phoneNumber,
            }),
        });
        } catch (err) {
        console.log("SendSMS didnt work.");
        console.log(err);
    }
}

export const Notify = (msg : string) => {
    Notifications.scheduleNotificationAsync({
        content: {
            title: msg,
            sound: true,
            autoDismiss: true
        },
    trigger: null,
    });
    Notifications.dismissAllNotificationsAsync()
}

export const LocationTask = <T extends TaskManagerLocation>({ data, error } : TaskManagerLocation) => {
    if (error) {
        // check `error.message` for more details.
        console.log("LocationTask Error Occurred")
        return;
    }
    return true
}
