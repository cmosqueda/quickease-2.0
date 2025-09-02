import useAuth from "@/hooks/useAuth";

import CustomText from "../CustomText";
import CustomView from "../CustomView";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import {
  Dimensions,
  View,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";

import _API_INSTANCE from "@/utils/axios";

const NotificationTray = ({ close }: { close: () => void }) => {
  const { user } = useAuth();
  const { data, isFetching, refetch } = useQuery({
    queryKey: [user?.id, "user-notifications"],
    queryFn: async () => {
      try {
        const { data } =
          await _API_INSTANCE.get<Notification[]>("notifications");

        return data;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!user?.id,
  });

  return (
    <CustomView
      variant="colorBase100"
      style={{ height: Dimensions.get("screen").height / 1.1, gap: 8 }}
      className="p-8"
    >
      <CustomText>
        <MaterialIcons name="close" size={24} onPress={close} />
      </CustomText>
      <View className="flex flex-row items-center justify-between">
        <CustomText variant="bold" className="text-4xl">
          Notifications
        </CustomText>
        <Pressable>
          <CustomText>
            <MaterialCommunityIcons name="refresh" size={24} />
          </CustomText>
        </Pressable>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="gap-4"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={useTheme.getState().currentScheme.colorPrimaryContent}
            titleColor={useTheme.getState().currentScheme.colorPrimaryContent}
            colors={[useTheme.getState().currentScheme.colorPrimaryContent]}
            progressBackgroundColor={
              useTheme.getState().currentScheme.colorPrimary
            }
          />
        }
        renderItem={({ item }) => (
          <CustomView
            variant="colorBase200"
            className="p-6 flex flex-row gap-4 items-center rounded-xl"
          >
            <CustomText>
              <MaterialIcons name="notifications" size={24} />
            </CustomText>
            <CustomText className="flex-1">{item.message}</CustomText>
          </CustomView>
        )}
      />
    </CustomView>
  );
};

export default NotificationTray;
