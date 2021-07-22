import React, {useState, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Composer,
  Actions
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
import Header from './Header';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../redux/actions/user';

const Messages = ({route}) => {
  const {thread} = route.params;
  const user = auth().currentUser.toJSON();
  const [text, setText] = useState('')
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
    await firestore().collection('MESSAGE_THREADS').doc(thread._id).set(
      {
        typing: false,
      },
      {merge: true},
    );
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
        <View style={{marginRight: 10, marginBottom: 14}}>
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
          color: 'gray'
        }}
      />
    );
  };
  const onInputTextChanged = async value => {
    if (value === '') setIsTyping(false);
    else setIsTyping(true);
    await firestore().collection('MESSAGE_THREADS').doc(thread._id).set(
      {
        typing: isTyping,
      },
      {merge: true},
    );
  };
  const scrollToBottomComponent =(props) => {
    console.log(props)
      return (
        <View style={styles.scrollToBottomContainer}>
             <Icon name="caret-down-outline" size={24} color="black" />
        </View>
  );
  }
  const renderComposer = (props)=>{
      return(
      <Composer
      {...props}
      textInputStyle={styles.composer}
      placeholder='Nhập tin nhắn'
      //  onTextChanged={(text) => setText(text)}
      // text={text}
      // multiline={true} 
      ></Composer>
    )
  }
   const  renderActions=(props) =>{
    return (
      <Actions
        {...props}
        options={{
          // ['Send Image']: handlePickImage,
        }}
        icon={() => (
          <View style={{marginTop:-4}}>
          <Icon name="document-attach-outline" size={24} color="black" />
          </View>
        )}
      />
    )
  }
  return (
    <View style={styles.container}>
      <Header thread={thread}/>
      <GiftedChat
        listViewProps={{
          showsVerticalScrollIndicator: false,
          marginBottom:10,
        }}
        // showUserAvatar={true}
        // renderUsernameOnMessage={true} // hiện thị username ở dưới mỗi ti nhắn (0 cần có tùy chỉnh username ở renderBubble rồi)
        // renderAvatarOnTop={true} // hiển thị avatar đầu tin nhắn mặc đỉnh ở cuối
        onInputTextChanged={onInputTextChanged} // Gọi lại khi văn bản đầu vào thay đổi
        scrollToBottom //hiện cái button cuộn xuống dưới cùng
        scrollToBottomComponent={scrollToBottomComponent} //tinh chỉnh cái scrollToBottom
        renderSend={renderSend} //tùy chỉnh cái nút send
        renderActions={renderActions}  //Nút hành động tùy chỉnh ở bên trái của trình soạn tin nhắn
        // onInputTextChanged={}   //khi InputText thay đổi thì làm j
        isTyping={isTyping} // ...
        renderComposer={renderComposer}   // Trình soạn tin nhắn đầu vào văn bản tùy chỉnh
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
    backgroundColor: 'pink',
  },
  scrollToBottomContainer:{
    // backgroundColor: 'white',
    // elevation:1,
  },
  composer:{
      backgroundColor:'white',
      color:'black',
      fontSize:16,
      // borderRadius:15,
      // borderColor:'#C0CCDA',
      // borderWidth:1,
      marginTop:4,
        marginBottom:4,
      // paddingLeft: 10,
    },
});
