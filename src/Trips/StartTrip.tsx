import React from 'react'
import { View, Text } from 'react-native';

interface ListTripsProps {

}

export const StartTrip: React.FC<ListTripsProps> = ({}) => {
        return (
            <View>
                <Text>Starting trip! Vroooom</Text>
            </View>
        );
}