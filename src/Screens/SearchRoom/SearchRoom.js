import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,FlatList, } from 'react-native'
import Header from './Header'
import RoomItem from '../ChatRoom/RoomItem';
import {useNavigation} from '@react-navigation/native';

const SearchRoom = ({route}) => {
  const navigation = useNavigation();
    const {threads}= route.params;
    const [dataThreads, setDataThreads] = useState([]);
    useEffect(() => {

    },[]);
    // console.log("threads",threads);
    const handleOnSubmitSearch = (text) =>
        {
    console.log("1",text);

            const dataThreadsNew=[];
            threads.forEach((item,index) =>{
                if(item.name.search(text)!==-1)
                    dataThreadsNew.push(item);
            } )
            if(text==='')
                setDataThreads([...dataThreads]);
            setDataThreads(dataThreadsNew);
        }
    return (
        <View style={styles.container}>
            <Header
                handleOnSubmitSearch={handleOnSubmitSearch}
             />
            {dataThreads.length ===0?
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>Không tìm thấy phòng nào...</Text>
            </View>
        :<FlatList
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
        />}
        </View>
    )
}

export default SearchRoom

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    separator: {
    backgroundColor: '#555',
    height: 0.5,
    flex: 1,
    marginHorizontal: 10,
  },
})
