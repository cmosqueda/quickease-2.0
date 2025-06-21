import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dayjs from "dayjs";
import {
  EllipsisVertical,
  ChevronUp,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { NavLink } from "react-router";

export default function PostCard({ post }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-[32px] h-[32px] aspect-square rounded-full bg-base-100" />
          <p>
            {post.user.first_name} {post.user.last_name}
          </p>
          <p>/ {dayjs(post.created_at).format("MMMM DD, YYYY")}</p>
        </div>
        <details className="dropdown dropdown-end">
          <summary className="list-none cursor-pointer">
            <EllipsisVertical
              className="rounded-full grow shrink-0 p-2 border border-base-200"
              size={36}
            />
          </summary>
          <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-1 w-52 p-2 my-2 shadow-sm">
            <li>
              <a>Report</a>
            </li>
          </ul>
        </details>
      </div>
      <NavLink
        to={`/learner/post/${post.id}`}
        viewTransition
        className="cursor-pointer transition-all delay-0 duration-300 p-4 rounded-3xl bg-base-100 hover:bg-base-300 border border-base-200 hover:shadow"
      >
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <EditorProvider
          content={post.post_body}
          extensions={_TIPTAP_EXTENSIONS}
          editable={false}
        ></EditorProvider>
      </NavLink>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 p-4 rounded-3xl bg-base-100 border border-base-200">
          <ChevronUp className="cursor-pointer delay-0 duration-300 transition-all hover:text-green-500" />
          <p>{post.votes.length}</p>
          <ChevronDown className="cursor-pointer delay-0 duration-300 transition-all hover:text-red-500" />
        </div>
        <div className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-base-100 border border-base-200 cursor-pointer transition-all delay-0 duration-300 hover:bg-base-300">
          <MessageCircle />
          <p>{post.comments.length}</p>
        </div>
      </div>
    </div>
  );
}
