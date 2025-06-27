import _API_INSTANCE from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useVote(keysToInvalidate: string[] = ["recent-posts"]) {
  const queryClient = useQueryClient();

  const voteOnPost = async (post_id: string, vote_type: number) => {
    const { status, data } = await _API_INSTANCE.post("/forum/post/vote", {
      post_id,
      vote_type,
    });

    if (status !== 200) throw new Error("Failed to vote");
    return data;
  };

  return useMutation({
    mutationFn: ({
      post_id,
      vote_type,
    }: {
      post_id: string;
      vote_type: number;
    }) => voteOnPost(post_id, vote_type),
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["recent-post"] });
    },
    onError: (_err, _vars, context) => {
      toast.error("Failed to vote");
    },
    onSettled: () => {
      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });
}

export function useVoteOnComment() {
  const queryClient = useQueryClient();

  const voteOnComment = async (comment_id: string, vote_type: number) => {
    const { status, data } = await _API_INSTANCE.post(
      "/forum/post/comment/vote",
      {
        comment_id: comment_id,
        vote_type: vote_type,
      }
    );

    if (status !== 200) throw new Error("Failed to vote");
    return data;
  };

  return useMutation({
    mutationFn: ({
      comment_id,
      vote_type,
    }: {
      comment_id: string;
      vote_type: number;
    }) => voteOnComment(comment_id, vote_type),
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (_err, _vars, context) => {
      toast.error("Failed to vote");
    },
  });
}
