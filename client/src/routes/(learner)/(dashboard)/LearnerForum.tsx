import NotificationsDropdown from "@/components/(learner)/NotificationsDropdown";
import ProfileDropdown from "@/components/(learner)/ProfileDropdown";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import CustomEditor from "@/components/Editor";
import _API_INSTANCE from "@/utils/axios";
import clsx from "clsx";
import dayjs from "dayjs";

import {
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  MessageCircle,
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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      const { status } = await _API_INSTANCE.post("/forum/post/create", {
        body: html,
        title,
      });

      if (status === 200) {
        queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
        toast.success("Post created successfully.");
        closeModal();
        navigate(-1, { viewTransition: true });
      } else {
        toast.error("Failed to create post. Try again.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <dialog id="create-post-modal" className="modal">
      <div className="modal-box bg-base-300 flex flex-col gap-4 max-w-xl max-h-[90vh] overflow-y-auto">
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
        <CustomEditor editor={editor} style="overflow-y-auto" />

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
