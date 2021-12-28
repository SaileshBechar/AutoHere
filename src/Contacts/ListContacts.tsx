import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react'
import { Button, View } from 'react-native';
import { RootStackParamList } from '../ParamList';
import { Center } from '../Center';

interface ListContactsProps {
    // navigation : NativeStackNavigationProp<RootStackParamList, "AddLocation">
}

export const ListContacts: React.FC<ListContactsProps> = ({}) => {

    return (
      <Center>
        <Button
        title='Add a Friend'
        onPress={() => {
          // navigation.navigate("AddLocation", {coords : location?.coords}) 
        }}
        />
      </Center>
    );
}