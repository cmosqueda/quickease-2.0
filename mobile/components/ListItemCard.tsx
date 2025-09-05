import dayjs from "dayjs";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Link } from "expo-router";
import { useTrays } from "react-native-trays";
import { Pressable, View } from "react-native";
import { Note, Flashcard, Quiz } from "@/types/user/types";

type Item = Note | Flashcard | Quiz;

export default function ListItemCard({
  item,
  isConnected,
  openContextMenu,
  closeContextMenu,
  type,
}: {
  item: Item;
  isConnected: boolean;
  type: "note" | "flashcard" | "quiz";
  openContextMenu: ReturnType<typeof useTrays>["push"];
  closeContextMenu: ReturnType<typeof useTrays>["pop"];
}) {
  return (
    <Link
      asChild
      href={{
        pathname: `/(
          learner
        )/(${type})/view/[id]` as any,
        params: { id: item.id },
      }}
    >
      <Pressable
        className="disabled:opacity-70"
        disabled={!isConnected}
        onLongPress={() =>
          openContextMenu("ContextMenuTray", {
            close: closeContextMenu,
            type,
            data: item,
          })
        }
      >
        <CustomView className="p-6 rounded-xl gap-2">
          {item.is_ai_generated && (
            <View className="flex flex-row gap-4 items-center">
              <CustomText>
                <MaterialIcons name="info" size={18} />
              </CustomText>
              <CustomText>AI-Generated</CustomText>
            </View>
          )}
          <CustomText className="text-sm opacity-40">
            {dayjs(item.updated_at).format("hh:mm A / MMMM DD, YYYY")}
          </CustomText>
          <CustomText variant="bold" className="text-3xl">
            {item.title}
          </CustomText>
        </CustomView>
      </Pressable>
    </Link>
  );
}
