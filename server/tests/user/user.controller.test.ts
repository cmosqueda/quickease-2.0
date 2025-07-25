import { get_user, edit_user_name, toggle_user_visibility, view_profile } from "../../modules/user/user.controller";
import { FastifyReply } from "fastify";
import * as userService from "../../modules/user/user.service";

// Mocked reply object
const mockReply = (): jest.Mocked<FastifyReply> => {
  const reply = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  return reply as unknown as jest.Mocked<FastifyReply>;
};

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // get_user

  describe("get_user", () => {
    test("returns 200 with user if found", async () => {
      const mockUser = {
        id: "1",
        password: "hashed_pw",
        first_name: "Alice",
        last_name: "Doe",
        email: "alice@example.com",
        gender: "female",
        phone_number: null,
        badges: [],
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: false,

        flashcards: [],
        notes: [],
        quizzes: [],
      };
      jest.spyOn(userService, "getUser").mockResolvedValue(mockUser);

      const req: any = { user: { id: "1" } };
      const reply = mockReply();

      await get_user(req, reply);

      expect(userService.getUser).toHaveBeenCalledWith("1");
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockUser);
    });

    test("returns 404 if user not found", async () => {
      jest.spyOn(userService, "getUser").mockResolvedValue(null);

      const req: any = { user: { id: "1" } };
      const reply = mockReply();

      await get_user(req, reply);

      expect(reply.code).toHaveBeenCalledWith(404);
      expect(reply.send).toHaveBeenCalledWith({ message: "User not found." });
    });

    test("returns 500 on service error", async () => {
      jest.spyOn(userService, "getUser").mockRejectedValue(new Error("Oops"));

      const req: any = { user: { id: "1" } };
      const reply = mockReply();

      await get_user(req, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Error getting user's details.",
      });
    });
  });

  // edit_user_name

  describe("edit_user_name", () => {
    test("returns 200 on successful name update", async () => {
      const updatedUser = {
        id: "1",
        first_name: "Bob",
        last_name: "Smith",
        password: "hashed_password",
        email: "bob@example.com",
        gender: null,
        phone_number: null,
        badges: {},
        is_public: false,
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: false,
      };
      jest.spyOn(userService, "changeUserName").mockResolvedValue(updatedUser);

      const req: any = {
        user: { id: "1" },
        body: { firstName: "Bobert", lastName: "Smith" },
      };
      const reply = mockReply();

      await edit_user_name(req, reply);

      expect(userService.changeUserName).toHaveBeenCalledWith("Bobert", "Smith", "1");
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Name updated successfully.",
        user: updatedUser,
      });
    });

    test("returns 400 for invalid input", async () => {
      const req: any = {
        user: { id: "1" },
        body: { firstName: "Bo", lastName: "" },
      };
      const reply = mockReply();

      await edit_user_name(req, reply);

      expect(reply.code).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid input",
          errors: expect.any(Array),
        })
      );
    });

    test("returns 500 on service error", async () => {
      jest.spyOn(userService, "changeUserName").mockRejectedValue(new Error("Oops"));

      const req: any = {
        user: { id: "1" },
        body: { firstName: "Robert", lastName: "Smith" },
      };
      const reply = mockReply();

      await edit_user_name(req, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Error updating name.",
      });
    });
  });

  // toggle_user_visibility

  describe("toggle_user_visibility", () => {
    test("returns 200 on successful visibility toggle", async () => {
      const updatedUser = {
        id: "1",
        first_name: "Bob",
        last_name: "Smith",
        password: "hashed_password",
        email: "bob@example.com",
        gender: null,
        phone_number: null,
        badges: {},
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: false,
      };
      jest.spyOn(userService, "toggleProfileVisibility").mockResolvedValue(updatedUser);

      const req: any = {
        user: { id: "1" },
        body: { visibility: true },
      };
      const reply = mockReply();

      await toggle_user_visibility(req, reply);

      expect(userService.toggleProfileVisibility).toHaveBeenCalledWith(true, "1");
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Profile visibility updated.",
        user: updatedUser,
      });
    });

    test("returns 400 for invalid visibility input", async () => {
      const req: any = {
        user: { id: "1" },
        body: { visibility: "notABoolean" },
      };
      const reply = mockReply();

      await toggle_user_visibility(req, reply);

      expect(reply.code).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid input",
          errors: expect.any(Array),
        })
      );
    });

    test("returns 500 on service error", async () => {
      jest.spyOn(userService, "toggleProfileVisibility").mockRejectedValue(new Error("Oops"));

      const req: any = {
        user: { id: "1" },
        body: { visibility: false },
      };
      const reply = mockReply();

      await toggle_user_visibility(req, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Error updating profile visibility.",
      });
    });
  });

  // view_profile

  describe("view_profile", () => {
    test("returns 200 with public user", async () => {
      const publicUser = {
        first_name: "Alice",
        last_name: "Doe",
        is_public: true,
        comments: [],
        badges: [],
        gender: "female",
        posts: [],
      };
      jest.spyOn(userService, "viewProfile").mockResolvedValue(publicUser);

      const req: any = { params: { user_id: "1" } };
      const reply = mockReply();

      await view_profile(req, reply);

      expect(userService.viewProfile).toHaveBeenCalledWith("1");
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(publicUser);
    });

    test("returns 404 if user not found", async () => {
      jest.spyOn(userService, "viewProfile").mockResolvedValue(null as any); // or change the service return type to include `null`

      const req: any = { params: { user_id: "1" } };
      const reply = mockReply();

      await view_profile(req, reply);

      expect(reply.code).toHaveBeenCalledWith(404);
      expect(reply.send).toHaveBeenCalledWith({
        message: "User not found.",
      });
    });

    test("returns 500 on service error", async () => {
      jest.spyOn(userService, "viewProfile").mockRejectedValue(new Error("Oops"));

      const req: any = { params: { user_id: "1" } };
      const reply = mockReply();

      await view_profile(req, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Error getting user's details.",
      });
    });
  });
});
