import _API_INSTANCE from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CommentInput = {
  body: string;
  post_id: string;
  parent_comment_id?: string;
};

export function useComment() {
  const queryClient = useQueryClient();

  const createComment = async ({
    body,
    post_id,
    parent_comment_id,
  }: CommentInput) => {
    if (!body || !post_id) {
      throw new Error("Missing required fields: body or post_id.");
    }

    try {
      const endpoint = parent_comment_id
        ? "/forum/post/comment/reply"
        : "/forum/post/comment";

      const payload = parent_comment_id
        ? { comment_id: parent_comment_id, post_id, body }
        : { post_id, body };

      const { data, status } = await _API_INSTANCE.post(endpoint, payload);

      if (status !== 200) {
        throw new Error("Non-200 response from server.");
      }

      return data;
    } catch (err: any) {
      console.error("Error in createComment:", err);
      throw new Error(
        err?.response?.data?.message || "Failed to post comment."
      );
    }
  };

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.message || "Failed to post comment.");
    },
  });
}
