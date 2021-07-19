import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import logoImage from '../assets/image/dollars_logo.png';
const LoginScreen = () => {
  const navigation = useNavigation();
  const [text, onChangeText] = useState('');
  return (
    <View style={styles.container}>
      <Image style={styles.logoImage} source={logoImage} />
      <View style={styles.formInput}>
        <Text style={{fontSize: 16, color: 'white', paddingHorizontal: 10}}>
          PASSWORD:
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
      </View>
      <TouchableOpacity 
        style={styles.buttonLogin}
        onPress={()=>{
            if(text.trim()!=='')
                navigation.navigate('HomeScreen')
        }}
        >
        <Text style={{fontSize: 16, color: 'white',textAlign:'center'}}>ENTER</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const WIDTH_IMAGE = windowWidth / 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logoImage: {
    width: WIDTH_IMAGE,
    height: WIDTH_IMAGE,
    resizeMode: 'stretch',
  },
  formInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginVertical:20,
  },
  input: {
    backgroundColor: 'white',
    width: WIDTH_IMAGE,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  buttonLogin:{
      width:WIDTH_IMAGE,
      padding:8,
      borderWidth:2,
      borderColor:'white',
      borderRadius:10,
  },
});
