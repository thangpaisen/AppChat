import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import Header from './Header';
import RoomItem from '../ChatRoom/RoomItem';
import {useNavigation} from '@react-navigation/native';
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
const SearchRoom = ({route}) => {
  const navigation = useNavigation();
  const {threads} = route.params;
  const [dataThreads, setDataThreads] = useState(threads);
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
  const handleOnSubmitSearch = text => {
    const dataThreadsNew = [];
    threads.forEach((item, index) => {
      if (item.name.search(text) !== -1) dataThreadsNew.push(item);
    });
    if (text === '') setDataThreads([...threads]);
    setDataThreads(dataThreadsNew);
  };
  return (
    <View style={styles.container}>
      <Header handleOnSubmitSearch={handleOnSubmitSearch} />
      {dataThreads.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No rooms found...</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={dataThreads}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Messages', {thread: item});
              }}>
              <RoomItem item={item} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <View style={{alignSelf: 'center', marginBottom: 5}}>
        <BannerAd
        size={BannerAdSize.BANNER}
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

export default SearchRoom;

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
