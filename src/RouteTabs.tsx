import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabsParamList } from './ParamList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStack } from './Home/HomeStack';
import { ContactStack } from './Contacts/ContactStack';
import { TripStack } from './Trips/TripStack';
import { LocationStack } from './Locations/LocationStack';

interface RoutesProps {}

const Tabs = createBottomTabNavigator<TabsParamList>();

export const RouteTabs: React.FC<RoutesProps> = ({}) => {
  return (
    <Tabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = "";
        color = focused ? "#a9afd1" : "#ebebeb"

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Contacts") {
          iconName = focused ? "contacts"  : "contacts-outline";
        } else if (route.name === "Locations") {
          iconName = focused ? "map-marker" : "map-marker-outline"
        } else if (route.name === "Trips") {
          iconName = "map-marker-distance";
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={size} color={color} />;
      },
        header: () => null
    })}
  >
    <Tabs.Screen name="Home" component={HomeStack} />
    <Tabs.Screen name="Contacts" component={ContactStack} />
    <Tabs.Screen name="Locations" component={LocationStack} />
    <Tabs.Screen name="Trips" component={TripStack} />
  </Tabs.Navigator>
  );
}

