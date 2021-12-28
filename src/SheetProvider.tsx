import React, { useState } from 'react'
import {Contact} from "./ContactProvider"

const _createDefaultContact = () => { return {
    Id : "0",
    PhoneNumber : 0,
    Longitude : 0,
    Latitude : 0,
    Radius : 1000,
}
}

export const SheetContext = React.createContext<{
    inPContact : Contact;
    setInPContact : (contact : Contact) => void;
    isSheetOpen : boolean;
    setSheetOpen : (value : boolean) => void
    }>({
        inPContact : _createDefaultContact(),
        setInPContact : () => {},
        isSheetOpen : false,
        setSheetOpen : () => {}
    })

interface SheetProviderProps {}

export const SheetProvider: React.FC<SheetProviderProps> = ({children}) => {
    const [inPContact, setInPContact] = useState<Contact>(_createDefaultContact())
    const [isSheetOpen, setSheetOpen ] = useState(false)

    return (
        <SheetContext.Provider value={{
            inPContact,
            setInPContact,
            isSheetOpen,
            setSheetOpen
        }}>{children}</SheetContext.Provider>
    );
}