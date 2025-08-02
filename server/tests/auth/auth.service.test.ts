import db_client from "../../utils/client";
import { hashPassword } from "../../utils/hash";
import bcrypt from "bcrypt";
import { loginUser, registerUser } from "../../modules/auth/auth.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

jest.mock("../../utils/client", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("../../utils/hash", () => ({
  hashPassword: jest.fn(),
}));

describe("Auth Services", () => {
  const userEmail = "jdoe@gmail.com";
  const userPassword = "secret123";

  const mockUser = {
    id: "1",
    email: userEmail,
    password: "hashed-pass",
    first_name: "John",
    last_name: "Doe",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // login user
  describe("loginUser", () => {
    it("should return user if email and password match", async () => {
      (db_client.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await loginUser(userEmail, userPassword);

      expect(db_client.user.findUnique).toHaveBeenCalledWith({ where: { email: userEmail } });
      expect(bcrypt.compare).toHaveBeenCalledWith(userPassword, mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it("should return false if user is not found", async () => {
      (db_client.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await loginUser(userEmail, userPassword);

      expect(result).toBe(false);
    });

    it("should return false if password does not match", async () => {
      (db_client.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await loginUser(userEmail, userPassword);

      expect(result).toBe(false);
    });

    it("should throw an error if login fails", async () => {
      (db_client.user.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(loginUser(userEmail, userPassword)).rejects.toThrow("User login failed.");
    });
  });

  describe("registerUser", () => {
    it("should create a new user account", async () => {
      (hashPassword as jest.Mock).mockResolvedValue("hashed-pass");
      (db_client.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await registerUser(mockUser.first_name, mockUser.last_name, mockUser.email, userPassword);

      expect(hashPassword).toHaveBeenCalledWith(userPassword);

      expect(db_client.user.create).toHaveBeenCalledWith({
        data: {
          first_name: mockUser.first_name,
          last_name: mockUser.last_name,
          email: mockUser.email,
          password: "hashed-pass",
        },
      });

      expect(result).toEqual(mockUser);
    });

    it("should throw an error if registration fails", async () => {
      (hashPassword as jest.Mock).mockResolvedValue("hashed-pass");
      (db_client.user.create as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(registerUser(mockUser.first_name, mockUser.last_name, mockUser.email, userPassword)).rejects.toThrow(
        "User registration failed"
      );
    });

    it("should throw an error if email is already registered", async () => {
      const duplicateEmailError = new PrismaClientKnownRequestError("Duplicate email", {
        code: "P2002",
        clientVersion: "^6.9.0",
        meta: { target: ["email"] },
      });

      (hashPassword as jest.Mock).mockResolvedValue("hashed-pass");
      (db_client.user.create as jest.Mock).mockRejectedValue(duplicateEmailError);

      await expect(registerUser(mockUser.first_name, mockUser.last_name, mockUser.email, userPassword)).rejects.toThrow(
        "User registration failed"
      );
    });
  });
});
