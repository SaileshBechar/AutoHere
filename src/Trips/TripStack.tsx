import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { TabsParamList, TripStackParamList } from '../ParamList';
import { ListTrips } from './ListTrips';
import { StartTrip } from './StartTrip';

interface SheetProviderProps {
    navigation : NativeStackNavigationProp<TabsParamList, "Trips">
    route : RouteProp<TabsParamList, "Trips">
}

const Stack = createNativeStackNavigator<TripStackParamList>();

export const TripStack: React.FC<SheetProviderProps> = ({navigation, route}) => {
        return (
                <Stack.Navigator>
                    <Stack.Screen name="ListTrips" options={{header : () => null}} component={ListTrips} />
                    <Stack.Screen name="StartTrip" options={{header : () => null}} component={StartTrip} />
                    {/* <Map navigation={navigation} route={route}/> */}
                </Stack.Navigator>
                );
}