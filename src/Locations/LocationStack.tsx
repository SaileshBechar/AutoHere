import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, useWindowDimensions, Dimensions } from 'react-native';
import * as ExpoLocation from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../ParamList';
import { LocationContext, Location } from './LocationProvider';

interface LocationStackProps {
    navigation : NativeStackNavigationProp<RootStackParamList, "AddLocation">
}


export const LocationStack: React.FC<LocationStackProps> = ({navigation}) => {
    const {getLocations, locationArray, setLocationArray, saveLocations} = useContext(LocationContext)

    const [location, setLocation] = useState<ExpoLocation.LocationObject>();
    const [errorMsg, setErrorMsg] = useState("");
    
    useEffect(() => {
        (async () => {
          let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          // TODO add loading screen
          let location = await ExpoLocation.getCurrentPositionAsync({});
          setLocation(location);
        })();
    }, []);
    
    useEffect(() => {
        getLocations().then(items => setLocationArray(items))
    }, [])

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback
                onPress={() => {
                    console.log(location?.coords)
                    navigation.navigate("AddLocation", {coords : location?.coords}) 
                }}
            >
                <View style={styles.locationButton}>
                    <Text style={{fontSize: 20}}>Add Location</Text>
                </View>
            </TouchableWithoutFeedback>
            {locationArray.length > 0 ? 
            <FlatList
                data={locationArray}
                renderItem={({ item, index, separators }) => (
                    <View style={styles.location}>
                        <Text>{item.Name}</Text>
                    </View>
                )}
                keyExtractor={(item : Location) => item.Name}
            /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
  container : {
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
      flex:1,
      paddingTop: 50
  },
  location : { 
      backgroundColor: '#a9afd1', 
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginVertical: 10,
      width: 300
  },
  locationButton : {
      marginBottom: 20,
      backgroundColor: "#a1cdf4",
      borderRadius: 50,
      paddingHorizontal: 30,
      paddingVertical: 10,
  }
})