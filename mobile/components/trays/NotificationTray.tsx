import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomView from "../CustomView";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { Notification, NotificationType } from "@/types/user/types";

import { router } from "expo-router";
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
  const { currentScheme } = useTheme();
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
            tintColor={currentScheme.colorPrimaryContent}
            titleColor={currentScheme.colorPrimaryContent}
            colors={[currentScheme.colorPrimaryContent]}
            progressBackgroundColor={currentScheme.colorPrimary}
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (item.resource_id) {
                router.push({
                  pathname: "/(learner)/(forum)/post/view/[id]",
                  params: { id: item.resource_id },
                });
                close();
              }
            }}
          >
            <CustomView
              variant="colorBase200"
              className="p-6 flex flex-row gap-4 items-center rounded-xl"
            >
              <CustomText>
                <MaterialIcons name="notifications" size={24} />
              </CustomText>
              <CustomText className="flex-1">{item.message}</CustomText>
            </CustomView>
          </Pressable>
        )}
      />
    </CustomView>
  );
};

export default NotificationTray;
