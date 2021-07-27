import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import Header from './Header'
import imgLoading from '../../assets/image/loading1.gif';
import NetInfo from "@react-native-community/netinfo";
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'
import NetworkError from '../NetworkError'

const imageRoom =[
  'https://avatarfiles.alphacoders.com/194/thumb-194775.png',
  'https://avatarfiles.alphacoders.com/893/thumb-89303.gif',
  'https://avatarfiles.alphacoders.com/822/thumb-82242.png',
  'https://avatarfiles.alphacoders.com/873/thumb-87367.png',
  'https://avatarfiles.alphacoders.com/967/thumb-96757.png',
  'https://avatarfiles.alphacoders.com/457/thumb-45744.png',
  'https://avatarfiles.alphacoders.com/907/thumb-90762.png',
  'https://avatarfiles.alphacoders.com/108/thumb-108672.gif',
  'https://avatarfiles.alphacoders.com/989/thumb-98988.png',
  'https://avatarfiles.alphacoders.com/872/thumb-87272.png',
  'https://avatarfiles.alphacoders.com/749/thumb-74977.png',
  'https://avatarfiles.alphacoders.com/105/thumb-105876.png',
  'https://avatarfiles.alphacoders.com/997/thumb-99715.gif',
  'https://avatarfiles.alphacoders.com/993/thumb-99313.png',
  'https://avatarfiles.alphacoders.com/729/thumb-72999.png',
  'https://avatarfiles.alphacoders.com/108/thumb-108670.gif',
  'https://avatarfiles.alphacoders.com/843/thumb-84392.png',
  'https://avatarfiles.alphacoders.com/962/thumb-96289.gif',
  'https://avatarfiles.alphacoders.com/108/thumb-108679.gif',
  'https://avatarfiles.alphacoders.com/128/thumb-128135.gif',
]
const  getRandomImg=()=> {
  const randomIndex=  Math.floor(Math.random() * imageRoom.length);
  return imageRoom[randomIndex];
}
export default function CreateChatRoom() {
  const navigation = useNavigation();
  const [roomName, setRoomName] = useState('');
  const [messageErr, setMessageErr] = useState('');
  const [loadingCreateRoom, setLoadingCreateRoom] = useState(false)
  const [netStatus, setNetStatus] = useState(true);
  useEffect(() => {
      NetInfo.addEventListener(state => {
        setNetStatus(state.isConnected);
      });
    });
  const handleButtonPress=() =>{
    if (roomName.trim().length > 5) {
      // create new thread using firebase & firestore
      setLoadingCreateRoom(true)
      try {
        firestore()
        .collection('MESSAGE_THREADS')
        .add({
          name: roomName,
          imageRoom:getRandomImg(),
          typing:false,
          latestMessage: {
            text: `${roomName} created. Welcome!`,
            createdAt: new Date().getTime(),
            name:'Hệ Thống'
          }
        })
        .then(docRef => {
          docRef.collection('MESSAGES').add({
            text: `${roomName} created. Welcome!`,
            createdAt: new Date().getTime(),
            system: true
          })
          console.log('created ok')
          navigation.navigate('ChatRoom')
          setLoadingCreateRoom(false)
          setRoomName('');

        })
      } catch (error) {
          console.log(error);
          setLoadingCreateRoom(false)
      }
    }
    else{
      setMessageErr('Name Room must be at least 6 characters');
    }
  }

  return (
    <View style={styles.container}>
      <Header/>
      {
        !netStatus?<NetworkError/>
      :<View style={styles.main}>
        <TextInput
          editable={loadingCreateRoom?false:true}
          style={styles.textInput}
          placeholder="Nhập tên phòng..."
          onChangeText={roomName => {
            setRoomName(roomName);
            setMessageErr('');
          }}
          value={roomName}
        />
         <Text style={{color: 'red',textAlign:'center',padding:6}}>{messageErr}</Text>
        <TouchableOpacity 
          disabled={loadingCreateRoom?true:false}
          style={styles.button} 
          onPress={handleButtonPress}>
        {!loadingCreateRoom?<Text style={styles.buttonText}>Tạo Phòng chat</Text>
        :<Image source={imgLoading} style={{width:32,height:32,resizeMode:'stretch'}}/>}
        </TouchableOpacity>
      </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: 'white'
  },
  
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 50,
    alignItems: 'stretch',
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 5,
    // marginTop: 10,
  },
  buttonText: {
    padding:5,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#fff',
    fontSize: 18,
    paddingVertical: 10,
    borderColor: '#000',
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft:20,
    // marginBottom: 20,
    // textAlign: 'center',
  },
});
