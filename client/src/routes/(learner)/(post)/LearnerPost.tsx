import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";
import dayjs from "dayjs";
import clsx from "clsx";

import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Edit,
  EllipsisVertical,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router";
import { useVote, useVoteOnComment } from "@/hooks/useVote";
import { toast } from "sonner";
import { useComment } from "@/hooks/useComment";
import { QueryClient, useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { useDeletePost } from "@/hooks/useDeletePost";

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

const PostCard = ({ data }: { data: any }) => {
  const { mutate: vote } = useVote(["post"]);

  const handlePostVote = (vote_type: number) => {
    if (data?.user_vote === vote_type) {
      toast("Already voted.");
      return;
    }

    vote?.({
      post_id: data?.id,
      vote_type,
    });
  };

  return (
    <>
      <div className="flex flex-row items-center gap-3">
        <div className="bg-base-300 rounded-3xl shadow w-[3rem] h-[3rem] aspect-square" />
        <div>
          <p>
            {data?.user?.first_name} {data?.user?.last_name}
          </p>
          <p className="text-base-content/40">
            {dayjs(data?.created_at).format("MMMM DD, YYYY").toString()}
          </p>
        </div>
      </div>
      <h1 className="text-4xl font-bold">{data?.title}</h1>
      <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
        <EditorProvider
          content={data?.post_body || ""}
          extensions={_TIPTAP_EXTENSIONS}
          editable={false}
        />
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 p-4 rounded-3xl bg-base-100 border border-base-200">
          <ChevronUp
            className={clsx(
              "cursor-pointer hover:text-green-500",
              data?.user_vote === 1 && "text-green-600"
            )}
            onClick={() => handlePostVote(1)}
          />
          <p className="text-sm">{data?.vote_sum ?? 0}</p>
          <ChevronDown
            className={clsx(
              "cursor-pointer hover:text-red-500",
              data?.user_vote === -1 && "text-red-600"
            )}
            onClick={() => handlePostVote(-1)}
          />
        </div>
        <div className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-base-100 border border-base-200 cursor-pointer transition-all delay-0 duration-300 hover:bg-base-300">
          <MessageCircle />
          <p>{data?.comments?.length ?? 0}</p>
        </div>
      </div>
    </>
  );
};

const CommentCard = ({
  comment,
  post_id,
}: {
  comment: CommentCardProps;
  post_id: string;
}) => {
  const { mutate: vote } = useVoteOnComment();
  const { mutate: reply } = useComment();
  const [isReplyBoxVisible, setReplyBoxVisibility] = useState(false);
  const [text, setText] = useState("");

  const editor = useEditor({
    editable: true,
    extensions: _TIPTAP_EXTENSIONS,
    autofocus: true,
    onUpdate: (e) => setText(e.editor.getHTML()),
  });

  const handlePostVote = (vote_type: number) => {
    if (comment?.user_vote === vote_type) {
      toast("Already voted.");
      return;
    }

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
    } catch (error) {
      toast.error("Failed to submit reply.");
    }
  };

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
          <div className="my-2">
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
          </div>

          {isReplyBoxVisible && (
            <div className="mt-4 relative">
              <EditorContent
                editor={editor}
                className={clsx(
                  "prose bg-base-100 rounded-xl p-4 border focus:outline-none outline-none border-transparent focus:border-transparent focus:ring-0"
                )}
                placeholder="Comment"
              />
              <button
                className="btn btn-success w-fit self-end absolute right-2 bottom-2"
                onClick={handleSubmitReply}
              >
                <p>Comment</p>
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

export default function LearnerPostPage() {
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

  if (!isFetched || !postData) return null;

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
                <a>Report</a>
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
        {postData?.comments?.map((comment: CommentCardProps) => (
          <CommentCard comment={comment} key={comment.id} post_id={data?.id} />
        ))}
      </div>
    </div>
  );
}
