import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import dayjs from "dayjs";
import { EditorProvider } from "@tiptap/react";
import {
  EllipsisVertical,
  ChevronUp,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { NavLink } from "react-router";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    post_body: string;
    created_at: string;
    user: {
      first_name: string;
      last_name: string;
    };
    votes: { id: string }[];
    comments: { id: string }[];
  };
};

export default function PostCard({ post }: PostCardProps) {
  const fullName = `${post?.user?.first_name ?? "Unknown"} ${
    post?.user?.last_name ?? "User"
  }`;

  const formattedDate = dayjs(post.created_at).isValid()
    ? dayjs(post.created_at).format("MMMM DD, YYYY")
    : "Unknown date";

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Header: user info + menu */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-[32px] h-[32px] rounded-full bg-base-100" />
          <p className="font-semibold">{fullName}</p>
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

      {/* Footer: votes + comments */}
      <div className="flex flex-row gap-4 mt-2">
        <div className="flex flex-row items-center gap-2 p-3 rounded-3xl bg-base-100 border border-base-200">
          <ChevronUp className="cursor-pointer hover:text-green-500" />
          <p className="text-sm">{post.votes?.length ?? 0}</p>
          <ChevronDown className="cursor-pointer hover:text-red-500" />
        </div>
        <div className="flex flex-row items-center gap-2 px-6 py-3 rounded-3xl bg-base-100 border border-base-200 cursor-pointer hover:bg-base-300 transition">
          <MessageCircle />
          <p className="text-sm">{post.comments?.length ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
