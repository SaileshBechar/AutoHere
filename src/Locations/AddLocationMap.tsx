import * as React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Circle, LatLng, Marker, Callout, Region, Polyline as MapViewPolyline, MapMarker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../ParamList';
import { LocationSheet } from './LocationSheet';
import { useContext, useRef, useState } from 'react';
import { LocationContext, Location } from './LocationProvider';
import Polyline from '@mapbox/polyline';

interface MapProps {
    navigation : NativeStackNavigationProp<RootStackParamList, "AddLocation">
    route : RouteProp<RootStackParamList, "AddLocation">
}

export const AddLocationMap: React.FC<MapProps> = ({navigation, route}) => {
    const {inProgLocation, setInProgLocation, setSheetOpen} = useContext(LocationContext)
    const [ region, setRegion ] = useState<Region>({
		latitude: route.params.coords?.latitude ?? 43.642567,
		longitude: route.params.coords?.longitude ?? -79.387054,
		latitudeDelta: 0.0371,
		longitudeDelta: 0.0307
	})
    const [userLocation, setUserLocation] = useState<LatLng>({
        latitude: route.params.coords?.latitude ?? 43.642567,
        longitude: route.params.coords?.longitude ?? -79.387054
    })
    const [isCalculateDirections, setIsCalculateDirections] = useState<boolean>(false)
    const [directions, setDirections] = useState<{
        coords: Array<LatLng>,
        eta: number}
    >({coords: [], eta: 0})
    const markerRef = useRef<MapMarker>(null)
    
    const getDirections = async (startLoc : string, destinationLoc : string) => {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyABBscLtJvxlo8pAMXJ9oe3uap4TfGRz8I`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point : number[], index : number) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            
            const duration = respJson.routes[0].legs.reduce((carry : number, curr : any) => {
                return carry + (curr.duration_in_traffic ? curr.duration_in_traffic.value : curr.duration.value);
            }, 0) / 60
            console.log("ETA:", Math.round(duration), " mins")
            setDirections({coords : coords, eta: Math.round(duration)})

        } catch(error) {
            alert(error)
            return error
        }
    }

    return (
        <View>
            <GooglePlacesAutocomplete
				placeholder="Search"
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
                    if (details) {
                        setRegion((prevRegion : Region) => ({ 
                            ...prevRegion,
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng
                        }))
                        setInProgLocation(({ 
                            ...inProgLocation, 
                            "Latitude" : details.geometry.location.lat, 
                            "Longitude" : details.geometry.location.lng,
                        }))
                        setSheetOpen(true)
                        setIsCalculateDirections(true)
                        getDirections(`${userLocation.latitude}, ${userLocation.longitude}`,`${details.geometry.location.lat}, ${details.geometry.location.lng}`)
                        // markerRef.current?.showCallout()
                    }
				}}
				query={{
					key: 'AIzaSyB5OFOryVllEEk_FXbTpd_MY-dcAlB1dlI',
					language: "en",
					components: "country:ca",
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { position: "absolute", top:5, width: "100%", zIndex: 1,},
					listView: { backgroundColor: "white", marginTop: 0},
                    textInput: {height:50, display: 'flex', justifyContent:"center", alignItems:"center", width: "80%", zIndex: 1, borderRadius: 100},
                    textInputContainer: {display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: Dimensions.get('window').width - 20, left: 10}
				}}
			/>
            <LocationSheet navigation={navigation}/>
            <MapView style={styles.map} 
            // initialRegion={region}
            region={region}
            rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsTraffic={true}
            onPress={(e) => {
                setInProgLocation({ ...inProgLocation, 
                    "Latitude" : e.nativeEvent.coordinate.latitude, 
                    "Longitude" : e.nativeEvent.coordinate.longitude})
                setSheetOpen(true)
                setIsCalculateDirections(true)
                getDirections(`${userLocation.latitude}, ${userLocation.longitude}`,`${e.nativeEvent.coordinate.latitude}, ${e.nativeEvent.coordinate.longitude}`)
                // markerRef.current?.showCallout()
            }}
            onUserLocationChange={(e) => {
                setUserLocation({
                    latitude: e.nativeEvent.coordinate?.latitude || region.latitude,
                    longitude: e.nativeEvent.coordinate?.longitude || region.longitude
                })
            }}
            onRegionChangeComplete={(r) => {
                setRegion(r)
            }}>
				<Marker
					coordinate={{latitude : inProgLocation.Latitude, longitude : inProgLocation.Longitude}}
					pinColor="#0A5999"
                    calloutOffset={{x: -5, y: 0}}
                    calloutAnchor={{x: 0.5, y: -.1}}
                    ref={markerRef}
				>
                    <Callout tooltip>
                        <View style={styles.callout}>
                            <Text>{directions.eta} mins</Text>
                        </View>
                    </Callout>
                    {/* <View style={styles.callout}> */}
                        {/* <Text>{directions.eta} mins</Text> */}
                    {/* </View> */}
				</Marker>
				<Circle center={
                    {latitude : inProgLocation.Latitude, longitude : inProgLocation.Longitude}} 
                    radius={inProgLocation.Radius} 
                />
                {isCalculateDirections && directions.eta > 0 && 
                     <MapViewPolyline 
                     coordinates={directions.coords}
                     strokeWidth={3}
                     strokeColor="#0A5999"/>
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
  callout: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: 90, 
    height: 30, 
    borderRadius: 20, 
    backgroundColor: "#f5f5f4"
  },
});
