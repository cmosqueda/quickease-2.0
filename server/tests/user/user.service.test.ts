import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));
