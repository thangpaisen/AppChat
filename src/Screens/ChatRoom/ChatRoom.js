import React, {useState, useCallback, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  FlatList
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../redux/actions/user';
import firestore from '@react-native-firebase/firestore'
import Header from './Header'
import RoomItem from './RoomItem'
import NetworkError from '../NetworkError'
import {localNotificationSV} from '../../Notification/LocalNotificationSV'
import ImagePicker from 'react-native-image-crop-picker';
const ChatRoom = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [threads, setThreads] = useState([])
  const [netStatus, setNetStatus] = useState(true);
  const user = auth().currentUser.toJSON();
  useEffect(() => {
      NetInfo.addEventListener(state => {
        setNetStatus(state.isConnected);
      });
    });
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('MESSAGE_THREADS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: { text: '' },
            ...documentSnapshot.data()
          }
        })
        setThreads(threads);
      })

    return () => {
      unsubscribe();
    }
  }, [])
  const handleOnPressITem =(item) => {
   firestore()
      .collection('MESSAGE_THREADS')
      .doc(item._id)
      .collection('MESSAGES')
      .add(
        {
           text:`${user.displayName} đã vào nhóm!!!`,
           system: true,
          createdAt: new Date().getTime(),
        },
      );
    firestore()
      .collection('MESSAGE_THREADS')
      .doc(item._id)
      .set(
        {
          latestMessage: {
            text:`${user.displayName} đã vào nhóm!!!`,
            createdAt: new Date().getTime(),
            name:'Hệ Thống'
          },
        },
        {merge: true},
      );
    navigation.navigate('Messages',{ thread: item })
  }


const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: false,
      compressImageQuality: 0.7
    }).then(image => {
      console.log(image);
    });
    ImagePicker.clean().then(() => {
  console.log('removed all tmp images from tmp directory');
}).catch(e => {
  alert(e);
});
  }
const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: false,
      compressImageQuality: 0.7
    }).then(image => {
      console.log(image);
    });
    ImagePicker.clean().then(() => {
  console.log('removed all tmp images from tmp directory');
}).catch(e => {
  alert(e);
});
  }

  return (
    <View style={styles.container}>
      <Header/>
      {
      !netStatus?<NetworkError/>
      :<FlatList
        showsVerticalScrollIndicator={false}
        data={threads}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOnPressITem(item)}>
            <RoomItem item={item}/>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() =>  <View style={styles.separator} />}
      />
      }
      <TouchableOpacity
      styles={{padding:20,backgroundColor:'blue'}}
      onPress={() =>{
          console.log('Press');
          choosePhotoFromLibrary();
      }}
      >
      <Text>onClick</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    backgroundColor: '#555',
    height: 0.5,
    flex: 1,
    marginHorizontal:10,
  }

});
