import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import tw from "@/lib/tailwind";
import React, { Dispatch, SetStateAction } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Dialog, Portal } from "react-native-paper";
import AppText from "./AppText";
import _ from "lodash";
import colors from "../config/colors";
import StyleButton from "./StyleButton";
import { getallPickups, transferrequestRentBooking } from "@/store/pickUpStore";
import { RootState } from "@/types/RootStateType";

interface TransferBookingDialogProps {
    visible: boolean;
    bookingforCheckIn: object | undefined;
    //FIXME: check the function signature for this key
    hideDialog: Dispatch<SetStateAction<string>>;
}

const TransferBookingDialog: React.FC<TransferBookingDialogProps> = ({
    visible,
    hideDialog,
    bookingforCheckIn
}) => {
    const { loading, fetchBikestransferRentbooking } = useAppSelector((state) => ({
        loading: state.entities.pickupStore.loading,
        fetchBikestransferRentbooking: state.entities.pickupStore.fetchBikestransferRentbooking,
    }));
    const { storeDetail } = useAppSelector(
        (state: RootState) => ({
            storeDetail: state.entities.searchBikes.storeDetail,
        })
    );
    const dispatch = useAppDispatch()
    return (
        <>
            {
                loading ? null :
                    <Portal>
                        <Dialog visible={visible} onDismiss={() => hideDialog('')} style={tw`p-1 w-9.5/10 self-center bg-white`}>
                            <AppText style={[tw`m-3 font-bold `, { color: colors.purple, fontSize: 15 }]}>{`Available Bikes at Store!`}</AppText>
                            <Dialog.ScrollArea style={[tw`p-2`, { height: 300 }]}>
                                {_.get(fetchBikestransferRentbooking, "results", []).length ?
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={_.get(fetchBikestransferRentbooking, "results[0].address", [])}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View key={item.id} style={tw`w-full rounded flex-row justify-between items-center my-1 bg-white`}>
                                                    <View>
                                                        <View style={tw` flex-row items-center bg-white`}>
                                                            <AppText style={[tw` text-gray-500`, { fontSize: 12 }]} >{index + 1}.</AppText>
                                                            <AppText style={[tw` text-gray-500 ml-1`, { fontSize: 12 }]} >{_.get(fetchBikestransferRentbooking, "results[0].brand") + " " + _.get(fetchBikestransferRentbooking, "results[0].modelName")}</AppText>
                                                        </View>
                                                        <AppText style={[tw``, { fontSize: 9 }]}>Location : {_.get(item, "store")}</AppText>
                                                    </View>
                                                    <StyleButton title="Transfer" borderColor="#17A1FA"
                                                        textStyle={{ fontSize: 11 }}
                                                        style={{ width: '30%', height: 30 }} onPress={() => {
                                                            dispatch(transferrequestRentBooking({
                                                                data: {
                                                                    store: _.get(item, "store"),
                                                                    rentBikeKey: _.get(item, "key"),
                                                                },
                                                                id: _.get(bookingforCheckIn, "_id"),
                                                            }))
                                                            dispatch(getallPickups(`${_.get(storeDetail, "user._store")}`))
                                                            hideDialog('')
                                                        }} />
                                                </View>
                                            )
                                        }} />
                                    :
                                    <AppText>No bikes Available</AppText>
                                }
                            </Dialog.ScrollArea>
                        </Dialog>
                    </Portal>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {},
});

export default React.memo(TransferBookingDialog);
