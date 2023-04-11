import _ from "lodash";
import React, { Key, useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import tw from "@/lib/tailwind";
import { loadCancelledBooking } from "@/store/cancelledBooking";
import CustomActivityIndicator from "@/components/CustomActivityIndicator";
import BookingDetailsDropDetailsCard from "@/components/BookingDetailsDropDetailsCard";
import ScrollScreen from "@/components/ScrollScreen";


interface HistoryScreenProps { }

const HistoryScreen: React.FC<HistoryScreenProps> = (props) => {
  const { allCancelledBooking, loading } = useAppSelector((state) => ({
    allCancelledBooking: state.entities.cancelledBooking.allCancelledBooking,
    loading: state.entities.cancelledBooking.loading,
  }));
  const { storeDetail } = useAppSelector(
    (state: any) => ({
      storeDetail: state.entities.searchBikes.storeDetail,
    })
  );
  const keyExtractor = (item) => `${item._id}`;
  // const [offset, setOffset] = useState(1); //Its Like Page number
  // const [messages, setMessages] = useState<[]>([]); //Contains the whole data
  // const [dataSource, setDataSource] = useState<[]>([]); //Contains limited number of data
  // const windowSize = messages.length > 50 ? messages.length / 4 : 21;
  // const num = 100 // This is the number which defines how many data will be loaded for every 'onReachEnd'
  // const initialLoadNumber = 10 // This is the number which defines how many data will be loaded on first open
  // useEffect(() => { //Initially , we set our data.

  //   setMessages(allCancelledBooking);

  // }, [])
  // useEffect(() => { //Here we setting our data source on first open.

  //   if (dataSource.length < messages.length) {
  //     if (offset == 1) {
  //       setDataSource(messages.slice(0, offset * initialLoadNumber))
  //     }
  //   }

  // }, [messages]);
  // const getData = () => { // When scrolling we set data source with more data.
  //   if (dataSource.length < messages.length && messages.length != 0) {
  //     setOffset(offset + 1);
  //     setDataSource(messages.slice(0, offset * num)) //We changed dataSource.
  //   }
  // };
  const renderItem = useCallback(({ item }) => {
    return (
      <BookingDetailsDropDetailsCard
        key={item._id}
        item={item}
        mobileNumber={_.get(item, "_webuserId.profile.mobileNumber")}
        userName={_.get(item, "_webuserId.profile.name")}
        email={_.get(item, "_webuserId.email")}
        // startDate={item.startDate as string}
        // endDate={item.endDate as string}
        bookingType={item.bookingType}
        boonggBookingId={item.boonggBookingId}
        buttonsVisible={true}
      />
    )
  }, [allCancelledBooking])
  console.log(allCancelledBooking.length)
  return (
    <SafeAreaView style={[tw`bg-white`, { flex: 1 }]}>
      <CustomActivityIndicator visible={loading} />
      {/* <FlatList
        data={allCancelledBooking}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // windowSize={windowSize}
        // onEndReachedThreshold={offset < 10 ? (offset * (offset == 1 ? 2 : 2)) : 20} //While you scolling the offset number and your data number will increases.So endReached will be triggered earlier because our data will be too many
        // initialNumToRender={initialLoadNumber}
        // maxToRenderPerBatch={num}
        // updateCellsBatchingPeriod={num / 2}
        // onEndReached={getData}
        // removeClippedSubviews={true}
      /> */}
      {allCancelledBooking.map((item: { [key: string]: object | any }) => (
        <BookingDetailsDropDetailsCard
          key={item._id}
          item={item}
          mobileNumber={_.get(item, "_webuserId.profile.mobileNumber")}
          userName={_.get(item, "_webuserId.profile.name")}
          email={_.get(item, "_webuserId.email")}
          startDate={item.startDate as string}
          endDate={item.endDate as string}
          bookingType={item.bookingType}
          boonggBookingId={item.boonggBookingId}
          buttonsVisible={true}
        />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default HistoryScreen;

// working 


import _ from "lodash";
import React, { Key, useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import tw from "@/lib/tailwind";
import { loadCancelledBooking } from "@/store/cancelledBooking";
import CustomActivityIndicator from "@/components/CustomActivityIndicator";
import BookingDetailsDropDetailsCard from "@/components/BookingDetailsDropDetailsCard";
import ScrollScreen from "@/components/ScrollScreen";
import axios from "axios";


interface HistoryScreenProps { }


const HistoryScreen: React.FC<HistoryScreenProps> = (props) => {
  const { allCancelledBooking } = useAppSelector((state) => ({
    allCancelledBooking: state.entities.cancelledBooking.allCancelledBooking,
    // loading: state.entities.cancelledBooking.loading,
  }));
  const { storeDetail } = useAppSelector(
    (state: any) => ({
      storeDetail: state.entities.searchBikes.storeDetail,
    })
  );
  const [skip, setskip] = useState(0); //Its Like Page number
  const [wholedata, setwholedata] = useState<any[]>([]); //Contains the whole data
  const [loadmore, setloadmore] = useState<boolean>(true); //Contains the whole data
  const [loading, setloading] = useState(true); //Contains the whole data

  const limit = 10 // This is the number which defines how many data will be loaded for every 'onReachEnd'
  useEffect(() => {
    fetchdata()
  }, [])
  const fetchdata = async () => {
    setloading(true)
    try {
      const query = `?skip=${skip}&limit=${limit}`
      const { data } = await axios.get('https://dummyjson.com/products' + query)
      console.log(data.products.length)
      if (data.products.length == 0) {
        setloadmore(false)
      }
      setwholedata([...wholedata, ...data.products])
      setloading(false)
      setskip(skip + 10)

    } catch (error) {
      setloading(false)
      console.log(error)
    }
  }

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={{height:100}}>
        <Text>{item.brand}</Text>
        <Text>{item.price}</Text>
      </View>
    )
  }, [wholedata])
  const onReachEnd = () => {
    if (loadmore) {
      fetchdata()
    }
  }
  return (
    <SafeAreaView style={[tw`bg-white`, { flex: 1, justifyContent: 'center' }]}>
      <CustomActivityIndicator visible={loading} />
      <FlatList
        data={wholedata}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}`}
        onEndReached={onReachEnd}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {},
});

export default HistoryScreen;

