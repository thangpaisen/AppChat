import React from 'react'
import { StyleSheet, Text, View,Pressable,BackHandler,Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux'
import {checkNameAdmin} from '../../util/checkNameAdmin'
const Header = ({thread,listUserVip}) => {
  const nameUser = useSelector(state => state.user.data.displayName);
  const user = useSelector(state => state.user.data);
  const navigation = useNavigation();
    const createTwoButtonAlert = () =>
      Alert.alert(
        "Cảnh báo",
        "Bạn muốn xóa Room chat này",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => deleteRoomChat() }
        ]
    );
    const deleteRoomChat= ()=>{
        console.log("deleteRoomChat",thread)
        firestore()
          .collection('MESSAGE_THREADS')
          .doc(thread._id)
          .delete()
          .then(() => {
             navigation.navigate('ChatRoom'); 
              Alert.alert("Thông báo",`Room "${thread.name}" đã bị xóa...`)}
              );     
    }
    return (
        <View style={styles.header}>
        <Pressable
          style={styles.back}
          onPress={() => {
            // navigation.navigate('ChatRoom')   
            navigation.goBack(); 
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
          {nameUser==="Admin"?
          <Pressable
          onPress={() => {
            createTwoButtonAlert();
          }}>
          <Icon name="trash" size={24} color="black" />
        </Pressable>
          :<View style={[styles.back, {backgroundColor: 'transparent'}]}></View>}
          
      </View>
    )
}

export default Header

const styles = StyleSheet.create({
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
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
})
