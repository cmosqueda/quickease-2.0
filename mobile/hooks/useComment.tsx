/* eslint-disable @typescript-eslint/no-explicit-any */
import _API_INSTANCE from "@/utils/axios";

import { toast } from "sonner-native";
import { checkBadges } from "@/types/user/badges";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

type CommentInput = {
  body: string;
  post_id: string;
  parent_comment_id?: string;
};

export function useComment(keysToInvalidate: QueryKey[] = [["view-post"]]) {
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

      const { data, status } = await _API_INSTANCE.post(endpoint, payload, {
        timeout: 8 * 60 * 1000,
      });

      if (status !== 200) {
        throw new Error("Non-200 response from server.");
      }

      await checkBadges();

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
      keysToInvalidate.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
    },
    onError: (err: any) => {
      console.error(err);
      toast(err?.message || "Failed to post comment.");
    },
  });
}
