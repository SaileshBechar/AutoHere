import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { AddLocationMap } from './Locations/AddLocationMap';
import { LocationProvider } from './Locations/LocationProvider';
import { RootStackParamList } from './ParamList';
import { RouteTabs } from './RouteTabs';

interface RootStackProps {
}


const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack: React.FC<RootStackProps> = ({}) => {
        return (
            
        <LocationProvider>
             <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="RouteTabs" options={{header : () => null}} component={RouteTabs} />
                    <Stack.Screen name="AddLocation" options={{headerTitle : "Select a location"}} component={AddLocationMap} />
                </Stack.Navigator>
            </NavigationContainer>
        </LocationProvider>
        );
}