import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { AddContact } from './AddContact';
import { ListContacts } from './ListContacts';
import { ContactStackParamList, TabsParamList } from '../ParamList';

interface SheetProviderProps {
    navigation : NativeStackNavigationProp<TabsParamList, "Contacts">
    route : RouteProp<TabsParamList, "Contacts">
}

const Stack = createNativeStackNavigator<ContactStackParamList>();

export const ContactStack: React.FC<SheetProviderProps> = ({}) => {
        return (
            <Stack.Navigator>
                <Stack.Screen name="ListContacts" options={{header : () => null}} component={ListContacts} />
                <Stack.Screen name="AddContact" options={{header : () => null}} component={AddContact} />
                {/* <Stack.Screen name="AddLocation" options={{headerTitle : "Select a location"}} component={AddLocationMap} /> */}
                {/* <Map navigation={navigation} route={route}/> */}
            </Stack.Navigator>
            );
}