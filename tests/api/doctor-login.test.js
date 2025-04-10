import handler from "../../src/pages/api/doctor-login";
import { createMocks } from "node-mocks-http";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../src/lib/firebaseConfig";
import bcrypt from "bcryptjs";

// Mock dependencies
jest.mock("../../src/lib/firebaseConfig", () => ({
  db: jest.fn(), // Mock db object
}));

jest.mock("firebase/firestore", () => {
  const mockDoc = {
    data: jest.fn().mockReturnValue({
      id: "doctor-123",
      email: "john.doe@example.com",
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

jest.mock("bcryptjs", () => ({
  compare: jest.fn().mockResolvedValue(true), // Mock password comparison, default to true
}));

describe("POST /api/doctor-login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks to default behavior
    bcrypt.compare.mockResolvedValue(true);
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        {
          data: jest.fn().mockReturnValue({
            id: "doctor-123",
            email: "john.doe@example.com",
            password: "hashedPassword",
          }),
        },
      ],
    });
  });

  it("should log in doctor with correct credentials", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "john.doe@example.com",
        password: "password123",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Login successful",
      redirectTo: "/doctor/doctor-123",
    });
    expect(collection).toHaveBeenCalledWith(db, "doctors");
    expect(where).toHaveBeenCalledWith("email", "==", "john.doe@example.com");
    expect(query).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(getDocs).toHaveBeenCalledWith(expect.anything());
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
  });

  it("should return 400 if email or password is missing", async () => {
    const testCases = [
      { email: "", password: "password123" },
      { email: "john.doe@example.com", password: "" },
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

  it("should return 400 if doctor is not found", async () => {
    getDocs.mockResolvedValueOnce({ empty: true, docs: [] }); // No doctor found

    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "john.doe@example.com",
        password: "password123",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Invalid email or password",
    });
  });

  it("should return 400 if password is incorrect", async () => {
    bcrypt.compare.mockResolvedValueOnce(false); // Password mismatch

    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "john.doe@example.com",
        password: "wrongpassword",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
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
        email: "john.doe@example.com",
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