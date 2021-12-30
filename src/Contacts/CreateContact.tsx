import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Center } from '../Center';
import { ContactStackParamList } from '../ParamList';

interface CreateContactProps {
  navigation : NativeStackNavigationProp<ContactStackParamList, "CreateContact">
}

export const CreateContact: React.FC<CreateContactProps> = ({navigation}) => {
    return (
        <Center>
            <Text>Import Friend from Contacts or Add Your Own!</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("ImportContacts") 
            }}>
                <View style={styles.importButton}>
                    <Text>Import from Contacts</Text>
                </View>
            </TouchableWithoutFeedback>
        </Center>
    );
}
const styles = StyleSheet.create({
  importButton : {
    marginBottom: 20,
    backgroundColor: "#a1cdf4",
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 10,
  }
})