/* eslint-disable react-hooks/rules-of-hooks */

import { Asset } from "expo-asset";
import { Comment, Post, User } from "../user/types";
import { Dispatch, SetStateAction } from "react";

import TagsTray from "@/components/trays/TagsTray";
import SearchTray from "@/components/trays/SearchTray";
import RepliesTray from "@/components/trays/RepliesTray";
import PomodoroTray from "@/components/trays/PomodoroTray";
import ChangeNameTray from "@/components/trays/ChangeNameTray";
import ChangeThemesTray from "@/components/trays/ChangeThemesTray";
import ChangeAvatarTray from "@/components/trays/ChangeAvatarTray";
import NotificationTray from "@/components/trays/NotificationTray";
import CommentOnPostTray from "@/components/trays/CommentOnPostTray";
import PomodoroSettingsTray from "@/components/trays/PomodoroSettingsTray";
import ViewOtherProfileTray from "@/components/trays/ViewOtherProfileTray";
import GenerateFromNotesTray from "@/components/trays/GenerateFromNotesTray";
import GenerateFromImageTray from "@/components/trays/GenerateFromImageTray";
import StudyToolsSelectionTray from "@/components/trays/StudyToolsSelectionTray";
import GenerateFromDocumentTray from "@/components/trays/GenerateFromDocumentTray";
import ViewPostAttachmentsTray from "@/components/trays/ViewPostAttachmentsTray";
import SummarizeNotesStudyToolsSelectionTray from "@/components/trays/SummarizeNotesStudyToolsSelectionTray";
import ChangeEmailTray from "@/components/trays/ChangeEmailTray";

export type MyTraysProps = {
  SearchTray: { close: () => void };
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
    type: "quiz" | "flashcard" | "summary-notes";
  };
  ViewPostAttachmentsTray: {
    close: () => void;
    post: Post;
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
};

export default _TRAYS;
