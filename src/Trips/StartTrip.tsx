import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { View, Text } from 'react-native';
import { Center } from '../Center';
import { RootStackParamList } from '../ParamList';

interface StartTripProps {
    navigation : NativeStackNavigationProp<RootStackParamList, "StartTrip">
    route : RouteProp<RootStackParamList, "StartTrip">
}

export const StartTrip: React.FC<StartTripProps> = ({navigation, route}) => {
        return (
            <Center>
                <Text>Starting trip! {route.params.trip.Name}</Text>
            </Center>
        );
}