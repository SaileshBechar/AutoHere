import React from 'react'
import { View, Text } from 'react-native';

interface AddContactProps {

}

export const AddContact: React.FC<AddContactProps> = ({}) => {
        return (
            <View>
                <Text>Import Friend from Contacts or Add Your Own!</Text>
            </View>
        );
}