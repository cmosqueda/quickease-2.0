import useTheme from "@/hooks/useTheme";
import ForumHeader from "@/components/ForumHeader";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";
import CustomModal from "@/components/CustomModal";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "expo-router";

const SearchModal = ({
  modalVisibility,
  setModalVisibility,
}: {
  modalVisibility: boolean;
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
}) => {
  const { height } = useWindowDimensions();

  return (
    <CustomModal
      modalVisibility={modalVisibility}
      setModalVisibility={setModalVisibility}
    >
      <KeyboardAvoidingView behavior="position">
        <CustomView
          variant="colorBase100"
          style={{ height: height / 4, gap: 8 }}
          className="rounded-tr-3xl rounded-tl-3xl p-8"
        >
          <CustomText>
            <MaterialIcons
              name="close"
              size={24}
              onPress={() => setModalVisibility(false)}
            />
          </CustomText>
          <CustomText variant="bold" className="text-4xl">
            Search
          </CustomText>
          <View className="flex flex-row gap-2 items-center">
            <CustomTextInput
              className="rounded-xl flex-1"
              autoFocus={true}
              enterKeyHint="go"
            />
          </View>
        </CustomView>
      </KeyboardAvoidingView>
    </CustomModal>
  );
};

const NotificationModal = ({
  modalVisibility,
  setModalVisibility,
}: {
  modalVisibility: boolean;
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
}) => {
  const { height } = useWindowDimensions();

  return (
    <CustomModal
      animationType="fade"
      modalVisibility={modalVisibility}
      setModalVisibility={setModalVisibility}
    >
      <CustomView
        variant="colorBase100"
        style={{ height: height, gap: 8 }}
        className="px-8 py-12"
      >
        <CustomText>
          <MaterialIcons
            name="close"
            size={24}
            onPress={() => setModalVisibility(false)}
          />
        </CustomText>
        <CustomText variant="bold" className="text-4xl">
          Notifications
        </CustomText>
        <CustomView
          variant="colorBase200"
          className="p-6 flex flex-row gap-4 items-center rounded-xl"
        >
          <CustomText>
            <MaterialIcons name="notifications" size={24} />
          </CustomText>
          <CustomText>Test</CustomText>
        </CustomView>
      </CustomView>
    </CustomModal>
  );
};

export default function Page() {
  const { currentScheme } = useTheme();

  const [searchModalVisibility, setSearchModalVisibility] = useState(false);
  const [notificationModalVisibility, setNotificationModalVisibility] =
    useState(false);

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <ForumHeader
        rightSideChildren={
          <>
            <Pressable onPress={() => setSearchModalVisibility(true)}>
              <CustomText>
                <FontAwesome5 name="search" size={20} />
              </CustomText>
            </Pressable>

            <Pressable onPress={() => setNotificationModalVisibility(true)}>
              <CustomText>
                <FontAwesome6 name="bell" size={22} />
              </CustomText>
            </Pressable>
          </>
        }
      />

      <CustomView variant="colorBase300" className="flex-1 px-4 py-4">
        <CustomView
          variant="colorBase100"
          className="flex gap-2 p-4 rounded-xl"
        >
          <View className="flex flex-row gap-3 items-center">
            <CustomText className="text-xl" color="colorBaseContent">
              <FontAwesome6 name="user-circle" size={20} />
            </CustomText>
            <CustomText
              variant="bold"
              className="text-xl"
              color="colorBaseContent"
            >
              Jhon Lloyd Viernes
            </CustomText>
          </View>
          <CustomView
            variant="colorBase200"
            className="flex flex-col gap-2 p-4 rounded-xl"
            style={{
              borderColor: currentScheme.colorBase300,
            }}
          ></CustomView>
        </CustomView>
      </CustomView>

      <Link asChild href={"/post/create"}>
        <CustomPressable
          variant="colorPrimary"
          className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
        >
          <CustomText color="colorPrimaryContent">
            <MaterialIcons name="post-add" size={32} />
          </CustomText>
        </CustomPressable>
      </Link>

      <SearchModal
        modalVisibility={searchModalVisibility}
        setModalVisibility={setSearchModalVisibility}
      />

      <NotificationModal
        modalVisibility={notificationModalVisibility}
        setModalVisibility={setNotificationModalVisibility}
      />
    </SafeAreaView>
  );
}
