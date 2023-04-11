import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, ToastAndroid, TouchableOpacity, View } from "react-native";

import AppText from "@/components/AppText";
import tw from "@/lib/tailwind";
import formatDate from "@/utils/formatDate";

import _ from "lodash";
import { Button, Dialog, Divider, Portal } from "react-native-paper";
import { useDispatch } from "react-redux";
import colors from "../config/colors";
import StyleButton from "./StyleButton";
import moment from "moment";

import * as ImagePicker from 'expo-image-picker';
import { loadAllRentPool } from "@/store/rentPool";
import axios from "axios";
import CustomActivityIndicator from "./CustomActivityIndicator";
import { useAppSelector } from "@/hooks/useAppSelector";
import { apiPaths } from "@/api/apiPaths";

interface UploadimageDialogProps {
  visible: boolean
  selectforuploadDocument: { [key: string]: object | string | number | null | any };
  setvisibleDialog: React.Dispatch<React.SetStateAction<any>>
}
const UploadimageDialog: React.FC<UploadimageDialogProps> = ({
  visible,
  selectforuploadDocument,
  setvisibleDialog
}) => {
  const { loading } = useAppSelector((state) => ({
    loading: state.entities.rentPool.loading,
  }));
  const { storeDetail } = useAppSelector(
    (state: any) => ({
      storeDetail: state.entities.searchBikes.storeDetail,
    })
  );
  const { userToken } = useAppSelector((state) => ({
    userToken: state.entities.createBooking.userToken,
  }));
  const dispatch = useDispatch()
  const [capturedImage, setCapturedImage] = useState<any>({
    rc: "",
    puc: "",
    licence: "",
  })
  const uploadimage = async (uri: string, type: string) => {
    const name = uri.split('/')[uri.split('/').length - 1]
    const Imagedata = new FormData();
    const fileType = uri.split('.')[uri.split('.').length - 1]
    Imagedata.append('uploads', {
      uri,
      type: `image/${fileType}`,
      name
    })
    Imagedata.append('formData', `{"id":"${_.get(selectforuploadDocument, "_id")}","docType":"${type}","expiryDate":"11/18/2022"}`)
    const url2 = `${apiPaths.prod.url}/api/rent-pool/upload-doc/${type}/${_.get(selectforuploadDocument, "registrationNumber")}`
    try {
      const { data } = await axios.post(url2, Imagedata, {
        headers: {
          'Authorization': userToken,
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(data, 'data')
      dispatch(loadAllRentPool(`${_.get(storeDetail, "user._store")}`));
      ToastAndroid.show("Image uploaded succesfully", ToastAndroid.SHORT)
    } catch (error) {
      ToastAndroid.show("Something went wrong try again", ToastAndroid.SHORT)
      console.log(error)
    }
  }
  const pickImage = async (type: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        uploadimage(result.assets[0].uri, type)
        if (type === "rc") {
          setCapturedImage({ ...capturedImage, rc: result.assets[0].uri })
        } else if (type === "puc") {
          setCapturedImage({ ...capturedImage, puc: result.assets[0].uri })
        } else if (type === "licence") {
          setCapturedImage({ ...capturedImage, licence: result.assets[0].uri })
        }
      }
    } catch (error) {
      console.log(error)
    }
  };
  const onDismissClear = () => {
    setvisibleDialog("")
    setCapturedImage({
      rc: "",
      puc: "",
      licence: "",
    })
  }
  return (
    <Portal>
      <Dialog visible={visible} style={tw`bg-white`} onDismiss={() => onDismissClear()}>
        <CustomActivityIndicator visible={loading} />
        <AppText style={[tw`m-4`, { color: colors.purple, fontSize: 16 }]}>{`Upload Documents`}</AppText>
        <Dialog.Content>
          <View style={tw`my-1`}>
            <AppText style={[tw`text-gray-600`, { fontSize: 11 }]}>{`Upload RC`}</AppText>
            <View style={tw`flex-row justify-between`}>
              {
                capturedImage.rc ?
                  <Image source={{ uri: capturedImage.rc }} style={[tw`w-1/2 bg-gray-300 rounded-lg`, { height: 90 }]} /> :
                  <View style={[tw`w-1/2 bg-gray-300 rounded-lg`, { height: 90 }]} />
              }
              <StyleButton title="Choose File" borderColor={colors.lightblue} textStyle={{ fontSize: 8 }} style={{ width: '32%', height: 30, alignSelf: 'flex-end' }} onPress={() => {
                pickImage("rc")
              }} />
            </View>
          </View>
          <View style={tw`my-1`}>
            <AppText style={[tw``, { color: colors.purple, fontSize: 11 }]}>{`Upload PUC`}</AppText>
            <View style={tw`flex-row justify-between `}>
              {
                capturedImage.puc ?
                  <Image source={{ uri: capturedImage.puc }} style={[tw`w-1/2 bg-gray-300 rounded-lg`, { height: 90 }]} /> :
                  <View style={[tw`w-1/2 bg-gray-300 rounded-lg`, { height: 90 }]} />
              }
              <View style={tw`w-5/10 justify-between`}>
                <TouchableOpacity onPress={() => {
                  // showDatePicker()
                  // setselectedDate("startDate")
                }} style={[tw`p-2 rounded-md items-center justify-center`, { alignSelf: 'flex-end' }]}>
                  <AppText style={tw`text-xs font-semibold text-gray-600`}>
                    {/* {moment(new Date()).format('lll')} */}
                    PUC Expiry Date:
                  </AppText>
                </TouchableOpacity>
                <StyleButton title="Choose File" borderColor={colors.lightblue} textStyle={{ fontSize: 8 }} style={{ width: '65%', height: 30, alignSelf: 'flex-end' }} onPress={() => {
                  pickImage("puc")
                }} />
              </View>
            </View>
          </View>
          <View style={tw`my-1`}>
            <AppText style={[tw``, { color: colors.purple, fontSize: 11 }]}>{`Upload licence`}</AppText>
            <View style={tw`flex-row justify-between `}>
              {
                capturedImage.licence ?
                  <Image source={{ uri: capturedImage.licence }} style={[tw`w-1/2 bg-gray-300 rounded-lg`, { height: 90 }]} /> :
                  <View style={[tw`w-1/2 bg-gray-300 rounded-lg`, { height: 90 }]} />
              }
              <View style={tw`w-5/10 justify-between`}>
                <TouchableOpacity onPress={() => {
                  // showDatePicker()
                  // setselectedDate("startDate")
                }} style={[tw`p-2 rounded-md items-center justify-center`, { alignSelf: 'flex-end' }]}>
                  <AppText style={tw`text-xs font-semibold text-gray-600`}>
                    {/* {moment(new Date()).format('lll')} */}
                    Insurance Expiry Date:
                  </AppText>
                </TouchableOpacity>
                <StyleButton title="Choose File" borderColor={colors.lightblue} textStyle={{ fontSize: 8 }} style={{ width: '65%', height: 30, alignSelf: 'flex-end' }} onPress={() => {
                  pickImage("licence")
                }} />
              </View>
            </View>
          </View>
        </Dialog.Content>
        <StyleButton title="Submit"
          borderColor={colors.green}
          textStyle={{ fontSize: 11 }}
          style={{ width: '35%', height: 35, alignSelf: 'flex-end', bottom: 12, right: 12 }}
          onPress={() => {
            dispatch(loadAllRentPool(`${_.get(storeDetail, "user._store")}`));
            onDismissClear()
          }} />
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default React.memo(UploadimageDialog);
