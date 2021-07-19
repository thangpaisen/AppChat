import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import ChatRoom from '../Screens/ChatRoom';
import CreateChatRoom from '../Screens/CreateChatRoom';
import Messages from '../Screens/Messages';
const Stack = createStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChatRoom"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CreateChatRoom" component={CreateChatRoom} />
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
};

export default AppStack;
