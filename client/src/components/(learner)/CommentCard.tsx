/* eslint-disable @typescript-eslint/no-unused-vars */
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import clsx from "clsx";
import dayjs from "dayjs";

import { useComment } from "@/hooks/useComment";
import { useVoteOnComment } from "@/hooks/useVote";
import { useEditor, EditorProvider, EditorContent } from "@tiptap/react";
import {
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Ellipsis,
  Edit,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { toast } from "sonner";
import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import useReport from "@/hooks/useReport";

type CommentCardProps = {
  id: string;
  comment_body: string;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  replies: CommentCardProps[];
  user_vote: number;
  vote_sum: number;
};

const CommentCard = ({
  comment,
  post_id,
}: {
  comment: CommentCardProps;
  post_id: string;
}) => {
  const queryClient = useQueryClient();
  const { setComment, setPost } = useReport();
  const { user } = useAuth();
  const { mutate: vote } = useVoteOnComment();
  const { mutate: reply } = useComment();
  const [isReplyBoxVisible, setReplyBoxVisibility] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  const editor = useEditor({
    editable: true,
    extensions: _TIPTAP_EXTENSIONS,
    autofocus: true,
    onUpdate: (e) => setText(e.editor.getHTML()),
  });

  const handlePostVote = (vote_type: number) => {
    vote?.({
      comment_id: comment?.id,
      vote_type,
    });
  };

  const handleSubmitReply = async () => {
    if (!text) {
      toast.error("Reply is empty.");
      return;
    }

    try {
      await reply?.({
        post_id,
        parent_comment_id: comment?.id,
        body: text,
      });
      editor?.commands.clearContent();
      setReplyBoxVisibility(false);
    } catch {
      toast.error("Failed to submit reply.");
    }
  };

  const handleDeleteComment = async (comment_id: string) => {
    try {
      await _API_INSTANCE.delete("/forum/post/comment/delete", {
        data: {
          comment_id: comment_id,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["post", post_id] });

      toast.success("Reply deleted.");
    } catch (err) {
      toast.error("Failed to delete reply.");
    }
  };

  const handleEditComment = async () => {
    try {
      await _API_INSTANCE.put(
        "/forum/post/comment/update",
        {
          body: text,
          comment_id: comment.id,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      await queryClient.invalidateQueries({ queryKey: ["post"] });

      toast.success("Comment updated.");
    } catch (err) {
      toast.error("Error updating comment.");
    } finally {
      setIsEditing(false);
      setReplyBoxVisibility(false);
    }
  };

  const handleShowCommentReport = () => {
    setComment(comment);

    const modal = document.getElementById(
      "report-comment-modal"
    ) as HTMLDialogElement;

    modal.showModal();
  };

  useEffect(() => {
    if (isEditing) {
      editor?.commands.setContent(comment.comment_body);
    }
  }, [editor, isEditing]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-start">
        <div className="w-[36px] aspect-square rounded-full bg-base-300" />
        <div className="flex flex-col flex-1">
          <NavLink
            className={"font-bold"}
            to={`/learner/profile/${comment.user.id}`}
          >
            {comment?.user?.first_name} {comment?.user?.last_name}
          </NavLink>
          <p className="text-base-content/40">
            {dayjs(comment?.created_at).format("MMMM DD, YYYY / h:mm A")}
          </p>
          <div className="my-2 bg-base-100 p-4 rounded-3xl">
            <EditorProvider
              content={comment?.comment_body || ""}
              extensions={_TIPTAP_EXTENSIONS}
              editable={false}
            />
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-2 p-4 rounded-3xl bg-base-100 border border-base-200">
              <ChevronUp
                className={clsx(
                  "cursor-pointer hover:text-green-500",
                  comment?.user_vote === 1 && "text-green-600"
                )}
                onClick={() => handlePostVote(1)}
              />
              <p className="text-sm">{comment?.vote_sum ?? 0}</p>
              <ChevronDown
                className={clsx(
                  "cursor-pointer hover:text-red-500",
                  comment?.user_vote === -1 && "text-red-600"
                )}
                onClick={() => handlePostVote(-1)}
              />
            </div>
            <button
              onClick={() => setReplyBoxVisibility((prev) => !prev)}
              className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-base-100 border border-base-200 cursor-pointer transition-all delay-0 duration-300 hover:bg-base-300"
            >
              <MessageCircle />
              <p>{comment?.replies?.length ?? 0}</p>
            </button>
            {comment.user.id == user!.id && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setReplyBoxVisibility((prev) => !prev);
                }}
                className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-base-100 border border-base-200 cursor-pointer transition-all delay-0 duration-300 hover:bg-base-300"
              >
                <Edit />
              </button>
            )}
            <details className="dropdown dropdown-top">
              <summary className="py-4 px-6 rounded-3xl bg-base-100 border border-base-200 cursor-pointer list-none">
                <Ellipsis />
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 border border-base-200 shadow my-2">
                {comment.user.id == user!.id && (
                  <li>
                    <button onClick={() => handleDeleteComment(comment.id)}>
                      Delete
                    </button>
                  </li>
                )}

                <li>
                  <button onClick={handleShowCommentReport}>Report</button>
                </li>
              </ul>
            </details>
          </div>

          {isReplyBoxVisible && (
            <div className="flex flex-col gap-1 mt-4 relative">
              <h1 className="text-lg text-base-content/50">
                {!isEditing ? "Reply to comment" : "Edit comment"}
              </h1>
              <EditorContent
                editor={editor}
                className={clsx(
                  "prose bg-base-100 rounded-xl p-4 border focus:outline-none outline-none border-transparent focus:border-transparent focus:ring-0"
                )}
                placeholder="Comment"
              />
              <button
                className="btn btn-success w-fit self-end absolute right-2 bottom-2"
                onClick={!isEditing ? handleSubmitReply : handleEditComment}
              >
                <p>{!isEditing ? "Reply" : "Save changes"}</p>
              </button>
            </div>
          )}

          <div className="mt-4 relative">
            {comment?.replies?.map((reply) => (
              <CommentCard comment={reply} post_id={post_id} key={reply.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
