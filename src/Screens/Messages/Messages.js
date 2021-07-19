import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../redux/actions/user';

const Messages = ({route}) => {
  const {thread} = route.params;
  const user = auth().currentUser.toJSON();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
//   console.log(messages);
  useEffect(() => {
  const unsubscribeListener = firestore()
    .collection('MESSAGE_THREADS')
    .doc(thread._id)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc')
    .onSnapshot(querySnapshot => {
      const messages = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data()
        // console.log(firebaseData);
        const data = {
          _id: doc.id,
          text: '',
          createdAt: new Date().getTime(),
          ...firebaseData
        }

        if (!firebaseData.system) {
          data.user = {
            ...firebaseData.user,
            name: firebaseData.user.displayName
          }
        }

        return data
      })

      setMessages(messages)
    })

  return () => unsubscribeListener()
}, [])
  const  handleSend= async (messages = []) =>{
    const text = messages[0].text;
    firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: user.uid,
          displayName: user.displayName,
        },
      });
    await firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            displayName: user.displayName,
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
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
          <Text
            style={styles.textHeader}
            numberOfLines={1}
            ellipsizeMode="tail">
            {thread.name}
          </Text>
        </View>
        <View style={[styles.back, {backgroundColor: 'transparent'}]}></View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{
          _id: user.uid
        }}
      />
    </View>
  );
};

export default Messages;

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
});
