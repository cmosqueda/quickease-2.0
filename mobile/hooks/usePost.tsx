import AsyncStorage from "@react-native-async-storage/async-storage";
import _API_INSTANCE from "@/utils/axios";

import { Post, PostAttachment, PostTag } from "@/types/user/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { QueryClient } from "@tanstack/react-query";
import { ToastAndroid } from "react-native";

type _usePost = {
  posts: Post[];
  setPosts: (posts: Post[]) => void;

  postOnForum: ({
    title,
    post_body,
    tags,
    attachments,
  }: {
    title: string;
    post_body: string;
    tags?: PostTag[];
    attachments?: PostAttachment[];
  }) => void;

  editPost: ({
    title,
    post_body,
    post_id,
  }: {
    title: string;
    post_body: string;
    post_id: string;
  }) => void;

  votePost: ({
    vote_type,
    post_id,
    query_client,
  }: {
    vote_type: string;
    post_id: string;
    query_client: QueryClient;
  }) => void;

  reportPost: ({
    description,
    post_id,
  }: {
    description: string;
    post_id: string;
  }) => void;

  deletePost: (post_id: string) => void;
};

const usePost = create<_usePost>()(
  persist(
    immer((set, get) => ({
      posts: [],

      setPosts: (posts) => {
        set((state) => {
          state.posts = posts;
        });
      },

      postOnForum: async ({ title, post_body, tags, attachments }) => {
        try {
          const newPost = await _API_INSTANCE.post("forum/post/create", {
            title: title,
            body: post_body,
            tags,
            attachments,
          });

          if ("toxic" in newPost.data && newPost.data.toxic) {
            return { toxic: true };
          }

          set((state) => {
            state.posts.push(newPost.data);
          });

          return true;
        } catch (err) {
          return false;
        }
      },

      editPost: async ({ title, post_body, post_id }) => {
        try {
          const updatedPost = await _API_INSTANCE.put("forum/post/update", {
            body: post_body,
            title,
            post_id,
          });

          set((state) => {
            const post = state.posts.find((p) => p.id === post_id);
            if (post) {
              updatedPost.data.title = title;
              updatedPost.data.post_body = post_body;
            }
          });
          ToastAndroid.show("Post updated.", ToastAndroid.SHORT);

          return true;
        } catch (err) {
          ToastAndroid.show("Error updating post.", ToastAndroid.SHORT);
          return false;
        }
      },

      votePost: async ({ vote_type, post_id, query_client }) => {
        try {
          await _API_INSTANCE.post("forum/post/vote", {
            vote_type,
            post_id,
          });
        } catch (err) {
          ToastAndroid.show("Error voting post.", ToastAndroid.SHORT);
          return false;
        } finally {
          query_client.invalidateQueries({ queryKey: [post_id, "post"] });
        }
      },

      reportPost: async ({ description, post_id }) => {
        try {
          await _API_INSTANCE.post("forum/post/report", {
            description,
            post_id,
          });
          ToastAndroid.show("Post reported.", ToastAndroid.SHORT);
        } catch (err) {
          ToastAndroid.show("Error voting post.", ToastAndroid.SHORT);
          return false;
        }
      },

      deletePost: async (post_id) => {
        try {
          await _API_INSTANCE.delete("forum/post/delete", {
            data: {
              post_id,
            },
          });

          set((state) => {
            state.posts = state.posts.filter((p) => p.id !== post_id);
          });
          ToastAndroid.show("Post deleted.", ToastAndroid.SHORT);
        } catch (err) {
          ToastAndroid.show("Error deleting post.", ToastAndroid.SHORT);
          return false;
        }
      },
    })),
    {
      name: "user-posts",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        posts: state.posts,
      }),
    }
  )
);

export default usePost;
