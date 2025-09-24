/* eslint-disable @typescript-eslint/no-explicit-any */
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";
import CustomEditor from "@/components/Editor";
import UserAvatar from "@/components/(learner)/UserAvatar";

import { useQuery } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import { ArrowLeft, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
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
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row gap-4 items-center">
          <ArrowLeft
            onClick={() => navigate("/learner", { viewTransition: true })}
            className="cursor-pointer"
          />
          <h1 className="text-2xl font-bold">Edit post</h1>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <button className="btn btn-neutral">
            <Trash />
            <p>Delete post</p>
          </button>
          <button className="btn btn-neutral" onClick={handleUpdate}>
            <Save />
            Update
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center gap-3">
        <UserAvatar data={postData} />
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="input input-xl input-ghost w-full text-4xl font-bold"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <CustomEditor
          editor={editor!}
          style="overflow-y-auto border border-base-300 shadow"
        />
      </div>
      <div className="flex flex-row gap-4 items-center justify-end"></div>
    </div>
  );
}
