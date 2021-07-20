import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/Screens/LoginScreen';
const Stack = createStackNavigator();
import Providers from './src/navigation';
const App = () => {
  return (
    <Providers />
  );
};

export default App;

const styles = StyleSheet.create({});
