import React from 'react';
import {StyleSheet, Text, View, Image,Dimensions} from 'react-native';
import imgNetworkError from '../assets/image/networkError.png';
export default function NetworkError() {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>No internet connection</Text>
      <Image style={styles.image3} source={imgNetworkError} />
    </View>
  );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
      flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    padding:10,
    // textTransform: 'uppercase'
  },
  image3: {
    width: 180,
    height: 180,
    // backgroundColor: 'blue',
    resizeMode: 'contain',
  },
});