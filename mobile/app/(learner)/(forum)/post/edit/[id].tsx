import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";
import CustomTextInput from "@/components/CustomTextInput";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { toast } from "sonner-native";
import { useTrays } from "react-native-trays";
import { checkBadges } from "@/types/user/badges";
import { useEditPost } from "@/hooks/useEditPost";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { useDeletePost } from "@/hooks/useDeletePost";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Flashcard, Note, Post, Quiz, Tag } from "@/types/user/types";

import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";

import {
  RichText,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";

import _FONTS from "@/types/theme/Font";
import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";

export default function Page() {
  const queryClient = useQueryClient();
  const tagsTray = useTrays<MyTraysProps>("DismissibleStickToTopTray");
  const selectionTray = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const { currentScheme } = useTheme();

  const { mutate: updatePost, isPending: updatingPost } = useEditPost();
  const { mutate: deletePost, isPending: deletingPost } = useDeletePost();

  const [isToolbarHidden, setToolbarVisibility] = useState(true);

  const { data: post } = useQuery({
    queryKey: ["view-post", id],
    queryFn: async () => {
      const { data } = await _API_INSTANCE.get<Post>(`/forum/post/${id}`);
      return data;
    },
  });

  const [title, setTitle] = useState("");

  const editor = useEditorBridge({
    theme: {
      webview: {
        padding: 8,
        backgroundColor: currentScheme.colorBase100,
      },
    },
    bridgeExtensions: _EDITOR_BRIDGE_EXTENSIONS,
    dynamicHeight: true,
    editable: true,
  });

  const editorContent = useEditorContent(editor, { type: "html" });

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<Quiz[]>([]);
  const [selectedFlashcards, setSelectedFlashcards] = useState<Flashcard[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Title is required.");
      return;
    }

    if (!editorContent?.trim()) {
      toast.warning("Post content is empty.");
      return;
    }

    setIsSaving(true);

    try {
      updatePost({ body: editorContent, title: title, post_id: id });

      await checkBadges();
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
      queryClient.invalidateQueries({ queryKey: ["view-post", id] });

      toast.success("Post updated.");

      router.push({
        pathname: "/(learner)/(forum)/post/view/[id]",
        params: { id: id },
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      deletePost({ post_id: id });

      await checkBadges();
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
      queryClient.invalidateQueries({ queryKey: ["view-post", id] });

      toast.success("Post deleted.");

      router.back();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "An error occurred.");
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (editor.getEditorState().isFocused) {
          setToolbarVisibility(false);
        }
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (editor.getEditorState().isFocused) {
          setToolbarVisibility(true);
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []); // used for hiding the toolbar | might be unstable, tabanggg buset nga tiptap kinia.

  useEffect(() => {
    if (!post) return;

    setTitle(post.title);

    setTags(post.tags?.map((t) => t.tag) ?? []);

    const notes: Note[] = [];
    const flashcards: Flashcard[] = [];
    const quizzes: Quiz[] = [];

    post.attachments?.forEach((a) => {
      if (a.resource_type === "NOTE" && a.note) notes.push(a.note);
      if (a.resource_type === "FLASHCARD" && a.flashcard)
        flashcards.push(a.flashcard);
      if (a.resource_type === "QUIZ" && a.quiz) quizzes.push(a.quiz);
    });

    setSelectedNotes(notes);
    setSelectedFlashcards(flashcards);
    setSelectedQuizzes(quizzes);

    if (post.post_body) {
      editor.setContent(post.post_body);
    }
  }, [post]);

  if (!post) {
    return (
      <SafeAreaView
        className="flex flex-1 p-4 gap-2"
        edges={["left", "right", "top"]}
        style={{ backgroundColor: currentScheme.colorBase100 }}
      ></SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex flex-1 p-4 gap-2"
      edges={["left", "right", "top"]}
      style={{ backgroundColor: currentScheme.colorBase100 }}
    >
      <View className="flex flex-row gap-2 items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <View className="flex flex-row gap-4 items-center">
          <CustomPressable
            onPress={handleDelete}
            className="rounded-3xl disabled:opacity-60"
            variant="colorBase300"
            disabled={deletingPost}
          >
            <CustomText>
              <MaterialCommunityIcons name="delete" size={20} />
            </CustomText>
          </CustomPressable>
          <CustomPressable
            className="rounded-3xl disabled:opacity-60"
            variant="colorBase300"
            disabled={isSaving}
            onPress={handleSave}
          >
            <CustomText>
              <MaterialCommunityIcons name="send" size={20} />
            </CustomText>
          </CustomPressable>
        </View>
      </View>
      <CustomTextInput
        style={{
          backgroundColor: "",
          paddingHorizontal: 0,
          fontFamily: _FONTS.Gabarito_900Black,
        }}
        className="text-4xl"
        placeholder="Title"
        multiline
        value={title}
        onChangeText={setTitle}
      />
      <View className="hidden flex-row gap-2">
        <CustomPressable
          variant="colorBase300"
          className="rounded-3xl flex flex-row gap-3 items-center"
          onPress={() =>
            tagsTray.push("TagsTray", {
              tags: tags,
              setTags: setTags,
              close: tagsTray.pop,
            })
          }
        >
          <CustomText>
            <AntDesign name="tags" size={20} />
          </CustomText>
          <CustomText>Add tags</CustomText>
        </CustomPressable>

        <CustomPressable
          className="flex flex-row gap-3 items-center rounded-3xl"
          variant="colorBase300"
          onPress={() => {
            selectionTray.push("PostAttachmentsSelectionTray", {
              close: selectionTray.pop,
              selectedFlashcards,
              selectedNotes,
              selectedQuizzes,
              setSelectedFlashcards,
              setSelectedNotes,
              setSelectedQuizzes,
            });
          }}
        >
          <CustomText>
            <AntDesign name="profile" size={20} />
          </CustomText>
          <CustomText>Add attachments</CustomText>
        </CustomPressable>
      </View>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior="position"
        style={{ position: "absolute", width: width, bottom: 0 }}
      >
        <Toolbar
          editor={editor}
          shouldHideDisabledToolbarItems
          hidden={isToolbarHidden}
        />
      </KeyboardAvoidingView>
      <View className="flex-1" />
    </SafeAreaView>
  );
}
