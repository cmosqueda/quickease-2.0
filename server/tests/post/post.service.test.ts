import * as postService from "../../modules/post/post.service";
import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn((cb) =>
      cb({
        post: {
          create: jest.fn().mockResolvedValue({ id: "1", title: "New Post" }),
          update: jest.fn().mockResolvedValue({}),
          findMany: jest.fn(),
          findFirst: jest.fn(),
          delete: jest.fn().mockResolvedValue({}),
        },
        postAttachment: {
          createMany: jest.fn(),
          deleteMany: jest.fn(),
        },
        note: { findFirst: jest.fn().mockResolvedValue(true) },
        flashcard: { findFirst: jest.fn().mockResolvedValue(true) },
        quiz: { findFirst: jest.fn().mockResolvedValue(true) },
        comment: {
          create: jest.fn().mockResolvedValue({ id: "comment-1", comment_body: "Nice" }),
          update: jest.fn().mockResolvedValue({}),
          findMany: jest.fn().mockResolvedValue([]),
        },
        postVote: {
          count: jest.fn().mockResolvedValueOnce(5).mockResolvedValueOnce(2),
          upsert: jest.fn().mockResolvedValue({ vote_type: 1 }),
          aggregate: jest.fn().mockResolvedValue({ _sum: { vote_type: 3 } }),
        },
        commentVote: {
          upsert: jest.fn().mockResolvedValue({ vote_type: -1 }),
          aggregate: jest.fn().mockResolvedValue({ _sum: { vote_type: -1 } }),
        },
        postTag: {
          upsert: jest.fn().mockResolvedValue({ id: "tag-1" }),
        },
      })
    ),
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
      aggregate: jest.fn(),
    },
    comment: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    commentVote: {
      upsert: jest.fn(),
      aggregate: jest.fn(),
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
    const mockPost = {
      id: "1",
      title: "Post",
      votes: [{ vote_type: 1 }],
      user: {},
      attachments: [],
    };
    (db_client.post.findFirst as jest.Mock).mockResolvedValue(mockPost);
    (db_client.comment.findMany as jest.Mock).mockResolvedValue([]);
    (db_client.postVote.count as jest.Mock).mockResolvedValueOnce(5).mockResolvedValueOnce(2);

    const result = await postService.getPost("1", "user-1");

    expect(result).toMatchObject({
      id: "1",
      vote_sum: 3,
      user_vote: 1,
      vote_summary: { upvotes: 5, downvotes: 2 },
      comments: [],
    });
  });

  test("createPost creates and returns post", async () => {
    const mockCreated = { id: "1", title: "New Post" };
    (db_client.post.create as jest.Mock).mockResolvedValue(mockCreated);
    (db_client.postAttachment?.createMany as jest.Mock)?.mockResolvedValue({});

    const result = await postService.createPost("body", "New Post", "user-1");
    expect(result).toEqual(mockCreated);
  });

  test("commentOnPost creates comment", async () => {
    const mockComment = { id: "comment-1", comment_body: "Nice" };
    (db_client.comment.create as jest.Mock).mockResolvedValue(mockComment);

    const result = await postService.commentOnPost("Nice", "post-1", "user-1");
    expect(result).toEqual(mockComment);
  });

  test("replyOnComment updates comment replies", async () => {
    (db_client.comment.update as jest.Mock).mockResolvedValue({});

    const result = await postService.replyOnComment("Thanks!", "comment-1", "user-1", "post-1");
    expect(result).toEqual({ replied: true });
  });

  test("voteOnPost upserts vote and returns vote sum", async () => {
    const mockVote = { vote_type: 1 };
    (db_client.postVote.upsert as jest.Mock).mockResolvedValue(mockVote);
    (db_client.postVote.aggregate as jest.Mock).mockResolvedValue({ _sum: { vote_type: 3 } });

    const result = await postService.voteOnPost(1, "post-1", "user-1");
    expect(result).toEqual({ voted: true, vote: mockVote, vote_sum: 3 });
  });

  test("voteOnComment upserts vote and returns vote sum", async () => {
    const mockVote = { vote_type: -1 };
    (db_client.commentVote.upsert as jest.Mock).mockResolvedValue(mockVote);
    (db_client.commentVote.aggregate as jest.Mock).mockResolvedValue({ _sum: { vote_type: -1 } });

    const result = await postService.voteOnComment(-1, "comment-1", "user-1");
    expect(result).toEqual({ voted: true, vote: mockVote, vote_sum: -1 });
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
