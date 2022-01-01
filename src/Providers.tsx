import React from 'react'
import { ContactProvider } from './Contacts/ContactProvider';
import { LocationProvider } from './Locations/LocationProvider';
import { RootStack } from './RootStack';
import { TripProvider } from './Trips/TripProvider';

interface ProvidersProps {}

export const Providers: React.FC<ProvidersProps> = ({}) => {
        return (
            <TripProvider>
                <LocationProvider>
                    <ContactProvider>
                        <RootStack/>
                    </ContactProvider>
                </LocationProvider>
            </TripProvider>
        );
}