import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { TabsParamList, TripStackParamList } from '../ParamList';
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
                    {/* <Map navigation={navigation} route={route}/> */}
                </Stack.Navigator>
                );
}