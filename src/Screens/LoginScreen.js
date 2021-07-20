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
import auth from '@react-native-firebase/auth';
import loading2 from '../assets/image/loading2.gif'
import {useDispatch,useSelector} from 'react-redux'
import {loginUser,updateProfileUser} from '../redux/actions/user'

const LoginScreen = () => {
  const navigation = useNavigation();
  const [text, onChangeText] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(state => state.user.loading)
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
        disabled={loading?true:false}
        style={styles.buttonLogin}
        onPress={()=>{
            if(text.trim()!=='')
            {
                dispatch(loginUser(text));
            }
                
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
