import tw from "@/lib/tailwind";
import React, { useState } from 'react'
import {
    BackHandler, Image, ImageBackground, ScrollView,
    StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View
} from 'react-native'
import { Camera, CameraType, FlashMode } from 'expo-camera'
import { Entypo, Ionicons } from '@expo/vector-icons';
import AppText from '@/components/AppText'
import AppButton from '@/components/AppButton'
import colors from '../../config/colors'
import _ from 'lodash'
import { SIZES } from '../../config/styles';
import routes from "@/navigation/routes";
import { getsinglerentbooking, updateRentBooking } from "@/store/createBooking";
import { useDispatch } from "react-redux";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import { useAppSelector } from "@/hooks/useAppSelector";
import axios from "axios";
import { apiPaths } from "@/api/apiPaths";
import CustomActivityIndicator from "@/components/CustomActivityIndicator";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import * as FileSystem from 'expo-file-system';
let camera: Camera
export default function VehiclePhotosScreen({ navigation }: any) {
    const { offlineBookingDetails, rentBookingDetails, userToken, loading } = useAppSelector((state) => ({
        offlineBookingDetails: state.entities.createBooking.offlineBookingDetails,
        rentBookingDetails: state.entities.createBooking.rentBookingDetails,
        userToken: state.entities.createBooking.userToken,
        loading: state.entities.createBooking.loading,
    }));
    const [vehicleDetails, setvehicleDetails] = React.useState<any>({
        odometer: '',
    })
    const DocumentsAvailable = Boolean(_.get(rentBookingDetails, 'checkInInfo.images.back') &&
        _.get(rentBookingDetails, 'checkInInfo.images.front') && _.get(rentBookingDetails, 'checkInInfo.images.right') && _.get(rentBookingDetails, 'checkInInfo.images.left') && vehicleDetails.odometer)
    const [startCamera, setStartCamera] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState<any>(null)
    const [capturedImageValue, setCapturedImageValue] = useState<string>('')
    const [visible, setvisible] = useState(false)
    const [flashMode, setFlashMode] = useState('off')
    const __startCamera = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync()
        if (status === 'granted') {
            setStartCamera(true)
        } else {
            ToastAndroid.show('Access denied', ToastAndroid.SHORT)
        }
    }
    const __takePicture = async () => {
        try {
            const image = await camera.takePictureAsync({
                quality: .1
            })
            const manipResult = await manipulateAsync(
                image.uri,
                [{ rotate: 0 }, {
                    resize: {
                        width: 800
                    }
                }],
                { compress: 0, format: SaveFormat.PNG }
            );
            const fileInfo = await FileSystem.getInfoAsync(manipResult.uri);
            setCapturedImage(manipResult.uri)
            setPreviewVisible(true)
        } catch (error) {
            console.log(error)
        }
    }
    const goBackFunc = () => {
        if (startCamera) {
            setStartCamera(false)
        } else {
            navigation.goBack()
        }
    }
    BackHandler.addEventListener('hardwareBackPress', () => {
        goBackFunc()
        return true;
    }, [])
    const dispatch = useDispatch()
    const __savePhoto = async () => {
        setvisible(true)
        const img = capturedImage
        const name = img.split('/')[img.split('/').length - 1]
        const Imagedata = new FormData();
        const fileType = img.split('.')[img.split('.').length - 1]
        Imagedata.append('bikeimages', {
            uri: img,
            type: `image/${fileType}`,
            name
        });
        const url = `${apiPaths.prod.url}/api/rentbooking/uploadBikeImages/${offlineBookingDetails._id}/${capturedImageValue.toLocaleLowerCase()}`
        try {
            const data = await axios.post(url, Imagedata, {
                headers: {
                    'Authorization': userToken,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (data) {
                setvisible(false)
                dispatch(getsinglerentbooking(offlineBookingDetails._id))
                ToastAndroid.show('Image uploaded successfully', ToastAndroid.SHORT)
                setPreviewVisible(false)
            }
        } catch (error) {
            setvisible(false)
            console.log(error)
            setPreviewVisible(false)
            ToastAndroid.show('Image upload failed try again', ToastAndroid.SHORT)
        }
        setStartCamera(false)
    }
    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
    }
    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomActivityIndicator visible={visible || loading} />
            {startCamera ? (
                <View
                    style={{
                        flex: 1,
                        width: '100%'
                    }}
                >
                    {previewVisible && capturedImage ? (
                        <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
                    ) : (
                        <Camera
                            type={CameraType.back}
                            flashMode={FlashMode.auto}
                            style={{ flex: 1 }}
                            ref={(r) => {
                                camera = r
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    flexDirection: 'row'
                                }}
                            >
                                <View style={{ paddingHorizontal: 12, top: 32, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%', height: 55 }} >
                                    <Ionicons name="arrow-back" size={30} color="white" onPress={goBackFunc} />
                                    <AppText style={[tw`font-semibold text-white text-lg`]}>Boongg</AppText>
                                    <Ionicons name="flash" onPress={() => __handleFlashMode()} size={24} color="white" />
                                </View>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        flexDirection: 'row',
                                        flex: 1,
                                        width: '100%',
                                        padding: 20,
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <View
                                        style={{
                                            alignSelf: 'center',
                                            flex: 1,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <AppText style={tw`self-center mb-2 text-white`}>{capturedImageValue}</AppText>
                                        <TouchableOpacity onPress={__takePicture} style={[tw`justify-center items-center`, {
                                            width: 70,
                                            height: 70,
                                            borderRadius: 35, borderColor: 'white', borderWidth: 1
                                        }]}>
                                            <Entypo name="camera" size={35} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Camera>
                    )}
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 1, alignItems: 'center' }}>
                    {/* topbox */}
                    <View style={{ width: '100%', flexDirection: 'row', padding: 15, alignItems: 'center', justifyContent: 'space-between', height: 90, top: 8 }}>
                        <Ionicons name="arrow-back" size={30} color="black" onPress={() => navigation.goBack()} />
                        <AppText style={[tw`font-semibold text-lg`]}>Boongg</AppText>
                        <View style={{ width: 25, height: 25 }} />
                    </View>
                    <>
                        <Text style={tw`mb-2 font-semibold self-start ml-5 text-lg`}>Vehicle <Text style={{ color: colors.lightblue }}>Photos</Text></Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '90%' }}>
                            <TouchableOpacity onPress={() => {
                                setCapturedImageValue('Front')
                                __startCamera()
                            }} style={styles.cameraboxsmall}>
                                {
                                    !_.get(rentBookingDetails, 'checkInInfo.images.front') ?
                                        <>
                                            <AppText style={{ color: '#000000', fontSize: 9 }}>Front</AppText>
                                            <Entypo name="camera" size={SIZES.width / 12} color={colors.lightblue} />
                                            <AppText style={{ color: '#000000', top: 12, fontSize: 9 }}>Allow camera to scan</AppText>
                                            <AppText style={{ color: '#000000', fontSize: 9 }}>your details</AppText>
                                        </> : <Image source={{ uri: _.get(rentBookingDetails, 'checkInInfo.images.front') }} style={{ width: 100, height: 100 }} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setCapturedImageValue('Back')
                                __startCamera()
                            }} style={styles.cameraboxsmall}>
                                {
                                    !_.get(rentBookingDetails, 'checkInInfo.images.back') ?
                                        <>
                                            <AppText style={{ color: '#000000', fontSize: 9 }}>Back</AppText>
                                            <Entypo name="camera" size={SIZES.width / 12} color={colors.lightblue} />
                                            <AppText style={{ color: '#000000', top: 12, fontSize: 9 }}>Allow camera to scan</AppText>
                                            <AppText style={{ color: '#000000', fontSize: 9 }}>your details</AppText>
                                        </> : <Image source={{ uri: _.get(rentBookingDetails, 'checkInInfo.images.back') }} style={{ width: 100, height: 100 }} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '90%', marginTop: 8 }}>
                            <TouchableOpacity onPress={() => {
                                setCapturedImageValue('Left')
                                __startCamera()
                            }} style={styles.cameraboxsmall}>
                                {
                                    !_.get(rentBookingDetails, 'checkInInfo.images.left') ?
                                        <>
                                            <AppText style={{ color: '#000000', fontSize: 9 }}>Left</AppText>
                                            <Entypo name="camera" size={SIZES.width / 12} color={colors.lightblue} />
                                            <AppText style={{ color: '#000000', top: 12, fontSize: 9 }}>Allow camera to scan</AppText>
                                            <AppText style={{ color: '#000000', fontSize: 9 }}>your details</AppText>
                                        </> : <Image source={{ uri: _.get(rentBookingDetails, 'checkInInfo.images.left') }} style={{ width: 100, height: 100 }} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setCapturedImageValue('Right')
                                __startCamera()
                            }} style={styles.cameraboxsmall}>
                                {
                                    !_.get(rentBookingDetails, 'checkInInfo.images.right') ?
                                        <>
                                            <AppText style={{ color: '#000000', fontSize: 9 }}>Right</AppText>
                                            <Entypo name="camera" size={SIZES.width / 12} color={colors.lightblue} />
                                            <AppText style={{ color: '#000000', top: 12, fontSize: 9 }}>Allow camera to scan</AppText>
                                            <AppText style={{ color: '#000000', fontSize: 9 }}>your details</AppText>
                                        </> : <Image source={{ uri: _.get(rentBookingDetails, 'checkInInfo.images.right') }} style={{ width: 100, height: 100 }} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={tw`w-9/10 my-1 mt-5`}>
                            <AppText style={[tw`text-xs my-1`, { color: '#B9B9B9' }]}>Odometer Reading</AppText>
                            <TextInput keyboardType='number-pad' value={vehicleDetails.odometer}
                                onChangeText={(t) => setvehicleDetails({ ...vehicleDetails, odometer: t })}
                                style={[tw`h-12 rounded p-2 border-b-2 border-gray-200`, {
                                    fontSize: 11
                                }]} />
                        </View>
                    </>
                </ScrollView>
            )}
            {
                !startCamera &&
                <AppButton disabled={!DocumentsAvailable} title='Save' style={tw`w-9/10 h-13 self-center`} onPress={() => {
                    dispatch(updateRentBooking({
                        id: offlineBookingDetails._id,
                        checkInInfo: {
                            odometer: vehicleDetails.odometer,
                        }
                    }))
                    dispatch(getsinglerentbooking(offlineBookingDetails._id))
                    navigation.replace(routes.VERIFY_DOCUMENTS_SCREEN2.route)
                }} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cameraboxsmall: {
        width: SIZES.width * .43,
        height: SIZES.width * .3,
        backgroundColor: '#F1F7FF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderColor: colors.lightblue,
        borderWidth: 2, borderStyle: 'dotted'
    }, cameraBox: {
        flex: .8, width: SIZES.width * .87,
        height: SIZES.width * .62,
        backgroundColor: '#F1F7FF',
        justifyContent: 'center',
        alignItems: 'center', alignSelf: 'center',
        borderColor: '#17A1FA', borderWidth: 2,
        borderStyle: 'dotted'
    }
})
const CameraPreview = ({ photo, retakePicture, savePhoto }: any) => {
    return (
        <View
            style={{
                backgroundColor: 'transparent',
                flex: 1,
                width: '100%',
                height: '100%'
            }}
        >
            <ImageBackground
                source={{ uri: photo }}
                style={{
                    flex: 1
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        padding: 15,
                        justifyContent: 'flex-end'
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                            onPress={retakePicture}
                            style={{
                                width: 130,
                                height: 40,

                                alignItems: 'center',
                                borderRadius: 4
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20
                                }}
                            >
                                Re-take
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={savePhoto}
                            style={{
                                width: 130,
                                height: 40,

                                alignItems: 'center',
                                borderRadius: 4
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20
                                }}
                            >
                                save photo
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
