import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({handleOnSubmitSearch}) => {
  const navigation = useNavigation();
  const [roomName, setRoomName] = useState('');
  return (
    <View style={styles.headerContainer}>
      <View style={styles.containerSearch}>
        <Pressable
          onPress={() => {
            navigation.navigate('ChatRoom');
          }}>
          <Icon name="search-outline" size={24} color="black" />
        </Pressable>
        <TextInput
          style={styles.textInputSearch}
          placeholder="Nhập tên phòng tìm kiếm..."
          onChangeText={text => {
            setRoomName(text);
            handleOnSubmitSearch(text);
            // console.log("text",text);
          }}
        //   onSubmitEditing={() =>{
        //                 if(roomName!=='')
        //                 {
        //                     handleOnSubmitSearch(roomName);
        //                 }
        //             }}

        value={roomName}
        />
      </View>
      <Pressable
        onPress={() => {
          navigation.navigate('ChatRoom');
          setRoomName('');
          handleOnSubmitSearch('');
        }}>
        <Text style={styles.cancel}>Cancel</Text>
      </Pressable>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#09bff2',
    padding: 10,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  containerSearch:{
      flex:1,
      paddingHorizontal:5,
      backgroundColor:'white',
      flexDirection: 'row',
      alignItems: 'center',
        borderRadius: 10,

  },
  textInputSearch: {
    flex: 1,
    marginLeft:5,
    paddingVertical: 5,
        borderRadius: 10,

    backgroundColor: 'white',
  },
  cancel:{
      paddingLeft:10,
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold'
  }
});
