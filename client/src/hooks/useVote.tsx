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

    // Only optimistically update recent-posts, not single post
    onMutate: async ({ post_id, vote_type }) => {
      if (!keysToInvalidate.includes("recent-posts")) return;

      await queryClient.cancelQueries({ queryKey: ["recent-posts"] });
      const previous = queryClient.getQueryData(["recent-posts"]);

      queryClient.setQueryData(["recent-posts"], (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) =>
            post.id === post_id
              ? {
                  ...post,
                  vote_sum: (post.vote_sum ?? 0) + vote_type,
                  user_vote: vote_type,
                }
              : post
          ),
        })),
      }));

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["recent-posts"], context.previous);
      }
      toast.error("Failed to vote");
    },

    onSettled: () => {
      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });
}
