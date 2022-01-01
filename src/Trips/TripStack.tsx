import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { TabsParamList, TripStackParamList } from '../ParamList';
import { AddContactsToTrip } from './AddContactsToTrip';
import { AddLocationToTrip } from './AddLocationToTrip';
import { CreateTrip } from './CreateTrip';
import { ListTrips } from './ListTrips';

interface SheetProviderProps {
    navigation : NativeStackNavigationProp<TabsParamList, "Trips">
    route : RouteProp<TabsParamList, "Trips">
}

const Stack = createNativeStackNavigator<TripStackParamList>();

export const TripStack: React.FC<SheetProviderProps> = ({navigation, route}) => {
        return (
                <Stack.Navigator>
                    <Stack.Screen name="ListTrips" options={{header : () => null}} component={ListTrips} />
                    <Stack.Screen name="CreateTrip" options={{header : () => null}} component={CreateTrip} />
                    <Stack.Screen name="AddContactsToTrip" options={{header : () => null}} component={AddContactsToTrip} />
                    <Stack.Screen name="AddLocationToTrip" options={{header : () => null}} component={AddLocationToTrip} />
                </Stack.Navigator>
                );
}