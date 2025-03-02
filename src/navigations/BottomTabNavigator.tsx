 

import React from 'react';
 import Icon from 'react-native-vector-icons/MaterialIcons';
 
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessagingStack from '../features/messaging/navigations/MessagingStack';
import CallsScreen from '../tab-screens/CallsScreen';
import Meeting from '../tab-screens/Meeting';



const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
       <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconName;

            if (route.name === 'Chat') {
              iconName = 'home';
            } else if (route.name === 'Calls') {
              iconName = 'person' ;
            } else if (route.name === 'meeting') {
              iconName = 'event' ;
            }
            return<Text className={`${focused ? "text-blue-400" : "text-gray-500"}`}><Icon name={iconName} size={size || 24} /></Text>
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
           headerShown:false,
          tabBarLabel: ({ focused }) => (
            <Text className={`${focused ? 'text-blue-400' : 'text-gray-500'} text-xs`}>
              {route.name}
            </Text>
          ),
        })}
      >
       <Tab.Screen name="Chat" component={MessagingStack} />
       <Tab.Screen name="Calls" component={CallsScreen} />
       <Tab.Screen name="meeting" component={Meeting} />
      </Tab.Navigator>
   );
};

export default BottomTabNavigator;
