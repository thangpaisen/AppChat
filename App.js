import React,{useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/Screens/LoginScreen';
const Stack = createStackNavigator();
import Providers from './src/navigation';
import { fcmService } from './src/Notification/FCMService';
import { localNotificationService } from './src/Notification/LocalNotificationService';
const App = () => {
  useEffect(()=>{
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification)
  },[])


  const onRegister = (token) => {
    console.log("[App] Token", token);
  }

  const onNotification = (notify) => {
    // console.log("[App] onNotification", notify);
    const options = {
      soundName: 'default',
      playSound: true,
    }

    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify,
      options,
    )
  }

  const onOpenNotification = async (notify) => {
  
    console.log('notify', notify);
  }



  return (
    <Providers />
  );
};

export default App;

const styles = StyleSheet.create({});
