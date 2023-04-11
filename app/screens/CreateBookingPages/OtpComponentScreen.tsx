import { Image, StyleSheet, TouchableOpacity, View, TextInput, ToastAndroid, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from '@/components/AppText'
import tw from "@/lib/tailwind";
import OTPInput from "../../components/OTPInput ";
import { useDispatch } from 'react-redux';
import { i18n } from '../../../language'
import CountDown from 'react-native-countdown-component';
import { clearFailedMsg, sendOtptoUser, userotpVerify } from '@/store/createBooking';
import { useAppSelector } from '@/hooks/useAppSelector';
import ActivityIndicator from '@/components/CustomActivityIndicator';
import routes from '@/navigation/routes';
import colors from '../../config/colors';
import AppButton from '@/components/AppButton';
const OtpComponentScreen = ({ route, navigation }: any) => {
    const { otpSent, otpVerifyDone, UserbyMobileNo, loading, failedMsg } = useAppSelector((state) => ({
        otpSent: state.entities.createBooking.otpSent,
        otpVerifyDone: state.entities.createBooking.otpVerifyDone,
        UserbyMobileNo: state.entities.createBooking.UserbyMobileNo,
        loading: state.entities.createBooking.loading,
        failedMsg: state.entities.createBooking.failedMsg,
    }));
    const [otpCode, setOTPCode] = useState("");

    const [timerShow, settimerShow] = useState(false);
    const [disableResend, setdisableResend] = useState(false);
    const [isPinReady, setIsPinReady] = useState(false);
    const maximumCodeLength = 6;
    const { mobilenotofetch } = route.params;
    useEffect(() => {
        if (otpVerifyDone) {
            navigation.replace(routes.SIGNUP_COMPONENT_SCREEN.route, { mobilenotofetch, otpCode })
        }
    }, [otpVerifyDone])
    const dispatch = useDispatch()
    BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.replace(routes.MOBILENO_INPUT_SCREEN.route)
        dispatch(clearFailedMsg())
        return () => true
    }, [])
    return (
        <>
            <ActivityIndicator visible={loading} />
            <View style={[tw`w-full p-4 justify-between bg-white`]}>
                {
                    !otpSent &&
                    <View style={tw`w-full h-full justify-between`}>
                        <View>
                            <AppText style={tw`bg-green-300 rounded text-sm p-1`}>User details does not exist!... Please create New User!</AppText>
                            <AppText style={tw`font-semibold  text-lg my-4`}>{i18n.t('Verify OTP to create Booking')}</AppText>
                            <View style={[tw`w-9.5/10  my-3 flex-row h-11 items-center p-1`, { fontSize: 17, borderBottomColor: 'black', borderBottomWidth: 1 }]}>
                                <Image resizeMode="contain" style={[tw`w-1/10 self-center`, { height: 23 }]} source={require('../../assets/india.png')} />
                                <AppText style={tw`font-semibold pt-.8 mx-1`}>+91</AppText>
                                <AppText style={tw`font-semibold pt-.8 mx-1`}>{mobilenotofetch}</AppText>
                            </View>
                        </View>
                        <AppButton title=' Send OTP' onPress={() => {
                            settimerShow(!timerShow)
                            setdisableResend(true)
                            dispatch(sendOtptoUser({
                                formdata: {
                                    mobile: mobilenotofetch,
                                }
                            }))
                        }
                        } />
                    </View>
                }
                {otpSent && !otpVerifyDone &&
                    (
                        <View style={tw`w-full h-full pt-4 justify-between`}>
                            <View>
                                <AppText style={tw`font-semibold text-lg m-2 `}>{i18n.t('Verify OTP to create Booking')}</AppText>
                                <AppText style={tw`font-semibold text-gray-400 m-2`}>+91{mobilenotofetch}</AppText>
                                <View style={{ top: -20 }}>
                                    <OTPInput
                                        code={otpCode}
                                        setCode={setOTPCode}
                                        maximumLength={maximumCodeLength}
                                        setIsPinReady={setIsPinReady} />
                                    {
                                        failedMsg ?
                                            <AppText style={{ color: 'red', fontSize: 12, left: 18 }}>Sorry Invalid OTP!</AppText> : null
                                    }
                                    <View style={{ paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {
                                            timerShow ?
                                                <View>
                                                    <CountDown
                                                        until={60}
                                                        size={15}
                                                        digitStyle={{}}
                                                        onFinish={() => setdisableResend(false)}
                                                        digitTxtStyle={{ color: 'gray' }}
                                                        timeToShow={['M', 'S']}
                                                        timeLabels={{ m: '', s: '' }}
                                                    />
                                                </View>
                                                :
                                                <CountDown
                                                    until={60}
                                                    size={15}
                                                    onFinish={() => setdisableResend(false)}
                                                    digitStyle={{}}
                                                    digitTxtStyle={{ color: 'gray' }}
                                                    timeToShow={['M', 'S']}
                                                    timeLabels={{ m: '', s: '' }}
                                                />
                                        }
                                        <TouchableOpacity disabled={disableResend} style={{ alignSelf: 'flex-end' }} onPress={() => {
                                            setOTPCode('')
                                            dispatch(clearFailedMsg())
                                            settimerShow(!timerShow)
                                            setdisableResend(true)
                                            dispatch(sendOtptoUser({
                                                formdata: {
                                                    mobile: mobilenotofetch,
                                                }
                                            }))
                                        }}>
                                            <AppText style={{ marginVertical: 3, color: colors.purple, fontSize: 13 }} >{i18n.t('Resend OTP')}</AppText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <AppButton title=' Verify OTP' onPress={() => {
                                otpCode.length < 6 ? ToastAndroid.show('Invalid OTP entered', ToastAndroid.SHORT) :
                                    dispatch(userotpVerify({
                                        formdata: {
                                            mobile: mobilenotofetch,
                                            otp: otpCode,
                                        }
                                    }))
                            }
                            } />
                        </View>
                    )}
            </View>
        </>
    )
}

export default OtpComponentScreen

const styles = StyleSheet.create({})