import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import MapView, { Circle, LatLng, Marker, Region, Polyline as MapViewPolyline } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../ParamList';
import { LocationSheet } from './LocationSheet';
import { useContext, useRef, useState } from 'react';
import { LocationContext, Location } from './LocationProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getDirections} from '../Task'

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
    const [selection, setSelection] = useState({start: 0, end: 0})
    const autoCompleteRef = useRef<any>(null)

    return (
        <View>
            <GooglePlacesAutocomplete
				placeholder="Search"
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
                ref={autoCompleteRef}
				onPress={async (data, details = null) => {
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
                        setDirections(await getDirections(`${userLocation.latitude}, ${userLocation.longitude}`,`${details.geometry.location.lat}, ${details.geometry.location.lng}`))
                        setSelection({start: 0, end: 0})
                    }
				}}
                renderRightButton = {() => {
                    return(
                         <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => { autoCompleteRef.current?.clear()}} >
                                    <Icon name="close-circle-outline" size={25} color={'grey'}/>
                        </TouchableOpacity>
                    )
                }}
                textInputProps={{clearButtonMode: 'never', selection:selection, onSelectionChange: (syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    const { selection } = nativeEvent;
                    setSelection(selection);
                }}}
				query={{
					language: "en",
					components: "country:ca",
                    location: `${region.latitude},${region.longitude}`,
                    radius: 100000
				}}
                GooglePlacesDetailsQuery={{
                    fields: 'address_component,adr_address,formatted_address,geometry,name'
                }}
                requestUrl={{
                    url: 'https://us-central1-autoheredatabase.cloudfunctions.net/api/getPlaces',
                    useOnPlatform: 'all'
                }}
				styles={{
					container: { position: "absolute", top:5, width: "100%", zIndex: 1},
                    row: {width: Dimensions.get('window').width},
					listView: { backgroundColor: "white", marginTop: 0, borderRadius: 100},
                    textInput: {paddingLeft: 20, paddingRight: 50, height:50, zIndex: 1, borderRadius: 100, marginRight: -25},
                    textInputContainer: {display: 'flex', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width}
				}}
			/>
            <LocationSheet navigation={navigation}/>
            <MapView style={styles.map} 
            // initialRegion={region}
            region={region}
            rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsTraffic={false}
            onPress={async (e) => {
                setInProgLocation({ ...inProgLocation, 
                    "Latitude" : e.nativeEvent.coordinate.latitude, 
                    "Longitude" : e.nativeEvent.coordinate.longitude})
                setSheetOpen(true)
                setIsCalculateDirections(true)
                setDirections(await getDirections(`${userLocation.latitude}, ${userLocation.longitude}`,`${e.nativeEvent.coordinate.latitude}, ${e.nativeEvent.coordinate.longitude}`))
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
					pinColor="#52ABF4">                   
				</Marker>
                <Marker
					coordinate={{latitude : inProgLocation.Latitude, longitude : inProgLocation.Longitude}}
                    centerOffset={{x : 0, y: -0.1}}
                    anchor={{x: 0.5, y:2.6}}
				>
                    <View style={styles.callout}>
                        <Text>{directions.eta} mins</Text>
                    </View>
                </Marker>
				<Circle center={
                    {latitude : inProgLocation.Latitude, longitude : inProgLocation.Longitude}} 
                    radius={inProgLocation.Radius} 
                />
                {isCalculateDirections && directions.eta > 0 && 
                     <MapViewPolyline 
                     coordinates={directions.coords}
                     strokeWidth={5}
                     strokeColor="#52ABF4"/>
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
    backgroundColor: "#f5f5f4",
  },
  clearButton : {
    position: 'relative',
    top: -2,
    right: 22,
    zIndex: 2
  }
});
