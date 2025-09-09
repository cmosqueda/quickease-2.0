import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import ListItem from "@/components/ListItem";
import CustomText from "@/components/CustomText";

import { MaterialIcons } from "@expo/vector-icons";

import { toast } from "sonner-native";
import { useTrays } from "react-native-trays";
import { useNetInfo } from "@react-native-community/netinfo";
import { MyTraysProps } from "@/types/trays/trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Pressable } from "react-native";
import { useMemo, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";

export default function Page() {
  const { currentScheme } = useTheme();
  const { user } = useAuth();
  const { query } = useLocalSearchParams<{ query: string }>();
  const [sort, setSort] = useState("newest");
  const { isConnected } = useNetInfo();

  const { push: openContextMenu, pop: closeContextMenu } =
    useTrays<MyTraysProps>("ContextMenuTray");

  const filteredQuizzes = useMemo(() => {
    if (!user?.quizzes || !query) {
      toast.info("No quizzes found.");
      return router.back();
    }

    const q = query.toLowerCase();

    let results = user.quizzes.filter((quiz) => {
      const titleMatch = quiz.title?.toLowerCase().includes(q);

      return titleMatch;
    });

    results = results.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return results;
  }, [user?.quizzes, query, sort]);

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <View className="flex flex-row gap-4 items-center p-4">
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <View>
          <CustomText className="text-sm opacity-60">Searched for</CustomText>
          <CustomText className="text-xl" variant="bold">
            {query.toString()}
          </CustomText>
        </View>
      </View>
      <ListItem
        items={filteredQuizzes!}
        isConnected={isConnected ?? false}
        openContextMenu={openContextMenu}
        closeContextMenu={closeContextMenu}
        background={currentScheme.colorBase300}
        type={"quiz"}
      />
    </SafeAreaView>
  );
}
