import React, { useContext, useEffect, useState } from 'react'
import { Button, Text, View } from 'react-native';
import { Center } from '../Center';
import { NativeStackNavigationProp} from '@react-navigation/native-stack';
import { HomeStackParamList } from '../ParamList';
import * as Notifications from 'expo-notifications';

interface HomeProps {
    navigation : NativeStackNavigationProp<HomeStackParamList, "Welcome">
}

export const Welcome: React.FC<HomeProps> = ({navigation}) => {

    useEffect(() => {
       async () => {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);

        //   await Notifications.setNotificationChannelAsync('leaving-now', {
        //     name: 'on-my-way',
        //     sound: 'On My Way.wav', // Provide ONLY the base filename
        //     importance: Notifications.AndroidImportance.DEFAULT,
        //     vibrationPattern : [200, 200]
        //   });
          
        //   await Notifications.scheduleNotificationAsync({
        //     content: {
        //       title: "I'm leaving now!",
        //       sound: 'mySoundFile.wav', // Provide ONLY the base filename
        //     },
        //     trigger: {
        //       seconds: 2,
        //       channelId: 'new-emails',
        //     },
        //   });
       }
    })

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