import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import { LocationContext, Location } from '../Locations/LocationProvider';
import { TripStackParamList } from '../ParamList';
import { TripContext } from './TripProvider';


interface AddLocationToTripProps {
    navigation : NativeStackNavigationProp<TripStackParamList, "AddLocationToTrip">
}

export const AddLocationToTrip: React.FC<AddLocationToTripProps> = ({navigation}) => {
    const {inProgTrip, setInProgTrip} = useContext(TripContext)
    const {getLocations, saveLocations} = useContext(LocationContext)
    const [locationArray, setLocationArray] = useState<Location[]>([]);

    useEffect(() => {
        getLocations().then(items => setLocationArray(items))
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
            data={locationArray}
            renderItem={({ item, index, separators }) => (
                <TouchableWithoutFeedback
                onPress={() => {
                    const updatedStops = [...inProgTrip.Stops]
                    updatedStops[0] = {...inProgTrip.Stops[0], Location : item}
                    setInProgTrip({Name : inProgTrip.Name, Stops : updatedStops})
                    navigation.goBack()
                }}>
                        <View style={styles.list}>
                            <Text>{item.Name}</Text>
                        </View>
                </TouchableWithoutFeedback>
            )}
            keyExtractor={(item : Location) => item.Name}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        alignItems: "center",
        justifyContent: "center",
        flex:1,
        paddingTop: 50
    },
    list : { 
        backgroundColor: '#a9afd1', 
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginVertical: 10,
        width: 300
    }
})