import React,{ useEffect, useState } from 'react'
import { StyleSheet, Text, View,Image,StatusBar } from 'react-native'
import Logo2 from '../assets/image/dollars_logo.png'

import * as Animatable from 'react-native-animatable';
// import {useIsFocused} from '@react-navigation/native';

// function FocusAwareStatusBar(props) {
//   const isFocused = useIsFocused();
//   return isFocused ? <StatusBar {...props} /> : null;
// }
export default function SplashScreen() {

    return (
        <View style={styles.container}>
            <StatusBar 
            backgroundColor="black"
            barStyle="light-content"
            translucent={true} 
            // hidden={true}
          />
            <Animatable.Image
            animation="bounceIn"
            iterationCount={9999} 
            // direction="alternate"
                style={styles.logo}
                source={Logo2}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'black'
    },
    logo:{
        width:150,
        height:150,
        resizeMode: 'contain'
    },
})