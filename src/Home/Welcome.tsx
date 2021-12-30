import React, { useContext, useEffect, useState } from 'react'
import { Button, Text, View } from 'react-native';
import { Center } from '../Center';
import { ContactContext } from '../Contacts/ContactProvider';
import { NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { HomeStackParamList } from '../ParamList';

interface HomeProps {
    navigation : NativeStackNavigationProp<HomeStackParamList, "Welcome">
}

export const Welcome: React.FC<HomeProps> = ({navigation}) => {
      
    return (
        <Center>

            <Text>Welcome Sailesh :)</Text>
            {/* {contacts.size > 0 ? (
                <Button
                title='Remove a Friend'
                onPress={() => {
                    navigation.navigate("Map")
                }}
                />
                ) : 
                null
            } */}
        
        </Center>
    );
}