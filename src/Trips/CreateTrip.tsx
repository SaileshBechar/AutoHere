import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, FlatList, TextInput } from 'react-native';
import { Contact, ContactContext } from '../Contacts/ContactProvider';
import { LocationContext, Location, _createDefaultLocation} from '../Locations/LocationProvider';
import { TripStackParamList } from '../ParamList';
import { Trip, TripContext } from './TripProvider';

interface CreateTripProps {
    navigation : NativeStackNavigationProp<TripStackParamList, "CreateTrip">
}

export const CreateTrip: React.FC<CreateTripProps> = ({navigation}) => {
    const {inProgTrip, setInProgTrip, tripArray, setTripArray, getTrips, saveTrips} = useContext(TripContext)
    
    const [tripName, setTripName] = useState<string>("")

    useEffect(() => {
        getTrips().then(items => {
            // console.log("CT init", items)
            setTripArray(items)
        })
    }, [])

    useEffect(() => {
        console.log("InProgTrip", inProgTrip)
    }, [inProgTrip])

    return (
            <View style={styles.container}>
                <View style={styles.tripContainer}>
                { inProgTrip.Stops[0].Contacts.length > 0 ? (
                    <View style={{}}>
                         {
                            Object.entries(inProgTrip.Stops[0].Contacts).map(([key, val]) =>   
                                <TouchableWithoutFeedback
                                    onPress={() => navigation.navigate("AddContactsToTrip")}>
                                    <View style={styles.addButton}>
                                        <Text key={val.Id}>{val.Name}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        }
                    </View>
                ) : (
                    <TouchableWithoutFeedback
                        onPress={() => navigation.navigate("AddContactsToTrip")}>
                        <View style={styles.addButton}>
                            <Text>Add from your Friends</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )}
                    <View>
                        <TextInput
                        style={styles.input}
                        onChangeText={setTripName}
                        value={tripName}
                        placeholder="Enter a Trip Name"
                        maxLength={20}
                        />
                    </View>
                { inProgTrip.Stops[0].Location.Name !== "" ? (
                    <View style={{}}> 
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate("AddLocationToTrip")}>
                            <View style={styles.addButton}>
                                <Text>{inProgTrip.Stops[0].Location.Name}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                ) : (
                    <TouchableWithoutFeedback
                        onPress={() => navigation.navigate("AddLocationToTrip")}>
                        <View style={styles.addButton}>
                            <Text>Add from your Locations</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )}
                </View>
                {
                    tripName.length > 1 ? (
                        <TouchableWithoutFeedback
                                onPress={() => {
                                setTripArray([...tripArray, {Name : tripName, Stops : inProgTrip.Stops}])
                                saveTrips([...tripArray, {Name : tripName, Stops : inProgTrip.Stops}])
                                setInProgTrip({Name: "", Stops : [{Contacts: [], Location: _createDefaultLocation()}]})
                                navigation.navigate("ListTrips")
                                }}
                            >
                            <View style={styles.saveButton}>
                                <Text style={{fontSize: 20}}>SAVE</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    ) : null
                }
                
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
    tripContainer : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
    list : { 
        backgroundColor: '#a9afd1', 
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginVertical: 10,
        width: 300
    },
    input: {
        height: 40,
        // width: 100,
        flex : 1,
        marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    addButton : {
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        backgroundColor: "#EBEBEB",
    },
    saveButton : {
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 100,
        backgroundColor: "#A9AFD1",
        marginTop: 10,
        marginBottom: 30,
        fontSize: 30
      },
})