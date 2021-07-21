import React from 'react';
import {Avatar} from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';
import * as Types from '../../../code'
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import imageBackgroundUser from '../../assets/image/dollars_logo.png';
import imageBackgroundUser2 from '../../assets/image/image2.png';
import {useNavigation} from '@react-navigation/native';
import {useDispatch,useSelector} from 'react-redux';
import {logoutUser} from '../../redux/actions/user';
const DrawerContent = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const name = useSelector(state => state.user.data.displayName)
//   console.log(name);
  return (
    <View style={styles.container}>
      <DrawerContentScrollView contentContainerStyle={{paddingTop: 0}}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Avatar
              rounded
              source={{
                uri: 'https://avatarfiles.alphacoders.com/893/thumb-89303.gif',
              }}
              size={90}
            />
              <Text style={styles.title}> {name}</Text>
              <Text style={{fontSize: 16, color: 'gray'}}>
                Chức vụ: Thủ lĩnh🦾
              </Text>
          </View>
          <View style={styles.drawerSection}>
            <DrawerItem
            // focused={true}
            // activeTintColor={'red'}
              style={{borderTopColor: '#f4f4f4', borderTopWidth: 1}}
              icon={({color, size}) => (
                <Icon name="chatbox-outline" color={color} size={size} />
              )}
              label={({focused, color}) => (
                <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
                  Phòng chat
                </Text>
              )}
              onPress={() => {
                navigation.navigate('ChatRoom');
              }}
            />
            {
              name===Types.NAME_ADMIN
            &&<DrawerItem
              style={{borderTopColor: '#f4f4f4', borderTopWidth: 1}}

              icon={({color, size}) => (
                <Icon name="add-circle-outline" color={color} size={size} />
              )}
              label={({focused, color}) => (
                <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
                  Tạo phòng chat
                </Text>
              )}
              onPress={() => {
                navigation.navigate('CreateChatRoom');
              }}
            />
            }
            <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-outline" color={color} size={size} />
          )}
          label={({focused, color}) => (
            <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
              Đăng xuất
            </Text>
          )}
          onPress={() =>  dispatch(logoutUser())}
        />
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
            <DrawerItem
          icon={({color, size}) => (
            <Icon name="help-circle-outline" color={color} size={size} />
          )}
          label={({focused, color}) => (
            <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
              Help and Feedback
            </Text>
          )}
        />
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-outline" color={color} size={size} />
          )}
          label={({focused, color}) => (
            <Text style={{color: '#555', fontSize: 16, fontWeight: 'bold'}}>
              Share
            </Text>
          )}
        />
      </View>
    </View>
  );
};

export default DrawerContent;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    // flexDirection: 'row',
    padding: 20,
    // backgroundColor: 'red',
    //   justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackgroundUser: {
    width: width,
    height: width * 0.4,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  drawerSection: {
    // marginTop: 15,
    // backgroundColor: 'red'
  },
  bottomDrawerSection: {
    marginTop: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});
