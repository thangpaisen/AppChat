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
  StatusBar
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import logoImage from '../assets/image/logo.jpg';
import auth from '@react-native-firebase/auth';
import loading2 from '../assets/image/loading2.gif'
import {useDispatch,useSelector} from 'react-redux'
import {loginUser,updateProfileUser} from '../redux/actions/user'

const LoginScreen = () => {
  const navigation = useNavigation();
  const [text, onChangeText] = useState('');
  const [messageErr, setMessageErr] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(state => state.user.loading)
  return (
    <View style={styles.container}>
      <StatusBar 
            backgroundColor="black"
            barStyle="light-content"
            translucent={true} 
            // hidden={true}
          />
      <Image style={styles.logoImage} source={logoImage} />
      <View style={styles.formInput}>
        <Text style={{fontSize: 16, color: 'white', paddingHorizontal: 10}}>
          PASSWORD:
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={text=>{
              onChangeText(text);
              setMessageErr('');
          }}
          value={text}
        />
         <Text style={{color: 'red',position: 'absolute',bottom:10,left:0,right:0,textAlign:'center'}}>{messageErr}</Text>
      </View>
      
      <TouchableOpacity
        disabled={loading?true:false}
        style={styles.buttonLogin}
        onPress={()=>{
            if(text.trim().length>4 &&text.trim().length<31)
            {
                dispatch(loginUser(text));
            }
            else if(text.trim().length>30)
              setMessageErr('Password at most 30 characters');
            else
              setMessageErr('Password must be at least 5 characters')        
        }}
        >
        {
        !loading?<Text style={{fontSize: 16, color: 'white',textAlign:'center'}}>ENTER</Text>
        :<Image source={loading2} style={styles.imgBtnLoading}/>
        }
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
    paddingVertical: 40,
    // marginVertical:40,
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
      justifyContent:'center',
      alignItems:'center',
      width:WIDTH_IMAGE,
      height:40,
      padding:8,
      borderWidth:2,
      borderColor:'white',
      borderRadius:10,
  },
  imgBtnLoading:{
      width:32,
      height: 32,
      resizeMode:'stretch'
  }
});
