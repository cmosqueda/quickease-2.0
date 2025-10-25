import useAuth from "@/hooks/useAuth";
import CustomView from "../CustomView";
import CustomText from "../CustomText";
import * as Clipboard from "expo-clipboard";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { toast } from "sonner-native";
import { Pressable } from "react-native";
import { Flashcard, Note, Quiz } from "@/types/user/types";

import _API_INSTANCE from "@/utils/axios";

const ContextMenuTray = ({
  data,
  type,
  close,
}: {
  data: Note | Flashcard | Quiz;
  type: "note" | "flashcard" | "quiz";
  close: () => void;
}) => {
  const { deleteFlashcard, deleteNote, deleteQuiz } = useAuth();

  const handleDeleteNote = async () => {
    try {
      const { status } = await _API_INSTANCE.delete("/notes/delete", {
        data: { note_id: data.id },
      });

      if (status === 200) {
        deleteNote(data.id);
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
          quiz_id: data.id,
        },
      });

      if (status === 200) {
        deleteQuiz(data.id);
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
          flashcard_id: data.id,
        },
      });

      if (status === 200) {
        deleteFlashcard(data.id);
        toast.success("Flashcard deleted.");
        close();
      }
    } catch {
      toast.error("Error deleting flashcard.");
    }
  };

  const handleToggleVisibility = async () => {
    const { editNote, editQuiz, editFlashcard } = useAuth.getState();

    const prevVisibility = data.is_public;
    const newVisibility = !prevVisibility;

    const optimisticUpdate = () => {
      if (type === "note") editNote({ id: data.id, is_public: newVisibility });
      if (type === "flashcard")
        editFlashcard({ id: data.id, is_public: newVisibility });
      if (type === "quiz") editQuiz({ id: data.id, is_public: newVisibility });
    };

    const rollbackUpdate = () => {
      if (type === "note") {
        editNote({ id: data.id, is_public: prevVisibility });
      }
      if (type === "flashcard") {
        editFlashcard({ id: data.id, is_public: prevVisibility });
      }
      if (type === "quiz") {
        editQuiz({ id: data.id, is_public: prevVisibility });
      }
    };

    try {
      optimisticUpdate();

      if (type === "note") {
        await _API_INSTANCE.patch(
          "/notes/toggle-visibility",
          { visibility: newVisibility, note_id: data.id },
          { timeout: 8 * 60 * 1000 }
        );
        toast.success("Note visibility updated.");
      }

      if (type === "flashcard") {
        await _API_INSTANCE.put(
          "/flashcard/toggle-visibility",
          { visibility: newVisibility, flashcard_id: data.id },
          { timeout: 8 * 60 * 1000 }
        );
        toast.success("Flashcard visibility updated.");
      }

      if (type === "quiz") {
        await _API_INSTANCE.put(
          "/quiz/toggle-visibility",
          {
            visibility: newVisibility,
            quiz_id: data.id,
          },
          { timeout: 8 * 60 * 1000 }
        );

        toast.success("Quiz visibility updated.");
      }

      close();
    } catch {
      rollbackUpdate();
      toast.error("Error updating visibility.");
    }
  };

  const handleShare = async () => {
    if (type === "note") {
      const string = `https://quickease.online/learner/note/${data.id}`;
      await Clipboard.setStringAsync(string);
    }

    if (type === "flashcard") {
      const string = `https://quickease.online/learner/flashcards/${data.id}`;
      await Clipboard.setStringAsync(string);
    }

    if (type === "quiz") {
      const string = `https://quickease.online/learner/quizzes/${data.id}`;
      await Clipboard.setStringAsync(string);
    }

    toast.success("Link copied.");
    close();
  };

  return (
    <CustomView className="p-4 rounded-3xl gap-2" variant="colorBase100">
      {/* <Pressable
        className="p-4 rounded-3xl flex flex-row gap-4 items-center"
        onPress={handleToggleVisibility}
      >
        <CustomText>
          <MaterialCommunityIcons
            name={data.is_public ? "eye-off" : "eye"}
            size={24}
          />
        </CustomText>
        <CustomText>Set to {data.is_public ? "private" : "public"}</CustomText>
      </Pressable> */}
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
      {data.is_public && (
        <Pressable
          className="p-4 rounded-3xl flex flex-row gap-4 items-center"
          onPress={handleShare}
        >
          <CustomText>
            <MaterialIcons name="share" size={24} />
          </CustomText>
          <CustomText>Share link</CustomText>
        </Pressable>
      )}
    </CustomView>
  );
};

export default ContextMenuTray;
