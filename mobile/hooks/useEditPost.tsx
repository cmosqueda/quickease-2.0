/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "sonner-native";
import { checkBadges } from "@/types/user/badges";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import _API_INSTANCE from "@/utils/axios";

/**
 * Custom hook for editing a forum post.
 *
 * This hook provides a mutation for updating a post's title and body via an API call.
 * On successful mutation, it invalidates and refetches relevant queries to ensure UI consistency.
 * Handles errors by logging and displaying a toast notification.
 *
 * @returns {UseMutationResult} Mutation object for editing a post.
 *
 * @example
 * const editPostMutation = useEditPost();
 * editPostMutation.mutate({ post_id: "123", title: "New Title", body: "Updated body" });
 */
export function useEditPost() {
  const queryClient = useQueryClient();

  const editPost = async ({
    body,
    title,
    post_id,
  }: {
    body: string;
    title: string;
    post_id: string;
  }) => {
    try {
      const { status, data } = await _API_INSTANCE.put(
        "/forum/post/update",
        {
          body,
          title,
          post_id,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (status !== 200) {
        throw new Error("Non-200 response from server.");
      }

      await checkBadges();

      return data;
    } catch (err) {
      throw err;
    }
  };

  return useMutation({
    mutationFn: editPost,
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post", variables.post_id] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
      await queryClient.refetchQueries({
        queryKey: ["recent-posts"],
      });
      await queryClient.refetchQueries({
        queryKey: ["post", variables.post_id],
      });
      await queryClient.refetchQueries({
        queryKey: ["edit-post", variables.post_id],
      });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.message || "Failed to post comment.");
    },
  });
}
