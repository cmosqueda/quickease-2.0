import { getUser, changeUserName, toggleProfileVisibility, viewProfile } from "../../modules/user/user.service";
import db_client from "../../utils/client";

// Mock Prisma client
jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUser should return the user with the given id", async () => {
    const mockUser = { id: "1", first_name: "Alice", last_name: "Doe" };

    (db_client.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUser("1");

    expect(db_client.user.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { flashcards: true, quizzes: true, notes: true },
    });

    expect(result).toEqual(mockUser);
  });

  test("changeUserName should update and return the user", async () => {
    const updatedUser = { id: "1", first_name: "Bob", last_name: "Smith" };

    (db_client.user.update as jest.Mock).mockResolvedValue(updatedUser);

    const result = await changeUserName("Bob", "Smith", "1");

    expect(db_client.user.update).toHaveBeenCalledWith({
      data: {
        first_name: "Bob",
        last_name: "Smith",
      },
      where: {
        id: "1",
      },
    });

    expect(result).toEqual(updatedUser);
  });

  test("toggleProfileVisibility should update is_public field", async () => {
    const visibleUser = { id: "1", is_public: true };

    (db_client.user.update as jest.Mock).mockResolvedValue(visibleUser);

    const result = await toggleProfileVisibility(true, "1");

    expect(db_client.user.update).toHaveBeenCalledWith({
      data: {
        is_public: true,
      },
      where: {
        id: "1",
      },
    });

    expect(result).toEqual(visibleUser);
  });

  test("viewProfile should return full data if is_public is true", async () => {
    const publicUser = {
      first_name: "Jane",
      last_name: "Doe",
      comments: [],
      badges: [],
      gender: "female",
      posts: [],
      is_public: true,
    };

    (db_client.user.findUnique as jest.Mock).mockResolvedValue(publicUser);

    const result = await viewProfile("1");

    expect(db_client.user.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      select: {
        first_name: true,
        last_name: true,
        comments: true,
        badges: true,
        gender: true,
        posts: { include: { user: true } },
        is_public: true,
      },
    });

    expect(result).toEqual(publicUser);
  });

  test("viewProfile should return limited data if is_public is false", async () => {
    const privateUser = {
      first_name: "Jane",
      last_name: "Doe",
      is_public: false,
    };

    (db_client.user.findUnique as jest.Mock).mockResolvedValue(privateUser);

    const result = await viewProfile("1");

    expect(db_client.user.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      select: {
        first_name: true,
        last_name: true,
        comments: true,
        badges: true,
        gender: true,
        posts: { include: { user: true } },
        is_public: true,
      },
    });

    expect(result).toEqual({
      first_name: "Jane",
      last_name: "Doe",
      is_public: false,
    });
  });
});
