import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Note } from "@/types/user/types";
import { Link } from "expo-router";
import { useTrays } from "react-native-trays";
import { MyTraysProps } from "@/types/trays/trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";

export default function Page() {
  const { currentScheme } = useTheme();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );
  const { user } = useAuth();

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <ForumHeader
        title="Notes"
        rightSideChildren={
          <>
            <CustomText>
              <MaterialIcons
                name="filter-list"
                size={20}
                onPress={() =>
                  openTray("FilterNotesTray", { close: closeTray })
                }
              />
            </CustomText>
          </>
        }
      />
      <CustomView
        variant="colorBase300"
        className="flex flex-col gap-4 flex-1 px-4 py-4 rounded-tr-3xl rounded-tl-3xl"
      >
        {user?.notes.map((note: Note) => (
          <Link
            asChild
            href={{
              pathname: "/(learner)/(note)/(view)/[id]",
              params: { id: note.id },
            }}
            key={note.id}
          >
            <Pressable>
              <CustomView className="p-6 rounded-xl gap-2">
                {note.is_ai_generated && (
                  <View className="flex flex-row gap-4 items-center">
                    <CustomText>
                      <MaterialIcons name="info" size={18} />
                    </CustomText>
                    <CustomText>AI-Generated</CustomText>
                  </View>
                )}
                <CustomText className="text-sm opacity-40">
                  {dayjs(note.updated_at)
                    .format("hh:mm A / MMMM DD, YYYY")
                    .toString()}
                </CustomText>
                <CustomText variant="bold" className="text-3xl">
                  {note.title}
                </CustomText>
              </CustomView>
            </Pressable>
          </Link>
        ))}
      </CustomView>

      <Link asChild href={"create"}>
        <CustomPressable
          variant="colorPrimary"
          className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
        >
          <CustomText color="colorPrimaryContent">
            <MaterialIcons name="post-add" size={32} />
          </CustomText>
        </CustomPressable>
      </Link>
    </SafeAreaView>
  );
}
