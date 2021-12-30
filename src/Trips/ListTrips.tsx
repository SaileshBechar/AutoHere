import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { TripStackParamList } from '../ParamList';

interface ListTripsProps {
    navigation : NativeStackNavigationProp<TripStackParamList, "ListTrips">
}

export const ListTrips: React.FC<ListTripsProps> = ({navigation}) => {
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
            {/* {locationArray.length > 0 ? 
            <FlatList
                data={locationArray}
                renderItem={({ item, index, separators }) => (
                    <View style={styles.location}>
                        <Text>{item.Name}</Text>
                    </View>
                )}
                keyExtractor={(item : Location) => item.Name}
            /> : null} */}
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