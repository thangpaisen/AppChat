import React, {useState, useCallback, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import Loading from '../Loading';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../redux/actions/user';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Header from './Header';
import RoomItem from './RoomItem';
import NetworkError from '../NetworkError';
import {localNotificationSV} from '../../Notification/LocalNotificationSV';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import admob, {
  MaxAdContentRating,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  BannerAd,
  TestIds,
  BannerAdSize,
  AdMobRewarded,
} from '@react-native-firebase/admob';
const ChatRoom = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [threads, setThreads] = useState([]);
  const [netStatus, setNetStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const user = auth().currentUser.toJSON();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    admob()
      .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: true,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // Request config successfully set!
      });
  }, []);
  useEffect(() => {
    NetInfo.addEventListener(state => {
      setNetStatus(state.isConnected);
    });
  });
  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('MESSAGE_THREADS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: {text: ''},
            ...documentSnapshot.data(),
          };
        });
        setThreads(threads);
        setLoading(false);
        setRefreshing(false);
      });

    return () => {
      unsubscribe();
    };
  }, [refreshing]);
  const handleOnPressItem = item => {
    navigation.navigate('Messages', {thread: item});
  };
  return (
    <View style={styles.container}>
      <Header threads={threads} />
      {!netStatus ? (
        <NetworkError />
      ) : loading ? (
        <Loading />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          data={threads}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                handleOnPressItem(item);
              }}>
              <RoomItem item={item} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      {/* <View style={{alignSelf: 'center', marginBottom: 10}}>
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        onAdLoaded={() => {
      console.log('Advert loaded1');}}
      onAdFailedToLoad={(error) => {
      console.error('Advert failed to load: ', error);}}
        />
      </View> */}
      <View style={{alignSelf: 'center', marginBottom: 5}}>
        <BannerAd
        size={BannerAdSize.SMART_BANNER}
        // size={BannerAdSize.SMART_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        unitId={'ca-app-pub-8063561239793967/1759138065'}
        onAdLoaded={() => {
      console.log('Advert loaded3');}}
      onAdFailedToLoad={(error) => {
      console.error('Advert failed to load: ', error);}}
      />
      </View>
      
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
    marginHorizontal: 10,
  },
});
