import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ChatRoom from '../Screens/ChatRoom';
import CreateChatRoom from '../Screens/CreateChatRoom';
import Messages from '../Screens/Messages';
import DrawerContent from '../Screens/DrawerContent';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MenuDrawer"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MenuDrawer" component={MenuDrawer} />
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
};
const MenuDrawer = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="ChatRoom" 
      drawerContent={props =><DrawerContent/>}
      >
      <Drawer.Screen name="ChatRoom" component={ChatRoom} />
      <Drawer.Screen name="CreateChatRoom" component={CreateChatRoom} />
    </Drawer.Navigator>
  );
}
export default AppStack;
