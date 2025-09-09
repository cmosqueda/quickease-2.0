import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import ListItem from "@/components/ListItem";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import FloatingButton from "@/components/buttons/FloatingButton";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Note } from "@/types/user/types";
import { router } from "expo-router";
import { useTrays } from "react-native-trays";
import { Pressable } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { MyTraysProps } from "@/types/trays/trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";

export default function Page() {
  const { isConnected } = useNetInfo();
  const { currentScheme } = useTheme();
  const { user } = useAuth();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );
  const useSearchTray = useTrays<MyTraysProps>("DismissibleStickToTopTray");

  const { push: openContextMenu, pop: closeContextMenu } =
    useTrays<MyTraysProps>("ContextMenuTray");

  const [index, setIndex] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);

  const tabs = [
    { label: "All", items: user?.notes },
    {
      label: "By recent",
      items: [...(user?.notes ?? [])].sort(
        (a: Note, b: Note) =>
          dayjs(b.updated_at).valueOf() - dayjs(a.updated_at).valueOf()
      ),
    },
    {
      label: "AI - Generated",
      items: user?.notes.filter((note: Note) => note.is_ai_generated === true),
    },
  ];

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
            <Pressable
              onPress={() =>
                useSearchTray.push("SearchTray", {
                  close: useSearchTray.pop,
                  type: "note",
                })
              }
            >
              <CustomText>
                <FontAwesome5 name="search" size={20} />
              </CustomText>
            </Pressable>
          </>
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
        {tabs.map((tab, i) => (
          <ListItem
            key={i}
            items={tab.items as Note[]}
            isConnected={isConnected ?? false}
            openContextMenu={openContextMenu}
            closeContextMenu={closeContextMenu}
            background={currentScheme.colorBase300}
            type={"note"}
          />
        ))}
      </PagerView>

      <FloatingButton
        option_one={
          <CustomPressable
            className="rounded-full"
            style={{ paddingHorizontal: 16, paddingVertical: 16 }}
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
            <CustomText color="colorPrimaryContent">
              <MaterialCommunityIcons name="toolbox" size={24} />
            </CustomText>
          </CustomPressable>
        }
        option_two={
          <CustomPressable
            className="rounded-full"
            style={{ paddingHorizontal: 16, paddingVertical: 16 }}
            onPress={() => router.push("/(learner)/(note)/create")}
          >
            <CustomText color="colorPrimaryContent">
              <MaterialIcons name="note-add" size={24} />
            </CustomText>
          </CustomPressable>
        }
        main_func={() => router.push("/(learner)/(note)/create")}
      />
    </SafeAreaView>
  );
}
