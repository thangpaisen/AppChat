import React,{useEffect, useState} from 'react'
import {StyleSheet, Text, View} from 'react-native';
import Routes from './Routes';
import {Provider} from 'react-redux';
import store from '../redux/store';
import SplashScreen from '../Screens/SplashScreen';
const index = () => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
        setIsLoading(false)
    },2000)
  }, [])
  return (
    <Provider store={store}>
       {isLoading? <SplashScreen/>:<Routes />}
    </Provider>
  );
};

export default index;

const styles = StyleSheet.create({});
