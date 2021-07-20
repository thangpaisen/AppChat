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
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../redux/actions/user';
const Header = () => {
      const navigation = useNavigation();
  const dispatch = useDispatch();
    return (
        <View style={styles.header}>
        <Pressable
          onPress={() => {
           navigation.openDrawer();
          }}>
          <Icon name="menu-outline" size={28} color="white" />
        </Pressable>
        <View style={styles.headerTitle}>
          <Text style={styles.textHeader}>
            ChatRoom
          </Text>
        </View>
        <Pressable
          onPress={() => {
            dispatch(logoutUser());
          }}>
          <Icon name="log-out-outline" size={24} color="white" />
        </Pressable>
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
  textHeader: {
    marginLeft: 10,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
})
