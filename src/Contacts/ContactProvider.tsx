import React, { useState } from 'react'

export const ContactContext = React.createContext<{
    contacts : Contact[];
    setContacts : (contacts : Contact[]) => void;
    }>({
        contacts : [],
        setContacts : () => {}
    })

export interface Contact {
    Id : string;
    Name : string;
    PhoneNumber : string;
}

interface ContactProviderProps {}

export const ContactProvider: React.FC<ContactProviderProps> = ({children}) => {
    const [contacts, setContacts] = useState<Contact[]>([])

    return (
        <ContactContext.Provider value={{
            contacts, 
            setContacts,
        }}>{children}</ContactContext.Provider>
    );
}