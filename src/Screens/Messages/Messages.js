import React, {useState, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import * as Types from '../../../code';
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
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    const unsubscribeListener = firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.name,
            };
          }
          return data;
        });

        setMessages(messages);
      });
      const unsubscribeListener2 = firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .onSnapshot(querySnapshot => {
        console.log(querySnapshot.data().typing);
        setIsTyping(querySnapshot.data().typing);
        });

    return () => {
      unsubscribeListener();
      unsubscribeListener2();
    };
  }, []);
  const handleSend = async (messages = []) => {
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
          name: user.displayName,
        },
      });
    await firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            name: user.displayName,
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
    await firestore()
        .collection('MESSAGE_THREADS')
        .doc(thread._id)
        .set(
          {
            typing: false,
          },
          {merge: true},
        )
  };
  const renderBubble = props => {
    if (typeof props.previousMessage.user !== 'undefined') {
      if (
        props.currentMessage.user._id === props.previousMessage.user._id ||
        props.currentMessage.user._id === user.uid
      ) {
        return <Bubble {...props} />;
      }
    }
    return (
      <View>
        {props.currentMessage.user.name === Types.NAME_ADMIN ? (
          <Text style={{fontSize: 12, color: 'red', left: 10}}>
            {props.currentMessage.user.name}
          </Text>
        ) : (
          <Text style={{fontSize: 12, color: '#999', left: 10}}>
            {props.currentMessage.user.name}
          </Text>
        )}
        <Bubble {...props} />
      </View>
    );
  };
  const renderSend = props => {
    return (
      <Send {...props}>
        <View style={{marginRight: 10, marginBottom: 8}}>
          <Icon name="send" size={24} color="#09bff2" />
        </View>
      </Send>
    );
  };
  const renderSystemMessage = props => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  };
  const onInputTextChanged = async (value) => {
    if (value === '')
      setIsTyping(false);
    else
       setIsTyping(true);
    await firestore()
        .collection('MESSAGE_THREADS')
        .doc(thread._id)
        .set(
          {
            typing: isTyping,
          },
          {merge: true},
        )


  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.back}
          onPress={() => {
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
        // infiniteScroll={true}
        // loadEarlier={true}
        // showUserAvatar={true}
        // renderUsernameOnMessage={true}
        // renderAvatarOnTop={true}
        onInputTextChanged={onInputTextChanged} // Gọi lại khi văn bản đầu vào thay đổi
        scrollToBottom //hiện cái button cuộn xuống dưới cùng
        // scrollToBottomComponent
        renderSend={renderSend} //tùy chỉnh cái nút send
        // onInputTextChanged={}   //khi InputText thay đổi thì làm j
        isTyping={isTyping} // ...
        renderSystemMessage={renderSystemMessage} //Thông báo hệ thống tùy chỉnh
        messages={messages}
        onSend={handleSend}
        renderBubble={renderBubble}
        user={{
          _id: user.uid,
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
