import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/Screens/HomeScreen';
import LoginScreen from './src/Screens/LoginScreen';
const Stack = createStackNavigator();
import Providers from './src/navigation';
const App = () => {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator
    //     initialRouteName="HomeScreen"
    //     screenOptions={{
    //       headerShown: false,
    //     }}>  
    //     <Stack.Screen name="HomeScreen" component={HomeScreen} />
    //     <Stack.Screen name="LoginScreen" component={LoginScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <Providers />
  );
};

export default App;

const styles = StyleSheet.create({});
