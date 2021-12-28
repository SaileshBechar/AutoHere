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
    const {contacts, appendContacts, removeContacts} = useContext(ContactContext)

    const [location, setLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        })();
      }, []);
      
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