import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";
import clsx from "clsx";
import dayjs from "dayjs";

import { useQuery } from "@tanstack/react-query";
import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import { ArrowLeft, Edit, EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router";
import { useEditPost } from "@/hooks/useEditPost";
import { toast } from "sonner";

export default function LearnerEditPostPage() {
  const navigate = useNavigate();
  const data = useLoaderData();
  const { mutate: update } = useEditPost();
  const { data: postData, isFetched } = useQuery({
    queryKey: ["edit-post", data?.id],
    queryFn: async () => {
      const response = await _API_INSTANCE.get(`/forum/post/${data?.id}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const [title, setTitle] = useState("");
  const [html, setHTML] = useState("");

  const editor = useEditor({
    editable: true,
    extensions: _TIPTAP_EXTENSIONS,
    onUpdate: (e) => {
      setHTML(e.editor.getHTML());
    },
    autofocus: true,
  });

  useEffect(() => {
    if (isFetched && editor) {
      setTitle(postData.title);
      editor.commands.setContent(postData.post_body);
    }
  }, [isFetched, editor]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!isFetched) return;

  const handleUpdate = async () => {
    try {
      await update(
        { body: html, title: title, post_id: data.id },
        {
          onSuccess: () => {
            toast.success("Post updated.");
            navigate(`/learner/post/${data.id}`, { replace: true });
            
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Error updating post.");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div className="flex items-center justify-between">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate(-1, { viewTransition: true })}
        />
      </div>
      <div className="flex flex-row items-center gap-3">
        <div className="bg-base-300 rounded-3xl shadow w-[3rem] h-[3rem] aspect-square" />
        <div>
          <p>
            {postData?.user?.first_name} {postData?.user?.last_name}
          </p>
          <p className="text-base-content/40">
            {dayjs(data?.created_at).format("MMMM DD, YYYY").toString()}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="input input-xl input-ghost w-full text-4xl font-bold"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center justify-end">
        <button
          className="btn btn-cancel"
          onClick={() =>
            navigate(`/learner/post/${data.id}`, { replace: true })
          }
        >
          Cancel
        </button>
        <button className="btn btn-success" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
}
