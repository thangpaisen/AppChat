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
const ChatRoom = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [netStatus, setNetStatus] = useState(true);
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
        if (loading) {
          setLoading(false)
        }
      })

    return () => unsubscribe()
  }, [])
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
          <TouchableOpacity onPress={() => navigation.navigate('Messages',{ thread: item })}>
            <RoomItem item={item}/>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() =>  <View style={styles.separator} />}
      />
      }
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
