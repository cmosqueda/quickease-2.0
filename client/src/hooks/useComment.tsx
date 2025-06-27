/* eslint-disable @typescript-eslint/no-explicit-any */
import _API_INSTANCE from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CommentInput = {
  body: string;
  post_id: string;
  parent_comment_id?: string; // optional — if present, it's a reply
};

export function useComment() {
  const queryClient = useQueryClient();

  const createComment = async ({
    body,
    post_id,
    parent_comment_id,
  }: CommentInput) => {
    if (parent_comment_id) {
      const { data } = await _API_INSTANCE.post("/forum/post/comment/reply", {
        comment_id: parent_comment_id,
        post_id,
        body,
      });

      return data;
    } else {
      const { data } = await _API_INSTANCE.post("/forum/post/comment", {
        post_id,
        body,
      });

      return data;
    }
  };

  return useMutation({
    mutationFn: createComment,
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["recent-post"] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to post comment.");
    },
  });
}
