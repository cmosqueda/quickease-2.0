import useAuth from "@/hooks/useAuth";
import useReport from "@/hooks/useReport";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import clsx from "clsx";
import dayjs from "dayjs";

import { useVote } from "@/hooks/useVote";
import { EditorProvider } from "@tiptap/react";
import { NavLink } from "react-router";
import { toast } from "sonner";
import type { Post } from "@/types/types";

import {
  EllipsisVertical,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Forward,
  Clipboard,
} from "lucide-react";
import UserAvatar from "../UserAvatar";

const ForumPostCard = ({ post }: { post: Post }) => {
  const { mutate: vote } = useVote();
  const { setPost } = useReport();
  const { user } = useAuth();

  const fullName = `${post?.user?.first_name ?? "Unknown"} ${
    post?.user?.last_name ?? "User"
  }`;

  const formattedDate = dayjs(post.created_at).isValid()
    ? dayjs(post.created_at).format("MMMM DD, YYYY")
    : "Unknown date";

  const handleVote = (vote_type: number) => {
    vote({
      post_id: post.id,
      vote_type,
    });
  };

  const handleShowReport = () => {
    setPost(post);

    const modal = document.getElementById(
      "report-post-modal"
    ) as HTMLDialogElement;

    modal.showModal();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <UserAvatar data={post} />

        {post.user_id != user?.id && (
          <details className="dropdown dropdown-end">
            <summary className="list-none cursor-pointer">
              <EllipsisVertical
                className="rounded-full p-2 border border-base-200"
                size={36}
              />
            </summary>
            <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-10 w-52 p-2 my-2 shadow-sm">
              <li>
                <button type="button" onClick={handleShowReport}>
                  Report
                </button>
              </li>
            </ul>
          </details>
        )}
      </div>

      {/* Post body */}
      <NavLink
        to={`/learner/post/${post.id}`}
        viewTransition
        className="transition-all duration-300 p-4 rounded-3xl bg-base-100 hover:bg-base-300 border border-base-300 shadow"
      >
        <h1 className="text-3xl font-bold mb-2">{post.title || "Untitled"}</h1>
        <EditorProvider
          content={post.post_body}
          extensions={_TIPTAP_EXTENSIONS}
          editable={false}
        />
        {post.tags.length > 0 && (
          <div className="flex flex-row gap-2 mt-4">
            {post.tags.map((tag) => (
              <div key={tag.tag.tag_name} className="badge badge-neutral">
                {tag.tag.tag_name}
              </div>
            ))}
          </div>
        )}
      </NavLink>

      {/* Footer */}
      <div className="flex flex-row gap-2">
        <div className="flex flex-row items-center gap-2 p-3 rounded-3xl bg-base-100 border border-base-300 shadow">
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
          className="flex flex-row items-center gap-2 px-6 py-3 rounded-3xl bg-base-100 border border-base-300 cursor-pointer hover:bg-base-300 transition shadow"
        >
          <MessageCircle />
          <p className="text-sm">{post.comments?.length ?? 0}</p>
        </NavLink>
        <button
          className="flex flex-row items-center gap-2 px-6 py-3 rounded-3xl bg-base-100 border border-base-300 cursor-pointer hover:bg-base-300 transition shadow"
          onClick={async () => {
            await navigator.clipboard.writeText(
              `https://quickease.online/learner/post/${post.id}`
            );

            toast.success("Link copied to clipboard.");
          }}
        >
          <Clipboard />
        </button>
      </div>
    </div>
  );
};

export default ForumPostCard;
