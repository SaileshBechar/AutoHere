import React from 'react'
import { ContactProvider } from './Contacts/ContactProvider';
import { RootStack } from './RootStack';

interface ProvidersProps {}

export const Providers: React.FC<ProvidersProps> = ({}) => {
        return (<ContactProvider>
            <RootStack/>
        </ContactProvider>);
}