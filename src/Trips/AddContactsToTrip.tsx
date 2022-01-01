import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import { Contact, ContactContext } from "../Contacts/ContactProvider"
import { TripStackParamList } from '../ParamList';
import { TripContext } from './TripProvider';

interface AddContactToTripProps {
    navigation : NativeStackNavigationProp<TripStackParamList, "AddContactsToTrip">
}

export const AddContactsToTrip: React.FC<AddContactToTripProps> = ({navigation}) => {
    const {inProgTrip, setInProgTrip} = useContext(TripContext)
    const {getContacts, saveContacts} = useContext(ContactContext)
    const [contactsArray, setContactsArray] = useState<Contact[]>([])

    useEffect(() => {
        getContacts().then((items) => setContactsArray(items))
    }, [ saveContacts])

    return (
        <View style={styles.container}>
            <FlatList
            data={contactsArray}
            renderItem={({ item, index, separators }) => (
                <TouchableWithoutFeedback
                onPress={() => {
                    const updatedStops = [...inProgTrip.Stops]
                    updatedStops[0] = {...inProgTrip.Stops[0], Contacts : [item]}
                    setInProgTrip({Name : inProgTrip.Name, Stops : updatedStops})
                    navigation.goBack()
                }}>
                        <View style={styles.list}>
                            <Text>{item.Name}</Text>
                        </View>
                </TouchableWithoutFeedback>
            )}
            keyExtractor={(item : Contact) => item.Name}/>
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