/* eslint-disable @typescript-eslint/no-explicit-any */
import _API_INSTANCE from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type VoteInput = {
  post_id: string;
  vote_type: number;
};

type CommentVoteInput = {
  comment_id: string;
  vote_type: number;
};

export function useVote(keysToInvalidate: string[] = ["recent-posts"]) {
  const queryClient = useQueryClient();

  const voteOnPost = async ({ post_id, vote_type }: VoteInput) => {
    if (!post_id || typeof vote_type !== "number") {
      throw new Error("Invalid vote payload.");
    }

    try {
      const { status, data } = await _API_INSTANCE.post("/forum/post/vote", {
        post_id,
        vote_type,
      });

      if (status !== 200) throw new Error("Non-200 response from server.");
      return data;
    } catch (err: any) {
      console.error("Error voting on post:", err);
      throw new Error(err?.response?.data?.message || "Failed to vote.");
    }
  };

  return useMutation({
    mutationFn: voteOnPost,
    onSuccess: () => {
      keysToInvalidate.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.message || "Failed to vote.");
    },
  });
}

export function useVoteOnComment() {
  const queryClient = useQueryClient();

  const voteOnComment = async ({ comment_id, vote_type }: CommentVoteInput) => {
    if (!comment_id || typeof vote_type !== "number") {
      throw new Error("Invalid comment vote input.");
    }

    try {
      const { status, data } = await _API_INSTANCE.post(
        "/forum/post/comment/vote",
        { comment_id, vote_type }
      );

      if (status !== 200) throw new Error("Non-200 response from server.");
      return data;
    } catch (err: any) {
      console.error("Error voting on comment:", err);
      throw new Error(
        err?.response?.data?.message || "Failed to vote on comment."
      );
    }
  };

  return useMutation({
    mutationFn: voteOnComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.message || "Failed to vote on comment.");
    },
  });
}
