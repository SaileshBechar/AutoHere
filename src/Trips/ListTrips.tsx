import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableWithoutFeedback, StyleSheet, FlatList } from 'react-native';
import { TripStackParamList } from '../ParamList';
import { TripContext, Trip } from './TripProvider';

interface ListTripsProps {
    navigation : NativeStackNavigationProp<TripStackParamList, "ListTrips">
}

export const ListTrips: React.FC<ListTripsProps> = ({navigation}) => {
    const {getTrips, saveTrips, inProgTrip} = useContext(TripContext)
    const [tripArray, setTripArray] = useState<Trip[]>([]);
    useEffect(() => {
        saveTrips([])
    }, [])
    useEffect(() => {
        getTrips().then(items => setTripArray(items))
        console.log("rendered", tripArray)
    }, [inProgTrip])
        return (
            <View style={styles.container}>
            <TouchableWithoutFeedback
                onPress={() => {
                    navigation.navigate("CreateTrip") 
                }}
            >
                <View style={styles.tripButton}>
                    <Text style={{fontSize: 20}}>Add Trip</Text>
                </View>
            </TouchableWithoutFeedback>
            {tripArray.length > 0 ? 
            <FlatList
                data={tripArray}
                renderItem={({ item, index, separators }) => (
                    <View style={styles.trip}>
                        <Text>{item.Name}</Text>
                    </View>
                )}
                keyExtractor={(item : Trip) => item.Name}
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
  trip : { 
      backgroundColor: '#a9afd1', 
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginVertical: 10,
      width: 300
  },
  tripButton : {
      marginBottom: 20,
      backgroundColor: "#a1cdf4",
      borderRadius: 50,
      paddingHorizontal: 30,
      paddingVertical: 10,
  }
})