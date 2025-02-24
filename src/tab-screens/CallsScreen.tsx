
import React from 'react';
  import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calling from '../features/contact/screen/Calling';
import HistoryScreen from '../features/contact/screen/HistoryScreen';
import AudioScreen from '../features/contact/screen/AudioScreen';
const Tab = createMaterialTopTabNavigator();


const CallsScreen = () => {
  return (
      <Tab.Navigator>
       <Tab.Screen name="calling" component={Calling} />
       <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Audio" component={AudioScreen} />
    </Tab.Navigator>
   );
};
export default CallsScreen;

