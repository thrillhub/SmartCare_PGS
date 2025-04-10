jest.mock("../../src/lib/firebaseConfig", () => ({
    db: jest.fn(),
  }));
  
  jest.mock("firebase/firestore", () => ({
    collection: jest.fn().mockReturnValue({}), // Return mock collection reference
    doc: jest.fn().mockReturnValue({}), // Return mock document reference
    setDoc: jest.fn().mockResolvedValue(true),
  }));
  
  jest.mock("bcryptjs", () => ({
    hash: jest.fn().mockResolvedValue("hashedPassword"),
  }));
  
  jest.mock("uuid", () => ({
    v4: () => "test-uuid",
  }));
  
  import handler from "../../src/pages/api/register";
  import { createMocks } from "node-mocks-http";
  import { collection, doc, setDoc } from "firebase/firestore";
  import { db } from "../../src/lib/firebaseConfig";
  import bcrypt from "bcryptjs";
  
  describe("POST /api/register", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      setDoc.mockResolvedValue(true);
    });
  
    it("should register a user successfully", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "password123",
        },
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        message: "User registered successfully",
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(collection).toHaveBeenCalledWith(db, "users");
      expect(doc).toHaveBeenCalledWith(expect.anything(), "test-uuid");
      expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
        id: "test-uuid",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "hashedPassword",
      });
    });
  
    it("should return 400 if required fields are missing", async () => {
      const testCases = [
        { email: "john@example.com", password: "password" },
        { firstName: "John", lastName: "Doe", password: "password" },
        { firstName: "John", lastName: "Doe", email: "john@example.com" },
        {},
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
        const { req, res } = createMocks({ method });
  
        await handler(req, res);
  
        expect(res._getStatusCode()).toBe(405);
        expect(JSON.parse(res._getData())).toEqual({
          error: `Method ${method} Not Allowed`,
        });
        expect(res._getHeaders()).toHaveProperty("allow", ["POST"]);
      }
    });
  
    it("should return 500 if database operation fails", async () => {
      setDoc.mockRejectedValueOnce(new Error("Database error"));
  
      const { req, res } = createMocks({
        method: "POST",
        body: {
          firstName: "John",
          lastName: "Doe",
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