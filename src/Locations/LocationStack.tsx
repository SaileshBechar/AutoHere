import React, { useEffect, useState } from 'react'
import { Center } from '../Center';
import { View, Button, Text } from 'react-native';
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../ParamList';

interface LocationStackProps {
    navigation : NativeStackNavigationProp<RootStackParamList, "AddLocation">
}

export const LocationStack: React.FC<LocationStackProps> = ({navigation}) => {
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
                <View>
                    <Text>Locations you've saved:</Text>
                    <Button
                        title='Add a Location'
                        onPress={() => {
                            navigation.navigate("AddLocation", {coords : location?.coords}) 
                        }}
                    />
                </View>
            </Center>
        );
}