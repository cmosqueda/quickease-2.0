import Fastify from "fastify";
import * as postService from "../../modules/post/post.service";
import {
  get_user_posts,
  get_recent_posts,
  get_post,
  get_comments,
  create_post,
  comment_on_post,
  reply_on_comment,
  vote_on_post,
  vote_on_comment,
  add_tag_on_post,
  delete_post,
  toggle_post_visibility,
} from "../../modules/post/post.controller";

jest.mock("../../modules/post/post.service");

const mockPost = { id: "1", title: "Post Title", post_body: "Body", user_id: "user-1" };
const mockComment = { id: "c1", comment_body: "Nice" };
const mockVote = { voted: true };
const mockReply = { replied: true };
const mockTags = [{ id: "tag1" }];

const app = Fastify();

beforeAll(() => {
  app.decorateRequest("user", null as any);
  app.addHook("preHandler", async (req: any) => {
    req.user = { id: "user-1" };
  });

  app.get("/posts/user", get_user_posts);
  app.get("/posts/recent", get_recent_posts);
  app.get("/posts/:post_id", get_post);
  app.post("/posts/comments", get_comments);
  app.post("/posts", create_post);
  app.post("/posts/comment", comment_on_post);
  app.post("/posts/vote", vote_on_post);
  app.post("/posts/comment/reply", reply_on_comment);
  app.post("/posts/comment/vote", vote_on_comment);
  app.post("/posts/tags", add_tag_on_post);
  app.delete("/posts", delete_post);
  app.patch("/posts/visibility", toggle_post_visibility);
});

afterEach(() => jest.clearAllMocks());

describe("Post Controller", () => {
  test("get_user_posts returns 200", async () => {
    (postService.getUserPosts as jest.Mock).mockResolvedValue([mockPost]);
    const res = await app.inject({ method: "GET", url: "/posts/user" });
    expect(res.statusCode).toBe(200);
  });

  test("get_recent_posts returns 200", async () => {
    (postService.getRecentPosts as jest.Mock).mockResolvedValue({ posts: [mockPost], nextCursor: null });
    const res = await app.inject({ method: "GET", url: "/posts/recent" });
    expect(res.statusCode).toBe(200);
  });

  test("get_post returns 200", async () => {
    (postService.getPost as jest.Mock).mockResolvedValue(mockPost);
    const res = await app.inject({ method: "GET", url: "/posts/1" });
    expect(res.statusCode).toBe(200);
  });

  test("get_comments returns 200", async () => {
    (postService.getComments as jest.Mock).mockResolvedValue([mockComment]);
    const res = await app.inject({ method: "POST", url: "/posts/comments", payload: { post_id: "1" } });
    expect(res.statusCode).toBe(200);
  });

  test("create_post returns 200", async () => {
    (postService.createPost as jest.Mock).mockResolvedValue(mockPost);
    const res = await app.inject({ method: "POST", url: "/posts", payload: { title: "Post Title", body: "Body" } });
    expect(res.statusCode).toBe(200);
  });

  test("comment_on_post returns 200", async () => {
    (postService.commentOnPost as jest.Mock).mockResolvedValue(mockComment);
    const res = await app.inject({ method: "POST", url: "/posts/comment", payload: { post_id: "1", body: "Comment" } });
    expect(res.statusCode).toBe(200);
  });

  test("vote_on_post returns 200", async () => {
    (postService.voteOnPost as jest.Mock).mockResolvedValue(mockVote);
    const res = await app.inject({ method: "POST", url: "/posts/vote", payload: { post_id: "1", vote_type: 1 } });
    expect(res.statusCode).toBe(200);
  });

  test("reply_on_comment returns 200", async () => {
    (postService.replyOnComment as jest.Mock).mockResolvedValue(mockReply);
    const res = await app.inject({
      method: "POST",
      url: "/posts/comment/reply",
      payload: { post_id: "1", comment_id: "c1", body: "Reply" },
    });
    expect(res.statusCode).toBe(200);
  });

  test("vote_on_comment returns 200", async () => {
    (postService.voteOnComment as jest.Mock).mockResolvedValue(mockVote);
    const res = await app.inject({
      method: "POST",
      url: "/posts/comment/vote",
      payload: { comment_id: "c1", vote_type: 1 },
    });
    expect(res.statusCode).toBe(200);
  });

  test("add_tag_on_post returns 200", async () => {
    (postService.addTagOnPost as jest.Mock).mockResolvedValue(mockTags);
    const res = await app.inject({ method: "POST", url: "/posts/tags", payload: { post_id: "1", tags: ["tag1"] } });
    expect(res.statusCode).toBe(200);
  });

  test("delete_post returns 200", async () => {
    (postService.deletePost as jest.Mock).mockResolvedValue({ deleted: true });
    const res = await app.inject({ method: "DELETE", url: "/posts", payload: { post_id: "1" } });
    expect(res.statusCode).toBe(200);
  });

  test("toggle_post_visibility returns 200", async () => {
    (postService.togglePostVisibility as jest.Mock).mockResolvedValue(true);
    const res = await app.inject({
      method: "PATCH",
      url: "/posts/visibility",
      payload: { post_id: "1", visibility: true },
    });
    expect(res.statusCode).toBe(200);
  });
});
