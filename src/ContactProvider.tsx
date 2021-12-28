import React, { useState } from 'react'

export const ContactContext = React.createContext<{
    contacts : { [name: string]: Contact};
    appendContacts: (contactName : string, contact : Contact) => void;
    removeContacts: () => void;
    modifyContact : <K extends keyof Contact>(contactName : string, key : K, value : Contact[K]) => void;
    setContacts : (contacts : { [name: string]: Contact}) => void;
    }>({
        contacts : {},
        appendContacts : () => {},
        removeContacts : () => {},
        modifyContact : () => {},
        setContacts : () => {}
    })

export interface Contact {
    Id : string;
    PhoneNumber : number;
    Longitude : number;
    Latitude : number;
    Radius : number;
}

interface ContactProviderProps {}

export const ContactProvider: React.FC<ContactProviderProps> = ({children}) => {
    const _createDefaultContact = () => { return {
        "InProgress" : {
            Id : "0",
            PhoneNumber : 0,
            Longitude : 0,
            Latitude : 0,
            Radius : 1000,
        }
    }}
    const [contacts, setContacts] = useState<{ [name: string]: Contact}>(_createDefaultContact())

    return (
        <ContactContext.Provider value={{
            contacts, 
            appendContacts : (contactName : string, contact : Contact) => {
                // let contacts = await AsyncStorage.getItem("contacts")
                // { Id : "1", PhoneNumber: 9059231801, Centroid: null, Radius: 0}
                setContacts({...contacts, contactName : contact})
                
                // AsyncStorage.setItem("contacts", JSON.stringify(fakeContact))
            },
            removeContacts : async () => {
                // AsyncStorage.removeItem("contacts")
            },
            modifyContact : <K extends keyof Contact>(contactName : string, key : K, value : Contact[K]) => {
                let contacts_copy = contacts
                contacts_copy![contactName]![key] = value
                setContacts(contacts_copy)
            },
            setContacts,
        }}>{children}</ContactContext.Provider>
    );
}