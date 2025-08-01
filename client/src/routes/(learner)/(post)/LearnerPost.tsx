import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";
import CommentCard from "@/components/(learner)/CommentCard";
import PostCard from "@/components/(learner)/PostCard";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";
import useReport from "@/hooks/useReport";

import { EditorContent, useEditor } from "@tiptap/react";
import {
  ArrowLeft,
  Edit,
  EllipsisVertical,
  TriangleAlertIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import { useComment } from "@/hooks/useComment";
import { useQuery } from "@tanstack/react-query";
import { useDeletePost } from "@/hooks/useDeletePost";

export default function LearnerPostPage() {
  const { setPost } = useReport();
  const { user } = useAuth();
  const { mutate: comment } = useComment();
  const { mutate: deletePost } = useDeletePost();

  const data = useLoaderData();
  const navigate = useNavigate();

  const { data: postData, isFetched } = useQuery({
    queryKey: ["post", data?.id],
    queryFn: async () => {
      const response = await _API_INSTANCE.get(`/forum/post/${data?.id}`);
      return response.data;
    },
    enabled: !!data,
    initialData: data,
    refetchOnWindowFocus: false,
  });

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
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleSubmitComment = async () => {
    if (!html) {
      toast.error("Comment is empty.");
      return;
    }

    try {
      await comment?.({
        post_id: postData?.id,
        body: html,
      });
      editor?.commands.clearContent();
    } catch (error) {
      toast.error("Failed to submit comment.");
    }
  };

  const handleShowPostReport = () => {
    setPost(data);

    const modal = document.getElementById(
      "report-post-modal"
    ) as HTMLDialogElement;

    modal.showModal();
  };

  if (!isFetched) return null;

  if (data.private) {
    return (
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto w-full items-center justify-center gap-4">
        <TriangleAlertIcon size={96} />
        <div>
          <h1 className="text-4xl font-bold text-center">
            This post got flagged or deleted.
          </h1>
          <p className="text-base-content/50">
            Sorry, we can't display this post.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div className="flex items-center justify-between">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate(-1, { viewTransition: true })}
        />
        <div className="flex flex-row gap-4 items-center">
          {postData.user_id == user?.id && (
            <NavLink to={"edit"} viewTransition>
              <Edit className="cursor-pointer" />
            </NavLink>
          )}

          <details className="dropdown dropdown-end">
            <summary className="list-none cursor-pointer">
              <EllipsisVertical
                className="rounded-full grow shrink-0 p-2 border border-base-200"
                size={36}
              />
            </summary>
            <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-1 w-52 p-2 my-2 shadow-sm">
              {postData.user_id == user?.id && (
                <li>
                  <button
                    onClick={async () =>
                      deletePost(
                        { post_id: data.id },
                        {
                          onSuccess: async () => {
                            toast.success("Post deleted.");
                            navigate("/learner");
                          },
                        }
                      )
                    }
                  >
                    Delete
                  </button>
                </li>
              )}

              <li>
                <button onClick={handleShowPostReport}>Report</button>
              </li>
            </ul>
          </details>
        </div>
      </div>
      <PostCard data={postData} />
      <div className="flex flex-col gap-4 relative">
        <EditorContent
          editor={editor}
          className={clsx(
            "prose bg-base-100 rounded-xl p-4 border focus:outline-none outline-none border-transparent focus:border-transparent focus:ring-0"
          )}
          placeholder="Comment"
        />
        <button
          className="btn btn-success w-fit self-end absolute right-2 bottom-2"
          onClick={handleSubmitComment}
        >
          <p>Comment</p>
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {postData?.comments?.map((comment) => (
          <CommentCard comment={comment} key={comment.id} post_id={data?.id} />
        ))}
      </div>
    </div>
  );
}
