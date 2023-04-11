
import BikesListCard from "@/components/BikesListCard";
import EditRentpollDialog from "@/components/EditRentpollDialog";
import Screen from "@/components/Screen";
import UploadimageDialog from "@/components/UploadimageDialog";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import tw from "@/lib/tailwind";
import { loadAllRentPool } from "@/store/rentPool";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

interface OnbookingScreenProps { }

const OnbookingScreen: React.FC<OnbookingScreenProps> = (props) => {
  const { allBookedrentPool } = useAppSelector((state) => ({
    allBookedrentPool: state.entities.rentPool.allBookedrentPool,
  }));
  const { storeDetail } = useAppSelector(
    (state: any) => ({
      storeDetail: state.entities.searchBikes.storeDetail,
    })
  );
  const dispatch = useAppDispatch();
  const [selectforuploadDocument, setselectforuploadDocument] = useState({})
  const [visibleDialog, setvisibleDialog] = useState("")
  const [localbooked, setlocalbooked] = useState<any[]>([])
  const [isLongterm, setisLongterm] = useState(false)
  useEffect(() => {
    if (isLongterm) {
      setlocalbooked(allBookedrentPool.filter(item => item.isLongTerm))
    } else {
      setlocalbooked(allBookedrentPool)
    }
    dispatch(loadAllRentPool(`${_.get(storeDetail, "user._store")}`));
  }, [isLongterm]);
  return (
    <Screen style={tw`p-1`}>
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
        data={localbooked}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          <BikesListCard
            key={item._id}
            items={item}
            color={'red'}
            setselectforuploadDocument={setselectforuploadDocument}
            setvisibleDialog={setvisibleDialog}
          />} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default OnbookingScreen;
