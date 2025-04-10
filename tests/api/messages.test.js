import handler from "../../src/pages/api/messages/[appointmentId]";
import { createMocks } from "node-mocks-http";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../src/lib/firebaseConfig";

// Mock dependencies
jest.mock("../../src/lib/firebaseConfig", () => ({
  db: jest.fn(), // Mock db object
}));

jest.mock("firebase/firestore", () => {
  const mockDoc1 = {
    id: "msg1",
    data: jest.fn().mockReturnValue({
      appointmentId: "appt123",
      text: "Hello, doctor!",
      sender: "patient",
      timestamp: "2025-04-10T10:00:00Z",
    }),
  };
  const mockDoc2 = {
    id: "msg2",
    data: jest.fn().mockReturnValue({
      appointmentId: "appt123",
      text: "Hi, patient!",
      sender: "doctor",
      timestamp: "2025-04-10T10:05:00Z",
    }),
  };

  return {
    collection: jest.fn().mockReturnValue({}), // Mock collection reference
    query: jest.fn().mockReturnValue({}), // Mock query reference
    where: jest.fn().mockReturnValue({}), // Mock where clause
    getDocs: jest.fn().mockResolvedValue({
      docs: [mockDoc1, mockDoc2], // Return mock documents
    }),
  };
});

describe("GET /api/messages/[appointmentId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset getDocs mock to default behavior
    getDocs.mockResolvedValue({
      docs: [
        {
          id: "msg1",
          data: jest.fn().mockReturnValue({
            appointmentId: "appt123",
            text: "Hello, doctor!",
            sender: "patient",
            timestamp: "2025-04-10T10:00:00Z",
          }),
        },
        {
          id: "msg2",
          data: jest.fn().mockReturnValue({
            appointmentId: "appt123",
            text: "Hi, patient!",
            sender: "doctor",
            timestamp: "2025-04-10T10:05:00Z",
          }),
        },
      ],
    });
  });

  it("should fetch messages successfully for a given appointmentId", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        appointmentId: "appt123",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([
      {
        id: "msg1",
        appointmentId: "appt123",
        text: "Hello, doctor!",
        sender: "patient",
        timestamp: "2025-04-10T10:00:00Z",
      },
      {
        id: "msg2",
        appointmentId: "appt123",
        text: "Hi, patient!",
        sender: "doctor",
        timestamp: "2025-04-10T10:05:00Z",
      },
    ]);
    expect(collection).toHaveBeenCalledWith(db, "messages");
    expect(where).toHaveBeenCalledWith("appointmentId", "==", "appt123");
    expect(query).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(getDocs).toHaveBeenCalledWith(expect.anything());
  });

  it("should return an empty array if no messages are found", async () => {
    getDocs.mockResolvedValueOnce({ docs: [] }); // No messages found

    const { req, res } = createMocks({
      method: "GET",
      query: {
        appointmentId: "appt123",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([]);
    expect(collection).toHaveBeenCalledWith(db, "messages");
    expect(where).toHaveBeenCalledWith("appointmentId", "==", "appt123");
    expect(query).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(getDocs).toHaveBeenCalledWith(expect.anything());
  });

  it("should return 405 if method is not GET", async () => {
    const methods = ["POST", "PUT", "DELETE", "PATCH"];

    for (const method of methods) {
      const { req, res } = createMocks({
        method,
        query: {
          appointmentId: "appt123",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Method not allowed",
      });
    }
  });

  it("should return 500 if fetching messages fails", async () => {
    getDocs.mockRejectedValueOnce(new Error("Database error")); // Simulate DB failure

    const { req, res } = createMocks({
      method: "GET",
      query: {
        appointmentId: "appt123",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Internal server error",
    });
  });
});