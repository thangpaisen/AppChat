import React, {useState, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Composer,
  Actions,
} from 'react-native-gifted-chat';
import * as Types from '../../../code';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  BackHandler,
  Image,
  Dimensions 
} from 'react-native';
// import Lightbox from 'react-native-lightbox';
import Lightbox from 'react-native-lightbox-v2';
import Header from './Header';
import NetworkError from '../NetworkError';

import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../redux/actions/user';

const Messages = ({route}) => {
  const {thread} = route.params;
  const user = auth().currentUser.toJSON();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [netStatus, setNetStatus] = useState(true);
  useEffect(() => {
    const unsubscribe= NetInfo.addEventListener(state => {
      setNetStatus(state.isConnected);
    });
    return () =>unsubscribe();
  });
  const backAction = () => {
    console.log('out');
    firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text: `${user.displayName} đã rời khỏi nhóm!!!`,
        system: true,
        createdAt: new Date().getTime(),
      });
    firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text: `${user.displayName} đã rời khỏi nhóm!!!`,
            createdAt: new Date().getTime(),
            name: 'Hệ Thống',
          },
        },
        {merge: true},
      );
  };
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
        setIsTyping(querySnapshot.data().typing);
      });
    return () => {
      unsubscribeListener();
      unsubscribeListener2();
      // backAction();
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
            image: '',
            sizeImage:{},
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
  const handleSendImage = async (uri,height,width) => {
    firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        image: uri,
        sizeImage:{
          width, 
          height
        },
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
            image: uri,
            sizeImage:{
              width, 
              height
            },
            text: '',
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
    if (props.currentMessage.user._id === user.uid) {
      return <Bubble {...props} />;
    }
    if (props.previousMessage.user) {
      if (props.currentMessage.user._id === props.previousMessage.user._id) {
        return <Bubble {...props} />;
      }
    }
    return (
      <View>
        {props.currentMessage.user.name === Types.NAME_ADMIN ? (
          <Text style={{fontSize: 12, color: 'red', left: 5}}>
            {props.currentMessage.user.name}
          </Text>
        ) : (
          <Text style={{fontSize: 12, color: '#999', left: 5}}>
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
        <View style={{marginRight: 10, marginBottom: 10}}>
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
          color: 'gray',
        }}
      />
    );
  };
  const onInputTextChanged = async value => {
    let typingTmp;
    if (value === '') typingTmp = false;
    else typingTmp = true;
    await firestore().collection('MESSAGE_THREADS').doc(thread._id).set(
      {
        typing: typingTmp,
      },
      {merge: true},
    );
    setIsTyping(typingTmp);
  };
  const scrollToBottomComponent = props => {
    return (
      <View style={styles.scrollToBottomContainer}>
        <Icon name="caret-down-outline" size={24} color="black" />
      </View>
    );
  };
  const renderComposer = props => {
    return (
      <Composer
        {...props}
        textInputStyle={styles.composer}
        placeholder="Nhập tin nhắn..."
        //  onTextChanged={(text) => setText(text)}
        // text={text}
        // multiline={true}
      ></Composer>
    );
  };
  const openLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        if (!response.didCancel) {
          const {uri,fileName,height,width} = response.assets[0];
          upLoadedImageToFirebase(uri,fileName,height,width);
        } else console.log('exit ');
      },
    );
  };
  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        if (!response.didCancel) {
          const {uri,fileName,height,width} = response.assets[0];
          upLoadedImageToFirebase(uri,fileName,height,width);
        } else console.log('exit ');
      },
    );
  };
  const renderActions = props => {
    return (
      <Actions
        {...props}
        options={{
          ['Camera']: () => openCamera(),
          ['Library']: () => openLibrary(),
        }}
        // onSend={args => console.log('args')}
        icon={() => (
          <View style={{marginTop: -2}}>
            <Icon name="image-outline" size={24} color="black" />
          </View>
        )}
      />
    );
  };

  const upLoadedImageToFirebase = async (uri, fileName,height,width) => {
    const reference = storage().ref(fileName);
    await reference.putFile(uri);
    const url = await storage().ref(fileName).getDownloadURL();
    // console.log(url);
    handleSendImage(url,height,width);
  };
  const renderMessageImage = props => {
    let {height, width} = props.currentMessage.sizeImage;
    return(
      <View 
        style={{backgroundColor:'transparent'}}
        >
          <Lightbox
            activeProps={{
              style: {flex: 1,resizeMode: 'contain'},
            }}
            >
              <Image
                style={[{resizeMode:'stretch',width:windowWidth/2,height:windowWidth/2 /(width/height),borderRadius:10}]}
                source={{ uri: props.currentMessage.image }}
              />
            </Lightbox>
        </View>
    )
  };
 
  return (
    <View style={styles.container}>
      <Header thread={thread} />
      {!netStatus ? (
        <NetworkError />
      ) : (
        <GiftedChat
          listViewProps={{
            showsVerticalScrollIndicator: false,
            marginBottom: 10,
          }}
          // showUserAvatar={true}
          // renderUsernameOnMessage={true} // hiện thị username ở dưới mỗi ti nhắn (0 cần có tùy chỉnh username ở renderBubble rồi)
          // renderAvatarOnTop={true} // hiển thị avatar đầu tin nhắn mặc đỉnh ở cuối
          onInputTextChanged={onInputTextChanged} // Gọi lại khi văn bản đầu vào thay đổi
          scrollToBottom //hiện cái button cuộn xuống dưới cùng
          scrollToBottomComponent={scrollToBottomComponent} //tinh chỉnh cái scrollToBottom
          renderSend={renderSend} //tùy chỉnh cái nút send
          renderActions={renderActions} //Nút hành động tùy chỉnh ở bên trái của trình soạn tin nhắn
          // onInputTextChanged={}   //khi InputText thay đổi thì làm j
          isTyping={isTyping} // ...
          renderComposer={renderComposer} // Trình soạn tin nhắn đầu vào văn bản tùy chỉnh
          renderSystemMessage={renderSystemMessage} //Thông báo hệ thống tùy chỉnh
          renderMessageImage={renderMessageImage} //Hình ảnh tin nhắn tùy chỉnh
          alwaysShowSend //Luôn hiển thị nút gửi trong trình soạn văn bản đầu vào
          messages={messages}
          onSend={handleSend}
          renderBubble={renderBubble}
          user={{
            _id: user.uid,
          }}
        />
      )}
    </View>
  );
};

export default Messages;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
  scrollToBottomContainer: {
    // backgroundColor: 'white',
    // elevation:1,
  },
  composer: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 16,
    // borderRadius:15,
    // borderColor:'#C0CCDA',
    // borderWidth:1,
    marginTop: 2,
    marginBottom: 2,
    // paddingLeft: 10,
  },
});
