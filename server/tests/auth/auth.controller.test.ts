// Mock the db_client before importing anything else
jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

import * as authService from "../../modules/auth/auth.service";
import { login_user } from "../../modules/auth/auth.controller";
import { FastifyReply, FastifyRequest } from "fastify";

// Define mockReply and test data
const userEmail = "jdoe@gmail.com";
const userPassword = "secret123";

const mockUserData = {
  id: "1",
  first_name: "John",
  last_name: "Doe",
  email: userEmail,
  password: "hashed-pass",
  is_admin: false,
};

const mockToken = "fake-jwt-token";

const mockReply = {
  code: jest.fn().mockReturnThis(),
  send: jest.fn(),
  jwtSign: jest.fn().mockResolvedValue(mockToken),
  setCookie: jest.fn().mockReturnThis(),
} as unknown as FastifyReply;

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login_user", () => {
    it("should return 200 with user data and set token cookie", async () => {
      const mockRequest = {
        body: {
          email: userEmail,
          password: userPassword,
        },
      } as unknown as FastifyRequest;

      jest.spyOn(authService, "loginUser").mockResolvedValue(mockUserData);

      await login_user(mockRequest, mockReply);

      expect(authService.loginUser).toHaveBeenCalledWith(userEmail, userPassword);
      expect(mockReply.jwtSign).toHaveBeenCalledWith(mockUserData);
      expect(mockReply.setCookie).toHaveBeenCalledWith("QUICKEASE_TOKEN", mockToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        ...mockUserData,
        password: null,
        is_admin: false,
      });
    });
  });
});
