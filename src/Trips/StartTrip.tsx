import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { ReactDOM, ReactElement, useContext, useEffect, useState } from 'react'
import { View, Text, Dimensions, StyleSheet} from 'react-native';
import { RootStackParamList } from '../ParamList';
import * as ExpoLocation from 'expo-location';
import {Location} from '../Locations/LocationProvider'
import MapView, { Circle, Marker } from 'react-native-maps';
import { SMSDict, TripContext } from './TripProvider';
import { LocationRegion } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { Notify, sendSMS, getDirections } from '../Task';

const SENDER = "Sailesh"

interface StartTripProps {
    navigation : NativeStackNavigationProp<RootStackParamList, "StartTrip">
    route : RouteProp<RootStackParamList, "StartTrip">
}

export const StartTrip: React.FC<StartTripProps> = ({navigation, route}) => {
    const {saveTripDict} = useContext(TripContext)
    const [errorMsg, setErrorMsg] = useState("");
    const [ region, setRegion ] = useState({
		latitude: 43.642567,
		longitude: -79.387054,
		latitudeDelta: 0.0371,
		longitudeDelta: 0.0307
	})

    useEffect(() => {
        (async () => {
            let { status } = await ExpoLocation.requestBackgroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                console.log(errorMsg)
                return;
            }
            ExpoLocation.enableNetworkProviderAsync()  

            let location = await ExpoLocation.getCurrentPositionAsync({});
            setRegion({...region, latitude: location.coords.latitude, longitude: location.coords.longitude})
            ExpoLocation.startLocationUpdatesAsync("LocationTask", {
                accuracy: ExpoLocation.Accuracy.High, 
                activityType : ExpoLocation.ActivityType.AutomotiveNavigation
            })

            const locationRegions : LocationRegion[] = []
            const tripDict : {[LatLngKey: string] : SMSDict[]} = {}

            route.params.trip.Stops.map((stop, index, tripArr) => {
                locationRegions.push({
                    latitude : stop.Location.Latitude, 
                    longitude : stop.Location.Longitude, 
                    radius : stop.Location.Radius,
                    notifyOnExit : index !== tripArr.length - 1
                })

                const latlngkey : string = stop.Location.Latitude.toString() + "_" + stop.Location.Longitude.toString()
                stop.Contacts.map(async (contact, c_index) => {
                    c_index === 0 ? tripDict[latlngkey] = [{
                        ContactName : contact.Name, 
                        PhoneNumber : contact.PhoneNumber,
                        LocationName : stop.Location.Name
                    }] : 
                    tripDict[latlngkey] = [...tripDict[latlngkey], {
                        ContactName : contact.Name, 
                        PhoneNumber : contact.PhoneNumber,
                        LocationName : stop.Location.Name
                    }]
                    const directions = await getDirections(`${location.coords.latitude}, ${location.coords.longitude}`,`${stop.Location.Latitude.toString()}, ${stop.Location.Longitude.toString}`)
                    const msg = `${SENDER} is leaving now and will arrive in ~${directions.duration} mins!`
                    console.log(contact.PhoneNumber, msg)
                    sendSMS(contact.PhoneNumber, msg)
                    Notify(msg)
                })
            })
            await saveTripDict(tripDict)
            ExpoLocation.startGeofencingAsync("SendSMS", locationRegions)

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                  shouldShowAlert: true,
                  shouldPlaySound: true,
                  shouldSetBadge: false,
                }),
              })
        })();
      }, []);
    
    useEffect(() => {
        return (() => {
            // ExpoLocation.stopGeofencingAsync("SendSMS")
            // ExpoLocation.stopLocationUpdatesAsync("LocationTask")
            // TaskManager.unregisterAllTasksAsync()
            // console.log("stopped services")
        })
    }, [])

      
    return (
        <View>
            <MapView style={styles.map} 
                initialRegion={region}
                region={region}
                rotateEnabled={false}
                showsUserLocation={true}
                followsUserLocation={true}
                showsTraffic={true}
                onPress={() => {
                }}
                
                >
                {
                    route.params.trip.Stops.map((stop, index) => {
                        return(
                            <View key={index}>
                            <Marker
                                coordinate={{latitude : stop.Location.Latitude, longitude : stop.Location.Longitude}}
                                pinColor="black"
                            >
                            </Marker>
                            <Circle center={
                                {latitude : stop.Location.Latitude, longitude : stop.Location.Longitude}} 
                                radius={stop.Location.Radius} />
                            </View>
                        )
                    })
                }
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
});