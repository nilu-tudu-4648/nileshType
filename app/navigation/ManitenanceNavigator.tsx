import BikesListCard from "@/components/BikesListCard";
import CustomActivityIndicator from "@/components/CustomActivityIndicator";
import Screen from "@/components/Screen";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { loadAllBikesListMaintenance, loadAllRentPool } from "@/store/rentPool";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import tw from "@/lib/tailwind";
import UploadimageDialog from "@/components/UploadimageDialog";
import EditRentpollDialog from "@/components/EditRentpollDialog";
import _ from "lodash";
import { Checkbox } from "react-native-paper";



const ManitenanceNavigator: React.FC = () => {
  const { loading, allBikesAvailableandBookedandMaintenance,
    updateRentBookingtoMaintenanceData, updateRentPooliddata, unblockRentPooliddata } = useAppSelector((state) => ({
      loading: state.entities.rentPool.loading,
      allBikesAvailableandBookedandMaintenance: state.entities.rentPool.allBikesAvailableandBookedandMaintenance,
      updateRentBookingtoMaintenanceData: state.entities.rentPool.updateRentBookingtoMaintenanceData,
      updateRentPooliddata: state.entities.rentPool.updateRentPooliddata,
      unblockRentPooliddata: state.entities.rentPool.unblockRentPooliddata,
    }));
  const { storeDetail } = useAppSelector(
    (state: any) => ({
      storeDetail: state.entities.searchBikes.storeDetail,
    })
  );
  const [selectforuploadDocument, setselectforuploadDocument] = useState({})
  const [visibleDialog, setvisibleDialog] = useState("")
  const [localMaintance, setlocalMaintance] = useState<any[]>([])
  const [isLongterm, setisLongterm] = useState(false)
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isLongterm) {
      setlocalMaintance(allBikesAvailableandBookedandMaintenance.filter(ite => !ite.statusType && ite._rentPoolKey && ite.isLongTerm))
    } else {
      setlocalMaintance(allBikesAvailableandBookedandMaintenance.filter(ite => !ite.statusType && ite._rentPoolKey))
    }
  }, [isLongterm]);
  useEffect(() => {
    dispatch(loadAllRentPool(`${_.get(storeDetail, "user._store")}`));
    dispatch(loadAllBikesListMaintenance(`${_.get(storeDetail, "user._store")}`));
  }, [updateRentBookingtoMaintenanceData, updateRentPooliddata, unblockRentPooliddata]);
  return (
    <Screen style={tw`p-1`}>
      <CustomActivityIndicator visible={loading} />
      <UploadimageDialog
        visible={visibleDialog === "UploadimageDialog"}
        setvisibleDialog={setvisibleDialog}
        selectforuploadDocument={selectforuploadDocument}
      />
      <EditRentpollDialog
        visible={visibleDialog === "EditRentpollDialog"}
        setvisibleDialog={setvisibleDialog}
      />
      <Checkbox.Item
        status={isLongterm ? "checked" : "unchecked"}
        label='Is Long term'
        style={{ width: 200 }}
        labelStyle={{ fontSize: 10 }}
        color={tw.color("bg-violet-800")}
        onPress={() => setisLongterm(!isLongterm)}
      />
      <FlatList
        data={localMaintance}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          <BikesListCard
            key={item._id} items={item}
            setselectforuploadDocument={setselectforuploadDocument}
            setvisibleDialog={setvisibleDialog}
            color={'#E45C00'}
            maintenance={true} />} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default ManitenanceNavigator;
