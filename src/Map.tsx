import * as React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Circle, Marker } from "react-native-maps"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from './ParamList';
import { ContactSheet } from './ContactSheet';
import { useContext, useEffect, useState } from 'react';
import { SheetContext } from './SheetProvider';

interface MapProps {
    navigation : NativeStackNavigationProp<ParamList, "Map">
    route : RouteProp<ParamList, "Map">
}

export const Map: React.FC<MapProps> = ({navigation, route}) => {
    const {inPContact, setInPContact, isSheetOpen, setSheetOpen} = useContext(SheetContext)
    const [ region, setRegion ] = useState({
		latitude: route.params.coords?.latitude ?? 43.642567,
		longitude: route.params.coords?.longitude ?? -79.387054,
		latitudeDelta: 0.0371,
		longitudeDelta: 0.0307
	})
    const [placesMarker, setPlacesMarker] = useState({
        latitude: route.params.coords?.latitude ?? 43.642567,
		longitude: route.params.coords?.longitude ?? -79.387054
    })
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
                        setRegion({ ...region,
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng
                        })
                        setPlacesMarker({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng
                        })
                    }
				}}
				query={{
					key: "AIzaSyC4dKOcRbd0fIj0re6TCvTsJd4GpEEnANk",
					language: "en",
					components: "country:ca",
					radius: 30000,
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
					listView: { backgroundColor: "white" }
				}}
			/>
            <ContactSheet/>
            <MapView style={styles.map} 
            initialRegion={region}
            region={region}
            rotateEnabled={false}
            onPress={(e) => {
                setInPContact({ ...inPContact, 
                    "Latitude" : e.nativeEvent.coordinate.latitude, 
                    "Longitude" : e.nativeEvent.coordinate.longitude})
                setSheetOpen(true)
            }}
            onRegionChangeComplete={(r) => {
                setRegion(r)
            }}
            >
				<Marker
					coordinate={{latitude : inPContact.Latitude, longitude : inPContact.Longitude}}
					pinColor="black"
				>
				</Marker>
				<Circle center={
                    {latitude : inPContact.Latitude, longitude : inPContact.Longitude}} 
                    radius={inPContact.Radius} />
                <Marker
					coordinate={{
                        "latitude" : placesMarker.latitude,
                        "longitude" : placesMarker.longitude
                    }}
				>
				</Marker>
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
