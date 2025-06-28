import { login_user, register_user, logout } from "../../modules/auth/auth.controller";
import * as authService from "../../modules/auth/auth.service";
import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Auth Controller", () => {
  const createMockReply = () => {
    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setCookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      jwtSign: jest.fn().mockResolvedValue("mocked.jwt.token"),
    };
    return reply;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login_user", () => {
    test("should return 400 if email or password is missing", async () => {
      const reply = createMockReply();
      await login_user({ body: { email: "", password: "" } } as any, reply as any);

      expect(reply.code).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Email and password are required.",
      });
    });

    test("should return 400 if loginUser returns false", async () => {
      jest.spyOn(authService, "loginUser").mockResolvedValue(false);

      const reply = createMockReply();
      await login_user({ body: { email: "test@example.com", password: "wrong" } } as any, reply as any);

      expect(reply.code).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Invalid email/password, check your credentials.",
      });
    });

    test("should return 200, set cookie, and return is_admin", async () => {
      const mockUser = {
        id: "1",
        email: "alice@example.com",
        password: "hashed_password",
        first_name: "Alice",
        last_name: "Doe",
        gender: "female",
        phone_number: "09123456789",
        badges: {},
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      };

      jest.spyOn(authService, "loginUser").mockResolvedValue(mockUser);

      const reply = createMockReply();
      await login_user({ body: { email: "alice@example.com", password: "correct" } } as any, reply as any);

      expect(reply.jwtSign).toHaveBeenCalledWith(mockUser);
      expect(reply.setCookie).toHaveBeenCalledWith("QUICKEASE_TOKEN", "mocked.jwt.token", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "strict",
      });
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({ is_admin: true });
    });

    test("should return 500 on internal error", async () => {
      jest.spyOn(authService, "loginUser").mockRejectedValue(new Error("Boom"));

      const reply = createMockReply();
      await login_user({ body: { email: "test@example.com", password: "pw" } } as any, reply as any);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later.",
      });
    });
  });

  describe("register_user", () => {
    test("should return 400 if any required field is missing", async () => {
      const reply = createMockReply();

      await register_user({ body: { firstName: "", lastName: "", email: "", password: "" } } as any, reply as any);

      expect(reply.code).toHaveBeenCalledWith(400);
    });

    test("should return 406 if email is already taken", async () => {
      (db_client.user.findUnique as jest.Mock).mockResolvedValue({ id: "1" });

      const request = {
        body: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          password: "123456",
        },
      };

      const reply = createMockReply();
      await register_user(request as any, reply as any);

      expect(reply.code).toHaveBeenCalledWith(406);
      expect(reply.send).toHaveBeenCalledWith({ message: "Email already in use." });
    });

    test("should create user and return token", async () => {
      (db_client.user.findUnique as jest.Mock).mockResolvedValue(null);

      const mockUser = {
        id: "1",
        email: "alice@example.com",
        password: "hashed_password",
        first_name: "Alice",
        last_name: "Doe",
        gender: "female",
        phone_number: "09123456789",
        badges: {},
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      };

      jest.spyOn(authService, "registerUser").mockResolvedValue(mockUser);

      const request = {
        body: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          password: "securepw",
        },
      };

      const reply = createMockReply();
      await register_user(request as any, reply as any);

      expect(reply.jwtSign).toHaveBeenCalledWith(mockUser);
      expect(reply.setCookie).toHaveBeenCalledWith("QUICKEASE_TOKEN", "mocked.jwt.token", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      expect(reply.code).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith({ role: "user" });
    });

    test("should return 500 if error is thrown", async () => {
      (db_client.user.findUnique as jest.Mock).mockImplementation(() => {
        throw new Error("DB Down");
      });

      const reply = createMockReply();
      await register_user(
        {
          body: {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            password: "123456",
          },
        } as any,
        reply as any
      );

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Internal server error. Could not register user.",
      });
    });
  });

  describe("logout", () => {
    test("should clear cookie and return 200", async () => {
      const reply = createMockReply();
      await logout({} as any, reply as any);

      expect(reply.clearCookie).toHaveBeenCalledWith("QUICKEASE_TOKEN");
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith("Logout successfully.");
    });

    test("should return 500 if logout throws", async () => {
      const reply = createMockReply();
      reply.clearCookie = jest.fn(() => {
        throw new Error("fail");
      });

      await logout({} as any, reply as any);
      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith("Error occurred while logging out.");
    });
  });
});
