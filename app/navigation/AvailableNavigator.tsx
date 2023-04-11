import BikesListCard from "@/components/BikesListCard";
import Screen from "@/components/Screen";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loadAllBikesListMaintenance, loadAllRentPool, } from "@/store/rentPool";
import React, { useEffect, useState } from "react";
import tw from "@/lib/tailwind";
import _ from "lodash";
import { FlatList, StyleSheet } from "react-native";
import { useAppSelector } from "@/hooks/useAppSelector";
import CustomActivityIndicator from "@/components/CustomActivityIndicator";
import UploadimageDialog from "@/components/UploadimageDialog";
import EditRentpollDialog from "@/components/EditRentpollDialog";
import { Checkbox } from "react-native-paper";


const AvailableNavigator: React.FC = () => {
  const { loading, updateRentPooliddata,
    updateRentBookingtoMaintenanceData, allAvailablerentPool } = useAppSelector((state) => ({
      loading: state.entities.rentPool.loading,
      updateRentBookingtoMaintenanceData: state.entities.rentPool.updateRentBookingtoMaintenanceData,
      updateRentPooliddata: state.entities.rentPool.updateRentPooliddata,
      allAvailablerentPool: state.entities.rentPool.allAvailablerentPool,
    }));
  const { storeDetail } = useAppSelector(
    (state: any) => ({
      storeDetail: state.entities.searchBikes.storeDetail,
    })
  );
  const dispatch = useAppDispatch();
  const [selectforuploadDocument, setselectforuploadDocument] = useState({})
  const [visibleDialog, setvisibleDialog] = useState("")
  const [localavailable, setlocalavailable] = useState<any[]>([])
  const [isLongterm, setisLongterm] = useState(false)
  useEffect(() => {
    if (isLongterm) {
      setlocalavailable(allAvailablerentPool.filter(item => item.isLongTerm))
    } else {
      setlocalavailable(allAvailablerentPool)
    }
  }, [isLongterm])
  useEffect(() => {
    dispatch(loadAllRentPool(`${_.get(storeDetail, "user._store")}`));
    dispatch(loadAllBikesListMaintenance(`${_.get(storeDetail, "user._store")}`));
  }, [isLongterm, updateRentBookingtoMaintenanceData, updateRentPooliddata,]);
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
        data={localavailable}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          <BikesListCard
            key={item._id}
            items={item}
            color={'green'}
            setselectforuploadDocument={setselectforuploadDocument}
            setvisibleDialog={setvisibleDialog}
          />} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AvailableNavigator;
