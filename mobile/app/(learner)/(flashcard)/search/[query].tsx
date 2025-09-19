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

  /**
   * Memoized function that filters and sorts the user's flashcards based on the search query and sort order.
   * - If no flashcards or query are present, displays a toast notification and navigates back.
   * - Filters flashcards whose titles include the query string (case-insensitive).
   * - Sorts the filtered results by creation date, either newest or oldest first.
   *
   * @returns {Flashcard[]} The filtered and sorted array of flashcards.
   *
   * @dependency user?.flashcards - The user's flashcards to filter and sort.
   * @dependency query - The search query string.
   * @dependency sort - The sort order, either "newest" or another value for oldest.
   */
  const filteredFlashcards = useMemo(() => {
    if (!user?.flashcards || !query) {
      toast.info("No flashcards found.");
      return router.back();
    }

    const q = query.toLowerCase();

    let results = user.flashcards.filter((flashcard) => {
      const titleMatch = flashcard.title?.toLowerCase().includes(q);

      return titleMatch;
    });

    results = results.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return results;
  }, [user?.flashcards, query, sort]);

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
        items={filteredFlashcards!}
        isConnected={isConnected ?? false}
        openContextMenu={openContextMenu}
        closeContextMenu={closeContextMenu}
        background={currentScheme.colorBase300}
        type={"flashcard"}
      />
    </SafeAreaView>
  );
}
