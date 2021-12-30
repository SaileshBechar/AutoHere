import React, { useContext, useEffect, useState } from 'react'
import * as Contacts from 'expo-contacts';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Contact, ContactContext } from './ContactProvider';
import { Center } from '../Center';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ContactStackParamList } from '../ParamList';

interface ImportContactsProps {
    navigation : NativeStackNavigationProp<ContactStackParamList, "ImportContacts">
}

export const ImportContacts: React.FC<ImportContactsProps> = ({navigation}) => {
    const {contacts, setContacts} = useContext(ContactContext)
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
              for (let i = 0; i < 10; i++) {
                  const numPhoneNumbers = data[i].phoneNumbers?.length ?? 0
                  for (let j = 0; j < numPhoneNumbers; j++) {
                        const phoneNumberObject = ensure<Contacts.PhoneNumber[]>(data[i].phoneNumbers)[j]
                        const phoneNumberString = ensure<string>(phoneNumberObject.number)

                        const tempContact : Contact = {
                            Id : data[i].id + phoneNumberObject.id,
                            Name : data[i].name + " " + phoneNumberString,
                            PhoneNumber : phoneNumberString
                        }
                        setImportedContacts([...importedContacts, tempContact])

                  }
              }
            }
          }
        })();
    }, []);

    const renderContacts = (item : Contact) => {
        return(
            <TouchableWithoutFeedback
            onPress={() => {
                setContacts([...contacts, item])
                navigation.navigate("ListContacts")
            }}>
                <View style={styles.contact}>
                    <Text>{item.Name}</Text>
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