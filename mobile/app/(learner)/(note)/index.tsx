import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Note } from "@/types/user/types";
import { Link } from "expo-router";
import { useTrays } from "react-native-trays";
import { useNetInfo } from "@react-native-community/netinfo";
import { MyTraysProps } from "@/types/trays/trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, View } from "react-native";

export default function Page() {
  const { isConnected } = useNetInfo();
  const { currentScheme } = useTheme();
  const { user } = useAuth();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  const { push: openContextMenu, pop: closeContextMenu } =
    useTrays<MyTraysProps>("ContextMenuTray");

  const [index, setIndex] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);

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
          isConnected && (
            <>
              <Pressable
                onPress={() =>
                  openTray("SummarizeNotesStudyToolsSelectionTray", {
                    openUploadImage: () => {
                      closeTray();
                      openTray("GenerateFromImageTray", {
                        close: closeTray,
                        type: "summary-notes",
                      });
                    },
                    openUploadDocument: () => {
                      closeTray();
                      openTray("GenerateFromDocumentTray", {
                        close: closeTray,
                        type: "summary-notes",
                      });
                    },
                    close: closeTray,
                  })
                }
              >
                <CustomText>
                  <MaterialCommunityIcons name="toolbox-outline" size={20} />
                </CustomText>
              </Pressable>
            </>
          )
        }
      />
      <CustomView
        variant="colorBase100"
        className="px-8 flex flex-row justify-evenly items-center relative gap-4"
      >
        <Pressable
          onPress={() => {
            setIndex(0);
            pagerViewRef.current?.setPage(0);
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center">All</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 0 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setIndex(1);
            pagerViewRef.current?.setPage(1);
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center">By recent</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 1 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setIndex(2);
            pagerViewRef.current?.setPage(2);
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center">AI-Generated</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 2 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
      </CustomView>
      <PagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        onPageSelected={(e) => {
          setIndex(e.nativeEvent.position);
        }}
      >
        <ScrollView
          contentContainerClassName="flex flex-col gap-4 px-4 py-4"
          className="rounded-tr-3xl rounded-tl-3xl"
          style={{ backgroundColor: currentScheme.colorBase300 }}
          key={0}
        >
          {user?.notes.map((note: Note) => (
            <Link
              asChild
              href={{
                pathname: "/(learner)/(note)/view/[id]",
                params: { id: note.id },
              }}
              key={note.id}
            >
              <Pressable
                className="disabled:opacity-70"
                disabled={!isConnected}
                onLongPress={() =>
                  openContextMenu("ContextMenuTray", {
                    close: closeContextMenu,
                    type: "note",
                    id: note.id,
                  })
                }
              >
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
        </ScrollView>
        <ScrollView
          contentContainerClassName="flex flex-col gap-4 px-4 py-4"
          className="rounded-tr-3xl rounded-tl-3xl"
          style={{ backgroundColor: currentScheme.colorBase300 }}
          key={1}
        >
          {[...(user?.notes ?? [])]
            .sort(
              (a: Note, b: Note) =>
                dayjs(b.updated_at).valueOf() - dayjs(a.updated_at).valueOf()
            )
            .map((note: Note) => (
              <Link
                asChild
                key={note.id}
                href={{
                  pathname: "/(learner)/(note)/view/[id]",
                  params: { id: note.id.toString() },
                }}
              >
                <Pressable
                  className="disabled:opacity-70"
                  disabled={!isConnected}
                  onLongPress={() =>
                    openContextMenu("ContextMenuTray", {
                      close: closeContextMenu,
                      type: "note",
                      id: note.id,
                    })
                  }
                >
                  <CustomView className="p-6 rounded-xl gap-2">
                    {note.is_ai_generated && (
                      <View className="flex flex-row gap-4 items-center">
                        <MaterialIcons name="info" size={18} />
                        <CustomText>AI-Generated</CustomText>
                      </View>
                    )}
                    <CustomText className="text-sm opacity-40">
                      {dayjs(note.updated_at).format("hh:mm A / MMMM DD, YYYY")}
                    </CustomText>
                    <CustomText variant="bold" className="text-3xl">
                      {note.title}
                    </CustomText>
                  </CustomView>
                </Pressable>
              </Link>
            ))}
        </ScrollView>
        <ScrollView
          contentContainerClassName="flex flex-col gap-4 px-4 py-4"
          className="rounded-tr-3xl rounded-tl-3xl"
          style={{ backgroundColor: currentScheme.colorBase300 }}
          key={2}
        >
          {user?.notes
            .filter((note: Note) => note.is_ai_generated === true)
            .map((note: Note) => (
              <Link
                asChild
                href={{
                  pathname: "/(learner)/(note)/view/[id]",
                  params: { id: note.id },
                }}
                key={note.id}
              >
                <Pressable
                  disabled={!isConnected}
                  className="disabled:opacity-70"
                  onLongPress={() =>
                    openContextMenu("ContextMenuTray", {
                      close: closeContextMenu,
                      type: "note",
                      id: note.id,
                    })
                  }
                >
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
        </ScrollView>
      </PagerView>

      {isConnected && (
        <Link asChild href={"/(learner)/(note)/create"}>
          <CustomPressable
            variant="colorPrimary"
            className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
          >
            <CustomText color="colorPrimaryContent">
              <MaterialIcons name="post-add" size={32} />
            </CustomText>
          </CustomPressable>
        </Link>
      )}
    </SafeAreaView>
  );
}
