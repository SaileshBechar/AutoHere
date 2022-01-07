import React, { useContext, useEffect, useState } from 'react'
import * as Contacts from 'expo-contacts';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Contact, ContactContext } from './ContactProvider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ContactStackParamList } from '../ParamList';

interface ImportContactsProps {
    navigation : NativeStackNavigationProp<ContactStackParamList, "ImportContacts">
}

export const ImportContacts: React.FC<ImportContactsProps> = ({navigation}) => {
    const {getContacts, saveContacts, contactArray, setContactArray} = useContext(ContactContext)
    const [importedContacts, setImportedContacts] = useState<Contact[]>([])
    

    function ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
        if (argument === undefined || argument === null) {
          throw new TypeError(message);
        }
      
        return argument;
    }
    useEffect(() => {
        (async () => {
          const { status } = await Contacts.requestPermissionsAsync();
          if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
              fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
            });
    
            if (data.length > 0) {
                const tempContactArray : Contact[] = []
                for (let i = 0; i < data.length; i++) {
                    const numPhoneNumbers = data[i].phoneNumbers?.length ?? 0
                    for (let j = 0; j < numPhoneNumbers; j++) {
                        const phoneNumberObject = ensure<Contacts.PhoneNumber[]>(data[i].phoneNumbers)[j]
                        const phoneNumberString = ensure<string>(phoneNumberObject.number)

                        tempContactArray.push({
                            Id : data[i].id + phoneNumberObject.id,
                            Name : data[i].name,
                            Label: phoneNumberObject.label,
                            PhoneNumber : phoneNumberString
                        })
                        
                    }
                }
              setImportedContacts([...importedContacts, ...tempContactArray])
            }
          }
        })();
        getContacts().then(items => setContactArray(items))
    }, []);

    const renderContacts = (item : Contact) => {
        return(
            <TouchableWithoutFeedback
            onPress={() => {
                saveContacts([...contactArray, item])
                navigation.navigate("ListContacts")
            }}>
                <View style={styles.contact}>
                    <Text>{item.Name}</Text>
                    <Text>{item.Label} {item.PhoneNumber}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    return (
        <View style={styles.container}>
            {importedContacts.length > 0 ? 
            <FlatList
                data={importedContacts}
                renderItem={({ item, index, separators }) => renderContacts(item)}
                keyExtractor={(item : Contact) => item.Id}
        /> : (
            <View>
                <Text>You have no contacts 🤷🏾‍♂️</Text>
            </View>
        )}
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
    contact : { 
        backgroundColor: '#a9afd1', 
        height: 100,
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