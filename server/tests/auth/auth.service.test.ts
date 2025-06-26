import { loginUser, registerUser } from "../../modules/auth/auth.service";
import db_client from "../../utils/client";
import bcrypt, { compare } from "bcrypt";
import * as hashUtils from "../../utils/hash";

// mock prisma db
jest.mock("../../utils/client", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt");

describe("Auth Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //   login user
  describe("loginUser", () => {
    // if user not found
    test("should return false if user is not found", async () => {
      expect.assertions(1);
      (db_client.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await loginUser("test@example.com", "password123");
      expect(result).toBe(false);
    });

    // if password does not match
    test("should return false if password does not match", async () => {
      expect.assertions(1);
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
      };

      (db_client.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await loginUser("test@example.com", "wrongPassword");
      expect(result).toBe(false);
    });

    // if email or password is missing => edge cases
    test("should return false if email or password is missing", async () => {
      expect.assertions(1);
      const result = await loginUser("", "");
      expect(result).toBe(false);
    });

    // if credentials match
    test("should return user if credentials match", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
      };

      (db_client.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await loginUser("test@example.com", "correctPassword");
      expect(result).toEqual(mockUser);
    });
  });

  //   register user
  describe("registerUser", () => {
    // should register user and hash password
    test("should hash password and create user instance", async () => {
      const mockHashedPassword = "hashed123";
      const mockUser = {
        id: "1",
        first_name: "Jane",
        last_name: "Doe",
        email: "janedoe@example.com",
        password: mockHashedPassword,
      };

      jest.spyOn(hashUtils, "hashPassword").mockResolvedValue(mockHashedPassword);
      (db_client.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await registerUser("Jane", "Doe", "janedoe@example.com", "plainPassword");

      expect(hashUtils.hashPassword).toHaveBeenCalledWith("plainPassword");
      expect(db_client.user.create).toHaveBeenCalledWith({
        data: {
          first_name: "Jane",
          last_name: "Doe",
          email: "janedoe@example.com",
          password: mockHashedPassword,
        },
      });

      expect(result).toEqual(mockUser);
    });

    test("should throw error if user creation fails", async () => {
      jest.spyOn(hashUtils, "hashPassword").mockResolvedValue("hashed123");
      (db_client.user.create as jest.Mock).mockRejectedValue(new Error("DB error"));

      await expect(registerUser("Jane", "Doe", "janedoe@example.com", "plainPassword")).rejects.toThrow(
        "User registration failed"
      );
    });
  });
});
