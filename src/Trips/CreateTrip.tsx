import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { TripStackParamList } from '../ParamList';

interface CreateTripProps {
    navigation : NativeStackNavigationProp<TripStackParamList, "CreateTrip">
}

export const CreateTrip: React.FC<CreateTripProps> = ({}) => {
    return (
            <View style={styles.container}>
                    <Text>Friends</Text>
                    <Text>Locations</Text>
            </View>
    );
}

const styles = StyleSheet.create({
    container : {
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        flex:1,
        paddingTop: 50
    },
})