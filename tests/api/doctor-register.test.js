import handler from "../../src/pages/api/doctor-register";
import { createMocks } from "node-mocks-http";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../src/lib/firebaseConfig";
import bcrypt from "bcryptjs";

// Mock dependencies
jest.mock("../../src/lib/firebaseConfig", () => ({
  db: jest.fn(), // Mock db object
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn().mockReturnValue({}), // Mock collection reference
  doc: jest.fn().mockReturnValue({}), // Mock document reference
  setDoc: jest.fn().mockResolvedValue(true), // Mock setDoc to resolve successfully
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"), // Mock password hashing
}));

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("test-uuid"), // Mock UUID generation
}));

describe("POST /api/doctor-register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setDoc.mockResolvedValue(true); // Ensure setDoc resolves successfully by default
  });

  it("should register a doctor successfully", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        fullName: "Dr. John Doe",
        address: "123 Main St",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        nmcNumber: "NMC12345",
        citizenshipNumber: "CIT12345",
        speciality: "Cardiology",
        password: "password123",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Doctor registered successfully",
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(collection).toHaveBeenCalledWith(db, "doctors");
    expect(doc).toHaveBeenCalledWith(expect.anything(), "test-uuid");
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
      id: "test-uuid",
      full_name: "Dr. John Doe",
      address: "123 Main St",
      email: "john.doe@example.com",
      phone_number: "1234567890",
      nmc_number: "NMC12345",
      citizenship_number: "CIT12345",
      speciality: "Cardiology",
      password: "hashedPassword",
      created_at: expect.any(String), // ISO string for created_at
    });
  });

  it("should return 400 if required fields are missing", async () => {
    const testCases = [
      { fullName: "", address: "123 Main St", email: "john.doe@example.com", phoneNumber: "1234567890", nmcNumber: "NMC12345", citizenshipNumber: "CIT12345", speciality: "Cardiology", password: "password123" },
      { fullName: "Dr. John Doe", address: "", email: "john.doe@example.com", phoneNumber: "1234567890", nmcNumber: "NMC12345", citizenshipNumber: "CIT12345", speciality: "Cardiology", password: "password123" },
      { fullName: "Dr. John Doe", address: "123 Main St", email: "", phoneNumber: "1234567890", nmcNumber: "NMC12345", citizenshipNumber: "CIT12345", speciality: "Cardiology", password: "password123" },
      { fullName: "Dr. John Doe", address: "123 Main St", email: "john.doe@example.com", phoneNumber: "", nmcNumber: "NMC12345", citizenshipNumber: "CIT12345", speciality: "Cardiology", password: "password123" },
      { fullName: "Dr. John Doe", address: "123 Main St", email: "john.doe@example.com", phoneNumber: "1234567890", nmcNumber: "", citizenshipNumber: "CIT12345", speciality: "Cardiology", password: "password123" },
      { fullName: "Dr. John Doe", address: "123 Main St", email: "john.doe@example.com", phoneNumber: "1234567890", nmcNumber: "NMC12345", citizenshipNumber: "", speciality: "Cardiology", password: "password123" },
      { fullName: "Dr. John Doe", address: "123 Main St", email: "john.doe@example.com", phoneNumber: "1234567890", nmcNumber: "NMC12345", citizenshipNumber: "CIT12345", speciality: "", password: "password123" },
      { fullName: "Dr. John Doe", address: "123 Main St", email: "john.doe@example.com", phoneNumber: "1234567890", nmcNumber: "NMC12345", citizenshipNumber: "CIT12345", speciality: "Cardiology", password: "" },
      {}, // Empty body
    ];

    for (const body of testCases) {
      const { req, res } = createMocks({
        method: "POST",
        body,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: "All fields are required",
      });
    }
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

  it("should return 500 if database operation fails", async () => {
    setDoc.mockRejectedValueOnce(new Error("Database error")); // Simulate DB failure

    const { req, res } = createMocks({
      method: "POST",
      body: {
        fullName: "Dr. John Doe",
        address: "123 Main St",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        nmcNumber: "NMC12345",
        citizenshipNumber: "CIT12345",
        speciality: "Cardiology",
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