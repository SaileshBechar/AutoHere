import * as React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Circle, LatLng, Marker, Region } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../ParamList';
import { LocationSheet } from './LocationSheet';
import { useContext, useState } from 'react';
import { LocationContext } from './LocationProvider';
import MapViewDirections from 'react-native-maps-directions';

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
                    // console.log("Details", data, details)
                    if (details) {
                        setRegion({ ...region,
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng
                        })
                        setInProgLocation({ ...inProgLocation, 
                            "Latitude" : details.geometry.location.lat, 
                            "Longitude" :details.geometry.location.lng,
                        })
                        setSheetOpen(true)
                        setIsCalculateDirections(true)
                    }
				}}
				query={{
					key: 'AIzaSyB5OFOryVllEEk_FXbTpd_MY-dcAlB1dlI',
					language: "en",
					components: "country:ca",
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "100%", zIndex: 1},
					listView: { backgroundColor: "white", marginTop: -50},
                    textInput: {height:50},
				}}
			/>
            <LocationSheet navigation={navigation}/>
            <MapView style={styles.map} 
            // initialRegion={region}
            region={region}
            rotateEnabled={false}
            showsUserLocation={true}
            onPress={(e) => {
                setInProgLocation({ ...inProgLocation, 
                    "Latitude" : e.nativeEvent.coordinate.latitude, 
                    "Longitude" : e.nativeEvent.coordinate.longitude})
                setSheetOpen(true)
                setIsCalculateDirections(true)
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
				>
				</Marker>
				<Circle center={
                    {latitude : inProgLocation.Latitude, longitude : inProgLocation.Longitude}} 
                    radius={inProgLocation.Radius} />
                {isCalculateDirections &&
                    <MapViewDirections
                        origin={{latitude : userLocation.latitude, longitude : userLocation.longitude}}
                        destination={{latitude : inProgLocation.Latitude, longitude : inProgLocation.Longitude}}
                        apikey={"AIzaSyABBscLtJvxlo8pAMXJ9oe3uap4TfGRz8I"}
                        resetOnChange={false}
                        strokeWidth={3}
                        strokeColor={"#f0c756"}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={(result) => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                        }}
                        onError={(error) => {
                            console.log('Error', error);
                        }}
                    />
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
