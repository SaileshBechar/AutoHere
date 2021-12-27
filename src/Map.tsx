import * as React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Circle, Marker } from "react-native-maps"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from './ParamList';
import { ContactSheet } from './ContactSheet';
import { useContext } from 'react';
import { ContactContext } from './ContactProvider';

interface MapProps {
    navigation : NativeStackNavigationProp<ParamList, "Map">
    route : RouteProp<ParamList, "Map">
}

export const Map: React.FC<MapProps> = ({navigation, route}) => {
    const [ region, setRegion ] = React.useState({
		latitude: route.params.coords?.latitude ?? 43.642567,
		longitude: route.params.coords?.longitude ?? -79.387054,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421
	})
    const {contacts, modifyContact} = useContext(ContactContext)
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
                        setRegion({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
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
            onPress={(e) => {
                console.log("before", contacts)
                modifyContact("InProgress", "Latitude", e.nativeEvent.coordinate.latitude)
                modifyContact("InProgress", "Longitude", e.nativeEvent.coordinate.longitude)
                console.log("after", contacts)
            }}
            >
				<Marker
					coordinate={{latitude : contacts['InProgress']!.Latitude, longitude : contacts['InProgress']!.Longitude}}
					pinColor="black"
				>
				</Marker>
				<Circle center={
                    {latitude : contacts['InProgress']!.Latitude, longitude : contacts['InProgress']!.Longitude}} 
                    radius={contacts['InProgress']!.Radius} />
                <Marker
					coordinate={{
                        "latitude" : region.latitude,
                        "longitude" : region.longitude
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
