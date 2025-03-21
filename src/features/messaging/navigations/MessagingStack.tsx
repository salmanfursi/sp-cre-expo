import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConversationList from '../../../tab-screens/ConversationList';
import Inbox from '../screen/Inbox';
import Profile from '../screen/Profile';

const Stack = createNativeStackNavigator();

const MessagingStack = () => {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,  // Ensure header is visible
     }}
    >
      <Stack.Screen name="Conversation" component={ConversationList} />
      <Stack.Screen name="inbox" component={Inbox} />
      <Stack.Screen name="profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default MessagingStack;


