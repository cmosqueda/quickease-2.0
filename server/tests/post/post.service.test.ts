import * as postService from "../../modules/post/post.service";
import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    post: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    postVote: {
      count: jest.fn(),
      upsert: jest.fn(),
    },
    comment: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    commentVote: {
      upsert: jest.fn(),
    },
    postTag: {
      upsert: jest.fn(),
    },
  },
}));

describe("Post Service", () => {
  afterEach(() => jest.clearAllMocks());

  test("getUserPosts returns posts", async () => {
    const mockPosts = [{ id: "1", title: "Post A" }];
    (db_client.post.findMany as jest.Mock).mockResolvedValue(mockPosts);

    const result = await postService.getUserPosts("user-1");
    expect(result).toEqual(mockPosts);
    expect(db_client.post.findMany).toHaveBeenCalledWith({ where: { user_id: "user-1" } });
  });

  test("getPost returns post with vote summary", async () => {
    const mockPost = { id: "1", title: "Post", user: {}, comments: [] };
    (db_client.post.findFirst as jest.Mock).mockResolvedValue(mockPost);
    (db_client.postVote.count as jest.Mock).mockResolvedValueOnce(5).mockResolvedValueOnce(2);

    const result = await postService.getPost("1");

    expect(result).toEqual({
      ...mockPost,
      vote_summary: {
        upvotes: 5,
        downvotes: 2,
      },
    });
  });

  test("createPost creates and returns post", async () => {
    const mockCreated = { id: "1", title: "New Post" };
    (db_client.post.create as jest.Mock).mockResolvedValue(mockCreated);

    const result = await postService.createPost("body", "New Post", "user-1");
    expect(result).toEqual(mockCreated);
  });

  test("commentOnPost creates comment and updates post", async () => {
    const mockComment = { id: "comment-1", comment_body: "Nice" };
    (db_client.comment.create as jest.Mock).mockResolvedValue(mockComment);
    (db_client.post.update as jest.Mock).mockResolvedValue({});

    const result = await postService.commentOnPost("Nice", "post-1", "user-1");
    expect(result).toEqual(mockComment);
  });

  test("replyOnComment updates comment replies", async () => {
    (db_client.comment.update as jest.Mock).mockResolvedValue({});

    const result = await postService.replyOnComment("Thanks!", "comment-1", "user-1", "post-1");
    expect(result).toEqual({ replied: true });
  });

  test("voteOnPost upserts vote", async () => {
    (db_client.postVote.upsert as jest.Mock).mockResolvedValue({});

    const result = await postService.voteOnPost(1, "post-1", "user-1");
    expect(result).toEqual({ voted: true });
  });

  test("voteOnComment upserts vote", async () => {
    (db_client.commentVote.upsert as jest.Mock).mockResolvedValue({});

    const result = await postService.voteOnComment(-1, "comment-1", "user-1");
    expect(result).toEqual({ voted: true });
  });

  test("addTagOnPost upserts tags", async () => {
    const mockTag = { id: "tag-1" };
    (db_client.postTag.upsert as jest.Mock).mockResolvedValue(mockTag);

    const result = await postService.addTagOnPost("post-1", ["tag-1"]);
    expect(result).toEqual([mockTag]);
  });

  test("deletePost deletes the post", async () => {
    (db_client.post.delete as jest.Mock).mockResolvedValue({});

    const result = await postService.deletePost("post-1");
    expect(result).toEqual({ deleted: true });
  });

  test("togglePostVisibility updates post visibility", async () => {
    (db_client.post.update as jest.Mock).mockResolvedValue({});

    const result = await postService.togglePostVisibility(true, "post-1");
    expect(result).toBe(true);
  });
});
