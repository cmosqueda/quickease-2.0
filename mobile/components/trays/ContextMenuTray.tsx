import useAuth from "@/hooks/useAuth";
import CustomView from "../CustomView";
import CustomText from "../CustomText";
import * as Clipboard from "expo-clipboard";

import { MaterialIcons } from "@expo/vector-icons";

import { toast } from "sonner-native";
import { Pressable } from "react-native";

import _API_INSTANCE from "@/utils/axios";

const ContextMenuTray = ({
  id,
  type,
  close,
}: {
  id: string;
  type: "note" | "flashcard" | "quiz";
  close: () => void;
}) => {
  const { deleteFlashcard, deleteNote, deleteQuiz } = useAuth();

  const handleDeleteNote = async () => {
    try {
      const { status } = await _API_INSTANCE.delete("/notes/delete", {
        data: { note_id: id },
      });

      if (status === 200) {
        deleteNote(id);
        toast.success("Note deleted.");
        close();
      }
    } catch (err) {
      toast.error("Error deleting note.");
      throw err;
    }
  };

  const handleDeleteQuiz = async () => {
    try {
      const { status } = await _API_INSTANCE.delete(`/quiz/delete`, {
        data: {
          quiz_id: id,
        },
      });

      if (status === 200) {
        deleteQuiz(id);
        toast.success("Quiz deleted.");
        close();
      }
    } catch {
      toast.error("Failed to delete.");
      return;
    }
  };

  const handleDeleteFlashcard = async () => {
    try {
      const { status } = await _API_INSTANCE.delete("/flashcard/delete", {
        data: {
          flashcard_id: id,
        },
      });

      if (status === 200) {
        deleteFlashcard(id);
        toast.success("Flashcard deleted.");
        close();
      }
    } catch {
      toast.error("Error deleting flashcard.");
    }
  };

  const handleShare = async () => {
    if (type === "note") {
      const string = `https://quickease.online/learner/note/${id}`;
      await Clipboard.setStringAsync(string);
    }

    if (type === "flashcard") {
      const string = `https://quickease.online/learner/flashcards/${id}`;
      await Clipboard.setStringAsync(string);
    }

    if (type === "quiz") {
      const string = `https://quickease.online/learner/quizzes/${id}`;
      await Clipboard.setStringAsync(string);
    }

    toast.success("Link copied.");
    close();
  };

  return (
    <CustomView className="p-4 rounded-3xl gap-2" variant="colorBase100">
      <Pressable
        className="p-4 rounded-3xl flex flex-row gap-4 items-center"
        onPress={() => {
          if (type === "note") {
            handleDeleteNote();
          }

          if (type === "quiz") {
            handleDeleteQuiz();
          }

          if (type === "flashcard") {
            handleDeleteFlashcard();
          }
        }}
      >
        <CustomText>
          <MaterialIcons name="delete" size={24} />
        </CustomText>
        <CustomText>Delete</CustomText>
      </Pressable>
      <Pressable
        className="p-4 rounded-3xl flex flex-row gap-4 items-center"
        onPress={handleShare}
      >
        <CustomText>
          <MaterialIcons name="share" size={24} />
        </CustomText>
        <CustomText>Share link</CustomText>
      </Pressable>
    </CustomView>
  );
};

export default ContextMenuTray;
