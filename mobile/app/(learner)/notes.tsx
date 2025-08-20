import useTheme from "@/hooks/useTheme";
import CustomModal from "@/components/CustomModal";
import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { currentScheme } = useTheme();
  const { height } = useWindowDimensions();

  const [displaySettings, setDisplaySettings] = useState("grid");
  const [modalVisibility, setModalVisibility] = useState(false);

  if (displaySettings === "grid") {
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
                  onPress={() => setModalVisibility(true)}
                />
              </CustomText>
              <CustomText>
                {displaySettings !== "grid" ? (
                  <MaterialIcons
                    name="grid-view"
                    size={20}
                    onPress={() => setDisplaySettings("grid")}
                  />
                ) : (
                  <MaterialIcons
                    name="list-alt"
                    size={20}
                    onPress={() => setDisplaySettings("list")}
                  />
                )}
              </CustomText>
            </>
          }
        />
        <CustomView
          variant="colorBase300"
          className="flex-row flex-wrap gap-4 flex-1 px-4 py-4"
        >
          <CustomView className="flex-0 p-6 rounded-xl gap-2">
            <CustomText className="text-sm opacity-40">01/01/1970</CustomText>
            <CustomText variant="bold" className="text-3xl">
              Title
            </CustomText>
          </CustomView>
        </CustomView>
        <CustomModal
          modalVisibility={modalVisibility}
          setModalVisibility={setModalVisibility}
        >
          <CustomView
            variant="colorBase100"
            style={{ height: height / 2, gap: 8 }}
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
              Filter
            </CustomText>
          </CustomView>
        </CustomModal>
        <CustomPressable
          variant="colorPrimary"
          className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
        >
          <CustomText color="colorPrimaryContent">
            <MaterialIcons name="post-add" size={32} />
          </CustomText>
        </CustomPressable>
      </SafeAreaView>
    );
  }

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
                onPress={() => setModalVisibility(true)}
              />
            </CustomText>
            <CustomText>
              {displaySettings !== "grid" ? (
                <MaterialIcons
                  name="grid-view"
                  size={20}
                  onPress={() => setDisplaySettings("grid")}
                />
              ) : (
                <MaterialIcons
                  name="list-alt"
                  size={20}
                  onPress={() => setDisplaySettings("list")}
                />
              )}
            </CustomText>
          </>
        }
      />
      <CustomView
        variant="colorBase300"
        className="flex flex-col gap-4 flex-1 px-4 py-4"
      >
        <CustomView className="flex-0 p-6 rounded-xl gap-2">
          <CustomText className="text-sm opacity-40">01/01/1970</CustomText>
          <CustomText variant="bold" className="text-3xl">
            Title
          </CustomText>
        </CustomView>
      </CustomView>
      <CustomModal
        modalVisibility={modalVisibility}
        setModalVisibility={setModalVisibility}
      >
        <CustomView
          variant="colorBase100"
          style={{ height: height / 2, gap: 8 }}
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
            Filter
          </CustomText>
        </CustomView>
      </CustomModal>
      <CustomPressable
        variant="colorPrimary"
        className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
      >
        <CustomText color="colorPrimaryContent">
          <MaterialIcons name="post-add" size={32} />
        </CustomText>
      </CustomPressable>
    </SafeAreaView>
  );
}
