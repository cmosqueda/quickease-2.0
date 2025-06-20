import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import CustomEditor from "@/components/Editor";
import dayjs from "dayjs";

import { EditorProvider, useEditor } from "@tiptap/react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";

export default function LearnerPostPage() {
  const data = useLoaderData();
  const navigate = useNavigate();

  const [html, setHTML] = useState("");
  const editor = useEditor({
    editable: true,
    extensions: _TIPTAP_EXTENSIONS,
    onUpdate: (e) => {
      setHTML(e.editor.getHTML());
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div className="flex items-center justify-between">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate("/learner")}
        />
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
      <div className="flex flex-row items-center gap-3">
        <div className="bg-base-300 rounded-3xl shadow w-[3rem] h-[3rem] aspect-square" />
        <div>
          <p>
            {data.user.first_name} {data.user.last_name}
          </p>
          <p className="text-base-content/40">
            {dayjs(data.created_at).format("MMMM DD, YYYY").toString()}
          </p>
        </div>
      </div>
      <h1 className="text-4xl font-bold">{data.title}</h1>
      <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
        <EditorProvider
          content={data.post_body}
          extensions={_TIPTAP_EXTENSIONS}
          editable={false}
        ></EditorProvider>
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 p-4 rounded-3xl bg-base-100 border border-base-200">
          <ChevronUp className="cursor-pointer delay-0 duration-300 transition-all hover:text-green-500" />
          <p>{data.vote_summary.upvotes - data.vote_summary.downvotes}</p>
          <ChevronDown className="cursor-pointer delay-0 duration-300 transition-all hover:text-red-500" />
        </div>
        <div className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-base-100 border border-base-200 cursor-pointer transition-all delay-0 duration-300 hover:bg-base-300">
          <MessageCircle />
          <p>{data.comments.length}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1>Sort by</h1>
        <div className="flex flex-row gap-2 items-center">
          <div className="filter">
            <input
              className="btn btn-soft filter-reset"
              type="radio"
              aria-label="All"
              name="post-filters"
            />
            <input
              className="btn btn-soft"
              name="post-filters"
              type="radio"
              aria-label="Best"
            />
            <input
              className="btn btn-soft"
              name="post-filters"
              type="radio"
              aria-label="New"
            />
            <input
              className="btn btn-soft"
              name="post-filters"
              type="radio"
              aria-label="Old"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <CustomEditor
          editor={editor}
          placeholder="Write your comment here..."
        />
        <button className="btn btn-success w-fit self-end">
          <p>Comment</p>
        </button>
      </div>
    </div>
  );
}
