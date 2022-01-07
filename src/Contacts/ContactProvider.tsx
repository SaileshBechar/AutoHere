import React, { createContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ContactContext = createContext<{
    contactArray : Contact[];
    setContactArray : (contacts : Contact[]) => void;
    getContacts : () => Promise<Contact[]>;
    saveContacts : (contacts : Contact[]) => Promise<void>;
    }>({
        contactArray : [],
        setContactArray : () => {},
        getContacts : async () => [],
        saveContacts : async () => {}
    })

export interface Contact {
    Id : string;
    Name : string;
    Label : string
    PhoneNumber : string;
}

interface ContactProviderProps {}

export const ContactProvider: React.FC<ContactProviderProps> = ({children}) => {
    const [contactArray, setContactArray] = useState<Contact[]>([])

    return (
        <ContactContext.Provider value={{
            contactArray,
            setContactArray,
            getContacts : async () => {
                try {
                    const jsonContacts = await AsyncStorage.getItem('Contacts')
                    return jsonContacts !== null ? JSON.parse(jsonContacts) as Contact[] : [];
                  } catch(e) {
                    // error reading value
                    console.log("Error reading contacts")
                    return []
                  }
            }, 
            saveContacts : async (contacts : Contact[]) => {
                try {
                    const jsonContacts = JSON.stringify(contacts)
                    await AsyncStorage.setItem('Contacts', jsonContacts)
                } catch(e) {
                    console.log("Error saving contacts")
                }
            },
        }}>{children}</ContactContext.Provider>
    );
}