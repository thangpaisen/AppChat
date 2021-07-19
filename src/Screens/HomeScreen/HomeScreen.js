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
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../redux/actions/user';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);
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
            fafasfasfs
          </Text>
        </View>
        <View style={[styles.back, {backgroundColor: 'transparent'}]}></View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

export default HomeScreen;

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
