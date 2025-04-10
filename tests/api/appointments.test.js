import handler from "../../src/pages/api/appointments";
import { createMocks } from "node-mocks-http";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../src/lib/firebaseConfig";

// Mock dependencies
jest.mock("../../src/lib/firebaseConfig", () => ({
  db: jest.fn(), // Mock db object
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn().mockReturnValue({}), // Mock collection reference
  doc: jest.fn().mockReturnValue({}), // Mock document reference
  setDoc: jest.fn().mockResolvedValue(true), // Mock setDoc to resolve successfully
}));

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("test-uuid"), // Mock UUID generation
}));

describe("POST /api/appointments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setDoc.mockResolvedValue(true); // Ensure setDoc resolves successfully by default
  });

  it("should book an appointment successfully", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
        age: "30",
        gender: "Male",
        selectedDoctor: "Dr. Smith",
        selectedDisease: "Flu",
        appointmentDate: "2025-04-15",
        appointmentTime: "10:00",
        message: "Please check my symptoms",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Appointment booked successfully",
    });
    expect(collection).toHaveBeenCalledWith(db, "appoinments"); // Note: Typo in collection name preserved from handler
    expect(doc).toHaveBeenCalledWith(expect.anything(), "test-uuid");
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
      id: "test-uuid",
      first_name: "John",
      last_name: "Doe",
      address: "123 Main St",
      phone_number: "1234567890",
      email: "john.doe@example.com",
      age: "30",
      gender: "Male",
      selected_doctor: "Dr. Smith",
      selected_disease: "Flu",
      appointment_date: "2025-04-15",
      appointment_time: "10:00",
      message: "Please check my symptoms",
      expirationDate: expect.any(Date), // Dynamic Date object
      created_at: expect.any(String), // ISO string for created_at
    });
  });

  it("should return 400 if required fields are missing", async () => {
    const testCases = [
      { firstName: "", lastName: "Doe", address: "123 Main St", phoneNumber: "1234567890", email: "john.doe@example.com", age: "30", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "", address: "123 Main St", phoneNumber: "1234567890", email: "john.doe@example.com", age: "30", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "", phoneNumber: "1234567890", email: "john.doe@example.com", age: "30", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "", email: "john.doe@example.com", age: "30", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "1234567890", email: "", age: "30", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "1234567890", email: "john.doe@example.com", age: "", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "1234567890", email: "john.doe@example.com", age: "30", gender: "", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "1234567890", email: "john.doe@example.com", age: "30", gender: "Male", selectedDoctor: "", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "1234567890", email: "john.doe@example.com", age: "30", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "1234567890", email: "john.doe@example.com", age: "30", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "", appointmentTime: "10:00", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "1234567890", email: "john.doe@example.com", age: "30", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "", message: "Please check my symptoms" },
      { firstName: "John", lastName: "Doe", address: "123 Main St", phoneNumber: "1234567890", email: "john.doe@example.com", age: "30", gender: "Male", selectedDoctor: "Dr. Smith", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "" },
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
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
        age: "30",
        gender: "Male",
        selectedDoctor: "Dr. Smith",
        selectedDisease: "Flu",
        appointmentDate: "2025-04-15",
        appointmentTime: "10:00",
        message: "Please check my symptoms",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Internal Server Error",
    });
  });
});