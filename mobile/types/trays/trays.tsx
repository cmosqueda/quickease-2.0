/* eslint-disable react-hooks/rules-of-hooks */

import { Asset } from "expo-asset";
import { Dispatch, SetStateAction } from "react";
import { Comment, Flashcard, Note, Post, Quiz, User } from "../user/types";

import TagsTray from "@/components/trays/TagsTray";
import SearchTray from "@/components/trays/SearchTray";
import RepliesTray from "@/components/trays/RepliesTray";
import PomodoroTray from "@/components/trays/PomodoroTray";
import ChangeNameTray from "@/components/trays/ChangeNameTray";
import EditCommentTray from "@/components/trays/EditCommentTray";
import ContextMenuTray from "@/components/trays/ContextMenuTray";
import ChangeEmailTray from "@/components/trays/ChangeEmailTray";
import ChangeThemesTray from "@/components/trays/ChangeThemesTray";
import ChangeAvatarTray from "@/components/trays/ChangeAvatarTray";
import NotificationTray from "@/components/trays/NotificationTray";
import CommentOnPostTray from "@/components/trays/CommentOnPostTray";
import PomodoroSettingsTray from "@/components/trays/PomodoroSettingsTray";
import ViewOtherProfileTray from "@/components/trays/ViewOtherProfileTray";
import GenerateFromNotesTray from "@/components/trays/GenerateFromNotesTray";
import GenerateFromImageTray from "@/components/trays/GenerateFromImageTray";
import StudyToolsSelectionTray from "@/components/trays/StudyToolsSelectionTray";
import ViewPostAttachmentsTray from "@/components/trays/ViewPostAttachmentsTray";
import GenerateFromDocumentTray from "@/components/trays/GenerateFromDocumentTray";
import PostAttachmentsSelectionTray from "@/components/trays/PostAttachmentsSelectionTray";
import SummarizeNotesStudyToolsSelectionTray from "@/components/trays/SummarizeNotesStudyToolsSelectionTray";

/**
 * Typesafe props for all tray components used in the application.
 * Each tray key matches a component in ./components/trays and is used with react-native-trays.
 */
export type MyTraysProps = {
  SearchTray: {
    close: () => void;
    type: "note" | "quiz" | "flashcard" | "forum";
  };
  NotificationTray: { close: () => void };
  PomodoroTray: {
    close: () => void;
    openSettings: () => void;
  };
  PomodoroSettingsTray: { back: () => void };
  TagsTray: {
    tags: any[];
    setTags: Dispatch<SetStateAction<any>>;
    close: () => void;
  };
  ChangeThemesTray: { close: () => void };
  ChangeAvatarTray: { avatars: Asset[]; close: () => void };
  ChangeNameTray: {
    close: () => void;
  };
  ChangeEmailTray: {
    close: () => void;
  };
  RepliesTray: {
    comment: Comment;
    close: () => void;
  };
  CommentOnPostTray: {
    post: Post;
    close: () => void;
  };
  EditCommentTray: {
    comment: Comment;
    close: () => void;
  };
  ViewOtherProfileTray: {
    user: User;
    close: () => void;
  };
  StudyToolsSelectionTray: {
    openGenerateFromNotes: () => void;
    openUploadFile: () => void;
    close: () => void;
    type: "quiz" | "flashcard";
  };
  SummarizeNotesStudyToolsSelectionTray: {
    openUploadDocument: () => void;
    openUploadImage: () => void;
    close: () => void;
  };
  GenerateFromNotesTray: {
    close: () => void;
    type: "quiz" | "flashcard";
  };
  GenerateFromDocumentTray: {
    close: () => void;
    type: "quiz" | "flashcard" | "summary-notes";
  };
  GenerateFromImageTray: {
    close: () => void;
    type: "quiz" | "flashcard" | "summary-notes";
  };
  ViewPostAttachmentsTray: {
    close: () => void;
    post: Post;
  };
  PostAttachmentsSelectionTray: {
    selectedFlashcards: Flashcard[];
    setSelectedFlashcards: Dispatch<SetStateAction<Flashcard[]>>;
    selectedNotes: Note[];
    setSelectedNotes: Dispatch<SetStateAction<Note[]>>;
    selectedQuizzes: Quiz[];
    setSelectedQuizzes: Dispatch<SetStateAction<Quiz[]>>;
    close: () => void;
  };
  ContextMenuTray: {
    type: "note" | "flashcard" | "quiz";
    close: () => void;
    id: string;
  };
};

const _TRAYS = {
  SearchTray: {
    component: SearchTray,
  },
  NotificationTray: {
    component: NotificationTray,
  },

  PomodoroTray: {
    component: PomodoroTray,
  },
  PomodoroSettingsTray: {
    component: PomodoroSettingsTray,
  },
  TagsTray: {
    component: TagsTray,
  },
  ChangeThemesTray: {
    component: ChangeThemesTray,
  },
  ChangeAvatarTray: {
    component: ChangeAvatarTray,
  },
  ChangeNameTray: {
    component: ChangeNameTray,
  },
  ChangeEmailTray: { component: ChangeEmailTray },
  RepliesTray: {
    component: RepliesTray,
  },
  CommentOnPostTray: {
    component: CommentOnPostTray,
  },
  EditCommentTray: {
    component: EditCommentTray,
  },
  ViewOtherProfileTray: {
    component: ViewOtherProfileTray,
  },
  StudyToolsSelectionTray: {
    component: StudyToolsSelectionTray,
  },
  SummarizeNotesStudyToolsSelectionTray: {
    component: SummarizeNotesStudyToolsSelectionTray,
  },
  GenerateFromNotesTray: {
    component: GenerateFromNotesTray,
  },
  GenerateFromDocumentTray: {
    component: GenerateFromDocumentTray,
  },
  GenerateFromImageTray: {
    component: GenerateFromImageTray,
  },
  ViewPostAttachmentsTray: {
    component: ViewPostAttachmentsTray,
  },
  PostAttachmentsSelectionTray: {
    component: PostAttachmentsSelectionTray,
  },
  ContextMenuTray: { component: ContextMenuTray },
};

export default _TRAYS;
