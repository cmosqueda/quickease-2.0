/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "sonner-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import _API_INSTANCE from "@/utils/axios";

/**
 * Custom hook to handle deletion of a forum post using React Query's mutation.
 *
 * This hook provides a mutation function that deletes a post by its `post_id`.
 * On successful deletion, it invalidates the relevant queries to ensure UI consistency.
 * On error, it logs the error and displays a toast notification.
 *
 * @returns {UseMutationResult} Mutation object for deleting a post.
 *
 * @example
 * const deletePostMutation = useDeletePost();
 * deletePostMutation.mutate({ post_id: "123" });
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  const deletePost = async ({ post_id }: { post_id: string }) => {
    try {
      const { status, data } = await _API_INSTANCE.delete(
        "/forum/post/delete",
        { data: { post_id: post_id } }
      );

      if (status !== 200) {
        throw new Error("Non-200 response from server.");
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post", variables.post_id] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.message || "Failed to post comment.");
    },
  });
}
