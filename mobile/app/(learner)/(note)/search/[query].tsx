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
   * Filters and sorts the user's notes based on the provided query and sort order.
   *
   * - If there are no notes or the query is empty, displays a toast notification and navigates back.
   * - Filters notes by matching the query against the note's title or content (HTML tags are stripped from content).
   * - Sorts the filtered notes by creation date, either newest or oldest first, depending on the `sort` value.
   *
   * @returns {Note[]} The filtered and sorted array of notes.
   *
   * @dependency user?.notes - The list of notes to filter and sort.
   * @dependency query - The search query string.
   * @dependency sort - The sort order, either "newest" or "oldest".
   */
  const filteredNotes = useMemo(() => {
    if (!user?.notes || !query) {
      toast.info("No notes found.");
      return router.back();
    }

    const q = query.toLowerCase();

    let results = user.notes.filter((note) => {
      const titleMatch = note.title?.toLowerCase().includes(q);
      const contentMatch = note.notes_content
        ?.replace(/<[^>]+>/g, "")
        .toLowerCase()
        .includes(q);

      return titleMatch || contentMatch;
    });

    results = results.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return results;
  }, [user?.notes, query, sort]);

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
        items={filteredNotes!}
        isConnected={isConnected ?? false}
        openContextMenu={openContextMenu}
        closeContextMenu={closeContextMenu}
        background={currentScheme.colorBase300}
        type={"note"}
      />
    </SafeAreaView>
  );
}
