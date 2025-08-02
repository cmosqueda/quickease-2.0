jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../../modules/auth/auth.service", () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

import { login_user, register_user, logout } from "../../modules/auth/auth.controller";
import * as authService from "../../modules/auth/auth.service";
import { changeUserEmail, toggleProfileVisibility, viewProfile } from "../../modules/user/user.service";
import db_client from "../../utils/client";
import { FastifyRequest, FastifyReply } from "fastify";

describe("Auth Controller", () => {
  const mockReply = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
    setCookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    jwtSign: jest.fn().mockResolvedValue("mock-token"),
  } as Partial<FastifyReply> as FastifyReply;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login_user", () => {
    it("should return 400 if email or password is missing", async () => {
      const mockRequest = {
        body: { email: "", password: "" },
      } as FastifyRequest;

      await login_user(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Email and password are required.",
      });
    });

    it("should return 400 if credentials are invalid", async () => {
      (authService.loginUser as jest.Mock).mockResolvedValue(null);

      const mockRequest = {
        body: { email: "invalid@example.com", password: "wrongpass" },
      } as FastifyRequest;

      await login_user(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Invalid email/password, check your credentials.",
      });
    });

    it("should return 200 if login is successful", async () => {
      const mockUser = {
        id: "1",
        email: "valid@example.com",
        password: "hashedpass",
        is_admin: true,
      };

      (authService.loginUser as jest.Mock).mockResolvedValue(mockUser);

      const mockRequest = {
        body: { email: "valid@example.com", password: "correctpass" },
      } as FastifyRequest;

      await login_user(mockRequest, mockReply);

      expect(mockReply.setCookie).toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        ...mockUser,
        password: null,
        is_admin: true,
      });
    });

    it("should return 500 on unexpected error", async () => {
      (authService.loginUser as jest.Mock).mockRejectedValue(new Error("DB fail"));

      const mockRequest = {
        body: { email: "user@example.com", password: "pass" },
      } as FastifyRequest;

      await login_user(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Internal server error. Please try again later.",
      });
    });
  });

  describe("register_user", () => {
    const baseBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "secret",
    };

    it("should return 400 if any required field is missing", async () => {
      const fields = ["firstName", "lastName", "email", "password"];

      for (const field of fields) {
        const mockBody = { ...baseBody, [field]: "" };
        const mockRequest = { body: mockBody } as FastifyRequest;

        await register_user(mockRequest, mockReply);

        expect(mockReply.code).toHaveBeenCalledWith(400);
      }
    });

    it("should return 406 if email already exists", async () => {
      (db_client.user.findUnique as jest.Mock).mockResolvedValue({ id: "existing-id" });

      const mockRequest = { body: baseBody, user: null } as FastifyRequest;

      await register_user(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(406);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Email already in use.",
      });
    });

    it("should return 201 if registration succeeds", async () => {
      (db_client.user.findUnique as jest.Mock).mockResolvedValue(null);
      (authService.registerUser as jest.Mock).mockResolvedValue({
        id: "1",
        email: baseBody.email,
        is_admin: false,
        password: "hashed",
      });

      const mockRequest = { body: baseBody, user: null } as FastifyRequest;

      await register_user(mockRequest, mockReply);

      expect(mockReply.setCookie).toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        id: "1",
        email: baseBody.email,
        is_admin: false,
        password: null,
      });
    });

    it("should return 500 on unexpected error", async () => {
      (db_client.user.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));

      const mockRequest = { body: baseBody } as FastifyRequest;

      await register_user(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Internal server error. Could not register user.",
      });
    });
  });

  describe("logout", () => {
    it("should clear cookie and return 200", async () => {
      const mockRequest = {} as FastifyRequest;

      await logout(mockRequest, mockReply);

      expect(mockReply.clearCookie).toHaveBeenCalledWith("QUICKEASE_TOKEN", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith("Logout successfully.");
    });

    it("should return 500 if an error occurs", async () => {
      mockReply.clearCookie = jest.fn().mockImplementation(() => {
        throw new Error("Logout error");
      });

      const mockRequest = {} as FastifyRequest;

      await logout(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith("Error occurred while logging out.");
    });
  });
});
