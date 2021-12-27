import React, { useContext, useEffect, useState } from 'react'
import { Button, Text } from 'react-native';
import { Center } from './Center';
import { ContactContext } from './ContactProvider';
import { NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { ParamList } from './ParamList';

interface HomeProps {
    navigation : NativeStackNavigationProp<ParamList, "Home">
}

export const Home: React.FC<HomeProps> = ({navigation}) => {
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
            <Text>I am the Home Screen</Text>
            <Button
                title='Add a Friend'
                onPress={() => {
                navigation.navigate("Map", {coords : location?.coords}) // TODO: add current location as parameter
                }}
            />
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