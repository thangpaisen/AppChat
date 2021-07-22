import React,{useEffect,useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/Screens/LoginScreen';
const Stack = createStackNavigator();
import Providers from './src/navigation';
import { fcmService } from './src/Notification/FCMService';
import { localNotificationService } from './src/Notification/LocalNotificationService';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification"
import {localNotificationSV} from './src/Notification/LocalNotificationSV'

const App = () => {

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('.........................: ', token);
  };

  useEffect(() => {
    getToken();
    localNotificationSV.configure();
    localNotificationSV.createChannel();
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      const data={
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            image: remoteMessage.notification.android.imageUrl,
          }
      localNotificationSV.showNotification(data.title,data.body,data.image);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp: ', JSON.stringify(remoteMessage));
    });

    // khi app đang thoát mà ấn vào thông báo rồi bay vào app 
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            JSON.stringify(remoteMessage),
          );
        }
      });
      messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });


  }, []);
  return (
    <Providers />
  );
};

export default App;

const styles = StyleSheet.create({});
