import ListItemCard from "./ListItemCard";

import { useTrays } from "react-native-trays";
import { ScrollView } from "react-native";
import { Note, Flashcard, Quiz } from "@/types/user/types";

type Item = Note | Flashcard | Quiz;

export default function ListItem({
  items,
  isConnected,
  openContextMenu,
  closeContextMenu,
  background,
  type,
}: {
  items: Item[];
  isConnected: boolean;
  openContextMenu: ReturnType<typeof useTrays>["push"];
  closeContextMenu: ReturnType<typeof useTrays>["pop"];
  background: string;
  type: "note" | "flashcard" | "quiz";
}) {
  return (
    <ScrollView
      contentContainerClassName="flex flex-col gap-4 px-4 py-4"
      className="rounded-tr-3xl rounded-tl-3xl"
      style={{ backgroundColor: background }}
    >
      {items.map((item) => (
        <ListItemCard
          key={item.id}
          item={item}
          type={type}
          isConnected={isConnected}
          openContextMenu={openContextMenu}
          closeContextMenu={closeContextMenu}
        />
      ))}
    </ScrollView>
  );
}
