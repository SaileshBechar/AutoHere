import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { CreateContact } from './CreateContact';
import { ListContacts } from './ListContacts';
import { ContactStackParamList, TabsParamList } from '../ParamList';
import { ImportContacts } from './ImportContacts';

interface SheetProviderProps {
    navigation : NativeStackNavigationProp<TabsParamList, "Contacts">
    route : RouteProp<TabsParamList, "Contacts">
}

const Stack = createNativeStackNavigator<ContactStackParamList>();

export const ContactStack: React.FC<SheetProviderProps> = ({}) => {
        return (
            <Stack.Navigator>
                <Stack.Screen name="ListContacts" options={{header : () => null}} component={ListContacts} />
                <Stack.Screen name="CreateContact" options={{header : () => null}} component={CreateContact} />
                <Stack.Screen name="ImportContacts" options={{header : () => null}} component={ImportContacts} />
            </Stack.Navigator>
            );
}