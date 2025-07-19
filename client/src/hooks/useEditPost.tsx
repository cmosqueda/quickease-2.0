import _API_INSTANCE from "@/utils/axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      const { status, data } = await _API_INSTANCE.put("/forum/post/update", {
        body,
        title,
        post_id,
      });

      if (status !== 200) {
        throw new Error("Non-200 response from server.");
      }

      return data;
    } catch (err) {
      console.log(err);
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
