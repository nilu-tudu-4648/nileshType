import tw from "@/lib/tailwind";
import colors from "../config/colors";
import React, { Dispatch, SetStateAction } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Dialog, Portal } from "react-native-paper";
import AppText from "./AppText";
import StyleButton from "./StyleButton";
import _ from "lodash";

interface ShowImageDialogonDropProps {
    visible: boolean,
    hideDialog: Dispatch<SetStateAction<string>>;
    imageUrl?: object,
}

const ShowImageDialogonDrop: React.FC<ShowImageDialogonDropProps> = ({
    visible,
    hideDialog,
    imageUrl,
}) => {
    return (
        <Portal>
            <Dialog style={[tw`p-3 bg-white  self-center m-2`, { height: 500, width: '90%' }]} visible={visible} onDismiss={() => hideDialog("")}>
                <AppText style={tw`text-black my-2`}>Uploaded Images</AppText>
                <ScrollView >
                    <AppText style={tw`text-gray-500 text-sm my-2`}>Driving Licence</AppText>
                    <Image resizeMode="cover" style={[tw` my-1`, { width: '100%', height: 385 }]} source={{ uri: _.get(imageUrl, "_webuserId.profile.drivingLicence") }} />
                    <AppText style={tw`text-gray-500 text-sm my-2`}>Aadhar</AppText>
                    <Image resizeMode="cover" style={[tw` my-1`, { width: '100%', height: 385 }]} source={{ uri: _.get(imageUrl, "_webuserId.profile.aadhar") }} />
                    {
                        _.get(imageUrl, "checkInInfo.kyc.drivingLicence") ?
                            <>
                                <AppText style={tw`text-gray-500 text-sm my-2`}>Driving Licence 2</AppText>
                                <Image resizeMode="cover" style={[tw` my-1`, { width: '100%', height: 385 }]} source={{ uri: _.get(imageUrl, "checkInInfo.kyc.drivingLicence") }} />
                                <AppText style={tw`text-gray-500 text-sm my-2`}>Aadhar 2</AppText>
                                <Image resizeMode="cover" style={[tw` my-1`, { width: '100%', height: 385 }]} source={{ uri: _.get(imageUrl, "checkInInfo.kyc.aadhar") }} />
                            </> : null
                    }
                    <AppText style={tw`text-gray-500 text-sm my-2`}>Front</AppText>
                    <Image resizeMode="cover" style={[tw` my-1`, { width: '100%', height: 385 }]} source={{ uri: _.get(imageUrl, "checkInInfo.images.front") }} />
                    <AppText style={tw`text-gray-500 text-sm my-2`}>Back</AppText>
                    <Image resizeMode="cover" style={[tw` my-1`, { width: '100%', height: 385 }]} source={{ uri: _.get(imageUrl, "checkInInfo.images.back") }} />
                    <AppText style={tw`text-gray-500 text-sm my-2`}>Left</AppText>
                    <Image resizeMode="cover" style={[tw` my-1`, { width: '100%', height: 385 }]} source={{ uri: _.get(imageUrl, "checkInInfo.images.left") }} />
                    <AppText style={tw`text-gray-500 text-sm my-2`}>Right</AppText>
                    <Image resizeMode="cover" style={[tw` my-1`, { width: '100%', height: 385 }]} source={{ uri: _.get(imageUrl, "checkInInfo.images.right") }} />
                    <AppText style={tw`text-gray-500 text-sm my-2`}>Rider</AppText>
                    <Image resizeMode="cover" style={[tw` my-1`, { width: '100%', height: 385 }]} source={{ uri: _.get(imageUrl, "checkInInfo.images.selfieWithBike") }} />
                </ScrollView>
                <View style={tw`flex-row self-end mt-2`}>
                    <StyleButton
                        title="Close"
                        borderColor={colors.green}
                        textStyle={{ fontSize: 11 }}
                        style={{ width: '30%', height: 35 }}
                        onPress={() => {
                            hideDialog('')
                        }} />
                </View>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {},
});

export default React.memo(ShowImageDialogonDrop);
