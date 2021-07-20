import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Avatar} from 'react-native-elements';
import IMAGE from '../../assets/image/dollars_logo.png';
const RoomItem = ({item}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageRoom}>
        <Avatar
          size={60}
          rounded
          source={{
            uri: item.imageRoom,
          }}
          // source={IMAGE}
          // containerStyle={styles.imageAvatar}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
        <Text style={styles.contentText} numberOfLines={1}>
          <Text style={{color: '#0c7feb'}}>
            {item.latestMessage.name || 'Hệ Thống'}:{' '}
          </Text>
          {item.latestMessage.text.slice(0, 90)}
          {/* {item.latestMessage.createdAt} */}
        </Text>
      </View>
    </View>
  );
};

export default RoomItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  content: {
    flexShrink: 1,
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#000',
  },
  dateText: {},
  contentText: {
    color: '#949494',
    fontSize: 16,
    marginTop: 2,
  },
});
