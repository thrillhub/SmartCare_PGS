import handler from "../../src/pages/api/send-email";
import { createMocks } from "node-mocks-http";
import nodemailer from "nodemailer";

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true), // Mock sendMail to resolve successfully
  }),
}));

describe("POST /api/send-email", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nodemailer.createTransport().sendMail.mockResolvedValue(true);
  });

  it("should send emails successfully", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        doctorEmail: "doctor@example.com",
        patientEmail: "patient@example.com",
        patientDetails: {
          firstName: "John",
          lastName: "Doe",
          selectedDisease: "Flu",
          appointmentDate: "2025-04-15",
          appointmentTime: "10:00",
          message: "Please check my symptoms",
          selectedDoctor: "Smith",
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Emails sent successfully!",
    });
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "smartcareconnects@gmail.com",
        pass: "uwgq dhjs hdyc zhsj",
      },
    });
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(2);
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: '"SmartCare Connects" <smartcareconnects@gmail.com>',
      to: "doctor@example.com",
      subject: "New Appointment: John Doe - 2025-04-15",
      html: expect.stringContaining("New Appointment Booking"), // Match part of the new HTML
    });
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: '"SmartCare Connects" <smartcareconnects@gmail.com>',
      to: "patient@example.com",
      subject: "Appointment Confirmation with Dr. Smith - 2025-04-15",
      html: expect.stringContaining("Appointment Confirmation"), // Match part of the new HTML
    });
  });

  it("should return 400 if required fields are missing", async () => {
    const testCases = [
      { doctorEmail: "", patientEmail: "patient@example.com", patientDetails: { firstName: "John", lastName: "Doe", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms", selectedDoctor: "Smith" } },
      { doctorEmail: "doctor@example.com", patientEmail: "", patientDetails: { firstName: "John", lastName: "Doe", selectedDisease: "Flu", appointmentDate: "2025-04-15", appointmentTime: "10:00", message: "Please check my symptoms", selectedDoctor: "Smith" } },
      { doctorEmail: "doctor@example.com", patientEmail: "patient@example.com", patientDetails: null },
      { doctorEmail: "", patientEmail: "", patientDetails: null },
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
        error: "Doctor's email, patient's email, and patient details are required.",
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

  it("should return 500 if email sending fails", async () => {
    nodemailer.createTransport().sendMail.mockRejectedValueOnce(new Error("Email error")); // Simulate email failure

    const { req, res } = createMocks({
      method: "POST",
      body: {
        doctorEmail: "doctor@example.com",
        patientEmail: "patient@example.com",
        patientDetails: {
          firstName: "John",
          lastName: "Doe",
          selectedDisease: "Flu",
          appointmentDate: "2025-04-15",
          appointmentTime: "10:00",
          message: "Please check my symptoms",
          selectedDoctor: "Smith",
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Failed to send email.",
    });
  });
});