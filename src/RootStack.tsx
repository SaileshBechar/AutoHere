import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { AddLocationMap } from './Locations/AddLocationMap';
import { LocationProvider } from './Locations/LocationProvider';
import { RootStackParamList } from './ParamList';
import { RouteTabs } from './RouteTabs';
import { StartTrip } from './Trips/StartTrip';

interface RootStackProps {
}


const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack: React.FC<RootStackProps> = ({}) => {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="RouteTabs" options={{header : () => null}} component={RouteTabs} />
                    <Stack.Screen name="AddLocation" options={{headerTitle : "Select a location"}} component={AddLocationMap} />
                    <Stack.Screen name="StartTrip" options={{header : () => null}} component={StartTrip} />
                </Stack.Navigator>
            </NavigationContainer>
        );
}