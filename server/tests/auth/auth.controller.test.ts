import { login_user, register_user, logout } from "../../modules/auth/auth.controller";
import * as authService from "../../modules/auth/auth.service";
import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Auth Controller", () => {
  const createMockReply = () => {
    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setCookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      jwtSign: jest.fn().mockImplementation(() => Promise.resolve("mocked.jwt.token")), // important: must resolve
    };
    return reply;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login_user", () => {
    test("should respond with 400 if loginUser returns false", async () => {
      jest.spyOn(authService, "loginUser").mockResolvedValue(false);

      const request = {
        body: { email: "alice@example.com", password: "wrongPassword" },
      } as any;

      const reply = createMockReply();

      await login_user(request, reply as any);

      expect(reply.code).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Check your credentials.",
      });
    });

    test("should respond with 200 and set cookie if login is successful", async () => {
      const mockUser = {
        id: "1",
        password: "hashed_password",
        first_name: "Alice",
        last_name: "Doe",
        email: "alice@example.com",
        gender: "female", // FIX: not null
        phone_number: "09123456789", // FIX: not null
        badges: {},
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      };

      jest.spyOn(authService, "loginUser").mockResolvedValue(mockUser);

      const request = {
        body: {
          email: "alice@example.com",
          password: "correctPassword",
        },
      } as any;

      const reply = createMockReply();

      await login_user(request, reply as any);

      expect(reply.jwtSign).toHaveBeenCalledWith(mockUser);
      expect(reply.setCookie).toHaveBeenCalledWith("QUICKEASE_TOKEN", "mocked.jwt.token", {
        path: "/",
        secure: true,
        httpOnly: true,
      });

      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({ is_admin: true });
    });

    test("should respond with 400 on unexpected error", async () => {
      jest.spyOn(authService, "loginUser").mockRejectedValue(new Error("DB Fail"));

      const request = {
        body: { email: "test@example.com", password: "anything" },
      } as any;

      const reply = createMockReply();

      await login_user(request, reply as any);

      expect(reply.code).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Bad request, check your credentials.",
      });
    });
  });

  describe("register_user", () => {
    test("should respond with 406 if user already exists", async () => {
      (db_client.user.findUnique as jest.Mock).mockResolvedValue({ id: "1" });

      const request = {
        body: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          password: "password",
        },
      } as any;

      const reply = createMockReply();

      await register_user(request, reply as any);

      expect(reply.code).toHaveBeenCalledWith(406);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Email already in use.",
      });
    });

    test("should create user, sign token, and respond with role", async () => {
      (db_client.user.findUnique as jest.Mock).mockResolvedValue(null);

      const mockUser = {
        id: "1",
        password: "hashed_password",
        first_name: "Alice",
        last_name: "Doe",
        email: "alice@example.com",
        gender: "female", // FIX: not null
        phone_number: "09123456789", // FIX: not null
        badges: {},
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      };

      jest.spyOn(authService, "registerUser").mockResolvedValue(mockUser);

      const request = {
        body: {
          firstName: "Alice",
          lastName: "Doe",
          email: "alice@example.com",
          password: "securepw",
        },
      } as any;

      const reply = createMockReply();

      await register_user(request, reply as any);

      expect(authService.registerUser).toHaveBeenCalledWith("Alice", "Doe", "alice@example.com", "securepw");
      expect(reply.setCookie).toHaveBeenCalledWith("QUICKEASE_TOKEN", "mocked.jwt.token", {
        path: "/",
        httpOnly: true,
        secure: true,
      });

      expect(reply.send).toHaveBeenCalledWith({ role: "user" });
    });
  });

  describe("logout", () => {
    test("should clear cookie and respond with 200", async () => {
      const request = {} as any;
      const reply = createMockReply();

      await logout(request, reply as any);

      expect(reply.clearCookie).toHaveBeenCalledWith("QUICKEASE_TOKEN");
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith("Logout successfully.");
    });
  });
});
