/* eslint-disable @typescript-eslint/no-explicit-any */
import NotificationsDropdown from "@/components/(learner)/NotificationsDropdown";
import ProfileDropdown from "@/components/(learner)/ProfileDropdown";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import CustomEditor from "@/components/Editor";
import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";
import dayjs from "dayjs";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  FileQuestion,
  GalleryVertical,
  MessageCircle,
  Notebook,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Editor, EditorProvider, useEditor } from "@tiptap/react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useVote } from "@/hooks/useVote";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";

type PostModalProps = {
  html: string;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  editor?: Editor;
};

const PostModal = ({ html, title, setTitle, editor }: PostModalProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tabIndex, setTabIndex] = useState(0);

  const [selectedNotes, setSelectedNotes] = useState<any[]>([]);
  const [selectedFlashcards, setSelectedFlashcards] = useState<any[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<any[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const closeModal = () => {
    const modal = document.getElementById(
      "create-post-modal"
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Title is required.");
      return;
    }

    if (!html.trim()) {
      toast.warning("Post content is empty.");
      return;
    }

    setIsSaving(true);

    try {
      const attachments = [
        ...selectedNotes.map((n) => ({
          resource_type: "NOTE" as const,
          resource_id: n.id,
        })),
        ...selectedFlashcards.map((f) => ({
          resource_type: "FLASHCARD" as const,
          resource_id: f.id,
        })),
        ...selectedQuizzes.map((q) => ({
          resource_type: "QUIZ" as const,
          resource_id: q.id,
        })),
      ];

      const { status } = await _API_INSTANCE.post(
        "/forum/post/create",
        {
          body: html,
          title,
          attachments,
        },
        {
          timeout: 10000,
        }
      );

      if (status === 200) {
        queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
        toast.success("Post created successfully.");
        closeModal();
      } else {
        toast.error("Failed to create post. Try again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  const tabs = [
    <>
      <div className="modal-box bg-base-300 flex flex-col gap-4 max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={closeModal}
            className="p-1 rounded hover:bg-base-100"
            aria-label="Close modal"
          >
            <X className="cursor-pointer" />
          </button>
          <h1 className="font-bold text-xl">Create post</h1>
        </div>

        {/* Title Field */}
        <fieldset className="fieldset">
          <input
            type="text"
            className="input w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSaving}
          />
          <p className="label text-sm text-gray-500">Required</p>
        </fieldset>

        {/* Rich Text Editor */}
        <CustomEditor editor={editor!} style="overflow-y-auto" />
        <div className="flex flex-row gap-4 items-center">
          <button
            className="btn btn-neutral btn-ghost flex-1"
            onClick={() => setTabIndex(1)}
          >
            <Notebook />
            <p>Attach notes</p>
          </button>
          <button
            className="btn btn-neutral btn-ghost flex-1"
            onClick={() => setTabIndex(2)}
          >
            <GalleryVertical />
            <p>Attach flashcards</p>
          </button>
          <button
            className="btn btn-neutral btn-ghost flex-1"
            onClick={() => setTabIndex(3)}
          >
            <FileQuestion />
            <p>Attach quizzes</p>
          </button>
        </div>

        {(selectedNotes.length > 0 ||
          selectedFlashcards.length > 0 ||
          selectedQuizzes.length > 0) && (
          <div className="flex flex-row items-center gap-4 overflow-x-auto">
            {selectedNotes.map((n) => (
              <div className="flex flex-row gap-4 items-center bg-base-200 rounded-3xl p-4 h-[5rem] w-[12rem] overflow-clip">
                <Notebook className="shrink-0" />
                {n.title}
              </div>
            ))}
            {selectedFlashcards.map((f) => (
              <div className="flex flex-row gap-4 items-center bg-base-200 rounded-3xl p-4 h-[5rem] w-[12rem] overflow-clip">
                <GalleryVertical className="shrink-0" />
                {f.title}
              </div>
            ))}
            {selectedQuizzes.map((q) => (
              <div className="flex flex-row gap-4 items-center bg-base-200 rounded-3xl p-4 h-[5rem] w-[12rem] overflow-clip">
                <FileQuestion className="shrink-0" />
                {q.title}
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          className="btn btn-success mt-2"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? (
            <span className="loading loading-spinner" />
          ) : (
            <p>Post</p>
          )}
        </button>
      </div>
    </>,
    <>
      <div className="modal-box bg-base-300 flex flex-col gap-4 max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => setTabIndex(0)}
            className="p-1 rounded hover:bg-base-100"
            aria-label="Close modal"
          >
            <ArrowLeft className="cursor-pointer" />
          </button>
          <h1 className="font-bold text-xl">Attach notes</h1>
        </div>

        {/* Notes */}
        <div className="grid grid-cols-2 gap-4">
          {user &&
            user.notes.map((note) => {
              const isSelected = selectedNotes.some((n) => n.id === note.id);
              return (
                <button
                  key={note.id}
                  className="flex flex-row p-4 rounded-xl cursor-pointer bg-base-200 relative"
                  onClick={() => {
                    setSelectedNotes((prev) =>
                      isSelected
                        ? prev.filter((n) => n.id !== note.id)
                        : [...prev, note]
                    );
                  }}
                >
                  {isSelected && (
                    <Check size={16} className="absolute right-4" />
                  )}
                  <h1 className="font-bold text-2xl">{note.title}</h1>
                </button>
              );
            })}
        </div>

        <button className="btn btn-success">
          <Plus />
          <p>Add</p>
        </button>
      </div>
    </>,
    <>
      <div className="modal-box bg-base-300 flex flex-col gap-4 max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => setTabIndex(0)}
            className="p-1 rounded hover:bg-base-100"
            aria-label="Close modal"
          >
            <ArrowLeft className="cursor-pointer" />
          </button>
          <h1 className="font-bold text-xl">Attach flashcards</h1>
        </div>

        {/* Flashcards */}
        <div className="grid grid-cols-2 gap-4">
          {user &&
            user.flashcards.map((flashcard) => {
              const isSelected = selectedFlashcards.some(
                (f) => f.id === flashcard.id
              );
              return (
                <button
                  key={flashcard.id}
                  className="flex flex-row p-4 rounded-xl cursor-pointer bg-base-200 relative"
                  onClick={() => {
                    setSelectedFlashcards((prev) =>
                      isSelected
                        ? prev.filter((f) => f.id !== flashcard.id)
                        : [...prev, flashcard]
                    );
                  }}
                >
                  {isSelected && (
                    <Check size={16} className="absolute right-4" />
                  )}
                  <h1 className="font-bold text-2xl">{flashcard.title}</h1>
                </button>
              );
            })}
        </div>

        <button className="btn btn-success">
          <Plus />
          <p>Add</p>
        </button>
      </div>
    </>,
    <>
      <div className="modal-box bg-base-300 flex flex-col gap-4 max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => setTabIndex(0)}
            className="p-1 rounded hover:bg-base-100"
            aria-label="Close modal"
          >
            <ArrowLeft className="cursor-pointer" />
          </button>
          <h1 className="font-bold text-xl">Attach quizzes</h1>
        </div>

        {/* Quizzes */}
        <div className="grid grid-cols-2 gap-4">
          {user &&
            user.quizzes.map((quiz) => {
              const isSelected = selectedQuizzes.some((q) => q.id === quiz.id);
              return (
                <button
                  key={quiz.id}
                  onClick={() => {
                    setSelectedQuizzes((prev) =>
                      isSelected
                        ? prev.filter((q) => q.id !== quiz.id)
                        : [...prev, quiz]
                    );
                  }}
                  className="flex flex-row p-4 rounded-xl cursor-pointer bg-base-200 relative"
                >
                  {isSelected && (
                    <Check size={16} className="absolute right-4" />
                  )}
                  <h1 className="font-bold text-2xl">{quiz.title}</h1>
                </button>
              );
            })}
        </div>

        <button className="btn btn-success">
          <Plus />
          <p>Add</p>
        </button>
      </div>
    </>,
  ];

  return (
    <dialog id="create-post-modal" className="modal">
      {tabs[tabIndex]}
    </dialog>
  );
};

const Post = ({
  post,
}: {
  post: {
    id: string;
    title: string;
    post_body: string;
    created_at: string;
    vote_sum: number;
    user_vote: number;
    user: {
      id: string;
      first_name: string;
      last_name: string;
    };
    comments: { id: string }[];
  };
}) => {
  const { mutate: vote } = useVote();

  const fullName = `${post?.user?.first_name ?? "Unknown"} ${
    post?.user?.last_name ?? "User"
  }`;

  const formattedDate = dayjs(post.created_at).isValid()
    ? dayjs(post.created_at).format("MMMM DD, YYYY")
    : "Unknown date";

  const handleVote = (vote_type: number) => {
    if (post.user_vote === vote_type) {
      toast("Already voted.");
      return;
    }

    vote({
      post_id: post.id,
      vote_type,
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-[32px] h-[32px] rounded-full bg-base-100" />
          <NavLink
            to={`/learner/profile/${post.user.id}`}
            className="font-semibold"
          >
            {fullName}
          </NavLink>
          <p className="text-sm text-gray-500">/ {formattedDate}</p>
        </div>

        <details className="dropdown dropdown-end">
          <summary className="list-none cursor-pointer">
            <EllipsisVertical
              className="rounded-full p-2 border border-base-200"
              size={36}
            />
          </summary>
          <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-10 w-52 p-2 my-2 shadow-sm">
            <li>
              <button type="button">Report</button>
            </li>
          </ul>
        </details>
      </div>

      {/* Post body */}
      <NavLink
        to={`/learner/post/${post.id}`}
        viewTransition
        className="transition-all duration-300 p-4 rounded-3xl bg-base-100 hover:bg-base-300 border border-base-200 hover:shadow"
      >
        <h1 className="text-3xl font-bold mb-2">{post.title || "Untitled"}</h1>
        <EditorProvider
          content={post.post_body}
          extensions={_TIPTAP_EXTENSIONS}
          editable={false}
        />
      </NavLink>

      {/* Footer */}
      <div className="flex flex-row gap-4 mt-2">
        <div className="flex flex-row items-center gap-2 p-3 rounded-3xl bg-base-100 border border-base-200">
          <ChevronUp
            className={clsx(
              "cursor-pointer hover:text-green-500",
              post.user_vote === 1 ? "text-green-600" : ""
            )}
            onClick={() => handleVote(1)}
          />
          <p className="text-sm">{post.vote_sum ?? 0}</p>
          <ChevronDown
            className={clsx(
              "cursor-pointer hover:text-red-500",
              post.user_vote === -1 ? "text-red-600" : ""
            )}
            onClick={() => handleVote(-1)}
          />
        </div>
        <NavLink
          to={`/learner/post/${post.id}`}
          viewTransition
          className="flex flex-row items-center gap-2 px-6 py-3 rounded-3xl bg-base-100 border border-base-200 cursor-pointer hover:bg-base-300 transition"
        >
          <MessageCircle />
          <p className="text-sm">{post.comments?.length ?? 0}</p>
        </NavLink>
      </div>
    </div>
  );
};

export default function LearnerForumPage() {
  const [title, setTitle] = useState("");
  const [html, setHTML] = useState("");

  const editor = useEditor({
    editable: true,
    autofocus: true,
    extensions: _TIPTAP_EXTENSIONS,
    content: "",
    onUpdate: ({ editor }) => {
      setHTML(editor.getHTML());
    },
  });

  const { data } = useInfiniteQuery({
    queryKey: ["recent-posts"],
    queryFn: async ({ pageParam = null }) => {
      const { data: posts } = await _API_INSTANCE.get("/forum/posts/recent", {
        params: { cursor: pageParam, limit: 10 },
      });

      console.log(posts);
      return posts;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? null;
    },
    retry: false,
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-row items-center justify-between gap-8">
        <label className="input w-full lg:w-fit">
          <Search size={24} />
          <input type="search" className="lg:w-md" placeholder="Search" />
        </label>
        <div className="hidden lg:flex flex-row gap-2">
          <button
            className="btn btn-neutral"
            onClick={() => {
              document.getElementById("create-post-modal").showModal();
            }}
          >
            <Plus />
            <p>Create</p>
          </button>
          <NotificationsDropdown />
          <ProfileDropdown />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {data?.pages.flatMap((page) =>
          page.posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>
      <PostModal
        editor={editor!}
        html={html}
        setTitle={setTitle}
        title={title}
      />
    </div>
  );
}
