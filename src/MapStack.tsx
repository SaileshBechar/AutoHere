import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { Map } from "./Map"
import { ParamList } from './ParamList';
import { SheetProvider } from './SheetProvider';

interface SheetProviderProps {
    navigation : NativeStackNavigationProp<ParamList, "Map">
    route : RouteProp<ParamList, "Map">
}

export const MapStack: React.FC<SheetProviderProps> = ({navigation, route}) => {
        return (<SheetProvider>
            <Map navigation={navigation} route={route}/>
        </SheetProvider>);
}