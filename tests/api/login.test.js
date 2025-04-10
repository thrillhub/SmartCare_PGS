import handler from "../../src/pages/api/login";
import { createMocks } from "node-mocks-http";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../src/lib/firebaseConfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  compare: jest.fn().mockResolvedValue(true), // Default to true for successful login
}));

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mocked-jwt-token"),
}));

// Mock Firebase Firestore
jest.mock("../../src/lib/firebaseConfig", () => ({
  db: jest.fn(), // Mock db object
}));

jest.mock("firebase/firestore", () => {
  const mockDoc = {
    data: jest.fn().mockReturnValue({
      id: "user-123",
      email: "john@example.com",
      first_name: "John",
      last_name: "Doe",
      password: "hashedPassword",
    }),
  };

  return {
    collection: jest.fn().mockReturnValue({}), // Mock collection reference
    query: jest.fn().mockReturnValue({}), // Mock query reference
    where: jest.fn().mockReturnValue({}), // Mock where clause
    getDocs: jest.fn().mockResolvedValue({
      empty: false,
      docs: [mockDoc], // Return a single mock document
    }),
  };
});

describe("POST /api/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks to default behavior
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mocked-jwt-token");
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        {
          data: jest.fn().mockReturnValue({
            id: "user-123",
            email: "john@example.com",
            first_name: "John",
            last_name: "Doe",
            password: "hashedPassword",
          }),
        },
      ],
    });
  });

  it("should log in user with correct credentials", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "john@example.com",
        password: "password123",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Login successful",
      token: "mocked-jwt-token",
    });
    expect(collection).toHaveBeenCalledWith(db, "users");
    expect(where).toHaveBeenCalledWith("email", "==", "john@example.com");
    expect(query).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(getDocs).toHaveBeenCalledWith(expect.anything());
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: "user-123",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  it("should return 400 if email or password is missing", async () => {
    const testCases = [
      { email: "", password: "password123" },
      { email: "john@example.com", password: "" },
      { email: "", password: "" },
    ];

    for (const body of testCases) {
      const { req, res } = createMocks({
        method: "POST",
        body,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Email and password are required",
      });
    }
  });

  it("should return 401 if user is not found", async () => {
    getDocs.mockResolvedValueOnce({ empty: true, docs: [] }); // No user found

    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "john@example.com",
        password: "password123",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Invalid email or password",
    });
  });

  it("should return 401 if password is incorrect", async () => {
    bcrypt.compare.mockResolvedValueOnce(false); // Password mismatch

    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "john@example.com",
        password: "wrongpassword",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Invalid email or password",
    });
  });

  it("should return 405 if method is not POST", async () => {
    const methods = ["GET", "PUT", "DELETE", "PATCH"];

    for (const method of methods) {
      const { req, res } = createMocks({
        method,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        error: `Method ${method} Not Allowed`,
      });
      expect(res._getHeaders()).toHaveProperty("allow", ["POST"]);
    }
  });

  it("should return 500 if an error occurs", async () => {
    getDocs.mockRejectedValueOnce(new Error("Database error")); // Simulate DB failure

    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "john@example.com",
        password: "password123",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Internal Server Error",
    });
  });
});