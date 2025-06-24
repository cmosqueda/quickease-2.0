import { getUser, changeUserName, toggleProfileVisibility } from "../../modules/user/user.service";
import db_client from "../../utils/client";

// mock prisma client directly here
jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// describe the test
describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock state after each test
  });

  //   get user by id
  test("getUser should return the user with the given id", async () => {
    const mockUser = { id: "1", first_name: "Alice", last_name: "Doe" };
    (db_client.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUser("1");

    expect(db_client.user.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(result).toEqual(mockUser);
  });

  //   change user name
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

  //   toggle profile to public
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
});
