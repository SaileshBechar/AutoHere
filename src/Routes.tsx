import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { Center } from './Center';
import { ParamList } from './ParamList';
import { Home } from './Home';
import { Map } from './Map';

interface RoutesProps {}

const Stack = createNativeStackNavigator<ParamList>();

export const Routes: React.FC<RoutesProps> = ({}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{header : () => null}} component={Home} />
        <Stack.Screen name="Map"  options={{headerTitle : "Select a location"}} component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

