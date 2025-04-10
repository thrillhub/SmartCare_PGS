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
    // Reset sendMail mock to resolve successfully by default
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
      from: "smartcareconnects@gmail.com",
      to: "doctor@example.com",
      subject: "New Appointment Booking",
      html: `<p>You have a new appointment booking!</p>
             <p><strong>Patient Details:</strong></p>
             <p>Name: John Doe</p>
             <p>Disease: Flu</p>
             <p>Appointment Date: 2025-04-15</p>
             <p>Appointment Time: 10:00</p>
             <p>Message: Please check my symptoms</p>`,
    });
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: "smartcareconnects@gmail.com",
      to: "patient@example.com",
      subject: "Appointment Confirmation",
      html: `<p>Your appointment has been successfully booked!</p>
             <p><strong>Appointment Details:</strong></p>
             <p>Doctor: Dr. Smith</p>
             <p>Disease: Flu</p>
             <p>Appointment Date: 2025-04-15</p>
             <p>Appointment Time: 10:00</p>
             <p>Message: Please check my symptoms</p>
             <p>Thank you for choosing our service!</p>`,
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