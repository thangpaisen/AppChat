import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack'
import AppStack from './AppStack'
import {useDispatch,useSelector} from 'react-redux'
import {setUser} from '../redux/actions/user'


const Routes = () => {
    const dispatch = useDispatch()
    const [initializing, setInitializing] = useState(true)
    const dataUser = useSelector(state => state.user.data)
  // //   // console.log('dataUser',dataUser);
  // Handle user state changes
  const  onAuthStateChanged=(result)=> {
    // setUser(result)
    console.log('route')
    console.log(result)
    dispatch(setUser(result))
    if (initializing) setInitializing(false)
  }
  useEffect(() => {
    // console.log('');
    //  auth().onAuthStateChanged(onAuthStateChanged)
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged)
    // unsubscribe on unmount
    return authSubscriber
  }, [])

  if (initializing) {
    return null
  }

  return (
    <NavigationContainer>
      {dataUser? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
