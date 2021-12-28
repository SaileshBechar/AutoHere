import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { Welcome } from './Welcome';
import { HomeStackParamList, TabsParamList } from '../ParamList';
import { StartTrip } from '../Trips/StartTrip';

interface HomeStackProps {
    // navigation : NativeStackNavigationProp<TabsParamList, "Home">
    // route : RouteProp<TabsParamList, "Home">
}


const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC<HomeStackProps> = ({}) => {
        return (
                // <TripProvider>
                <Stack.Navigator>
                    <Stack.Screen name="Welcome" options={{header : () => null}} component={Welcome} />
                    <Stack.Screen name="StartTrip" options={{header : () => null}} component={StartTrip} />
                </Stack.Navigator>
                // {/* </TripProvider>); */}
        );
}