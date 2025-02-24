import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConversationList from '../../../tab-screens/ConversationList';
import Inbox from '../screen/Inbox';

const Stack = createNativeStackNavigator();

const MessagingStack = () => {
  return (
    <Stack.Navigator
   
    >
      <Stack.Screen options={{headerShown: true}} name="Conversation" component={ConversationList} />
      {/* <Stack.Screen options={{headerShown: false}} name="inbox" component={Inbox} /> */}
    </Stack.Navigator>
  );
};

export default MessagingStack;

