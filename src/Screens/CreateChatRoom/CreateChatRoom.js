import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  TextInput
} from 'react-native';
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
  const [netStatus, setNetStatus] = useState(true);
  useEffect(() => {
      NetInfo.addEventListener(state => {
        setNetStatus(state.isConnected);
      });
    });
  const handleButtonPress=() =>{
    if (roomName.length > 0) {
      // create new thread using firebase & firestore
      firestore()
        .collection('MESSAGE_THREADS')
        .add({
          name: roomName,
          imageRoom:getRandomImg(),
          latestMessage: {
            text: `${roomName} created. Welcome!`,
            createdAt: new Date().getTime()
          }
        })
        .then(docRef => {
          docRef.collection('MESSAGES').add({
            text: `${roomName} created. Welcome!`,
            createdAt: new Date().getTime(),
            system: true
          })
          navigation.navigate('ChatRoom')
        })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.back}
          onPress={() => {
            // dispatch(logoutUser());
            navigation.navigate('ChatRoom');
          }}>
          <Icon name="arrow-back-outline" size={24} color="white" />
        </Pressable>
        <View style={styles.headerTitle}>
          <Text style={styles.textHeader}>
            Tạo phòng chat
          </Text>
        </View>
        <View style={[styles.back, {backgroundColor: 'transparent'}]}></View>
      </View>
      {
        !netStatus?<NetworkError/>
      :<View style={styles.main}>
        <TextInput
          style={styles.textInput}
          placeholder="Thread Name"
          onChangeText={roomName => setRoomName(roomName)}
        />
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Create chat room</Text>
        </TouchableOpacity>
      </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
     container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    // marginBottom: 20,
    backgroundColor: '#09bff2',
  },
  back: {
    width: 32,
    height: 32,
    backgroundColor: 'gray',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    marginLeft: 10,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dee2eb',
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2196F3',
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  textInput: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: '#aaa',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 5,
    width: 225,
  },
});
