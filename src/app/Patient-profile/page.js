"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import ChatModal from "../Components/ChatModal";
import Chat from "../Components/Chat";
import UnreadBadge from "../Components/UnreadBadge";
import { createLocalVideoTrack, connect } from "twilio-video";

export default function PatientProfile() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [room, setRoom] = useState(null);
  const [localTrack, setLocalTrack] = useState(null);

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/api/login";
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);
  }, []);

  // Track unread messages
  useEffect(() => {
    if (!user?.email) return;

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("recipientEmail", "==", user.email), // Use email instead of ID
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.appointmentId) {
          counts[data.appointmentId] = (counts[data.appointmentId] || 0) + 1;
        }
      });
      setUnreadCounts(counts);
    });

    return () => unsubscribe();
  }, [user?.email]);

  useEffect(() => {
    if (user) {
      const appointmentsRef = collection(db, "appoinments");
      const unsubscribe = onSnapshot(appointmentsRef, (snapshot) => {
        const updatedAppointments = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((appointment) => appointment.email === user.email);
        setAppointments(updatedAppointments);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const startVideoCall = async (doctorId) => {
    if (!user) return;

    const identity = user.id; // Patient's unique identity
    const response = await fetch(`/api/twilio/token?identity=${identity}`);
    const data = await response.json();
    const token = data.token;

    // Create local video track
    const localVideoTrack = await createLocalVideoTrack();
    setLocalTrack(localVideoTrack);

    // Connect to Twilio Video room
    const newRoom = await connect(token, {
      name: "video-call-room", // Use the same room name
      tracks: [localVideoTrack],
    });

    setRoom(newRoom);

    newRoom.on("participantConnected", (participant) => {
      console.log(`${participant.identity} joined the room`);

      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed) {
          attachTrack(publication.track);
        }
      });

      participant.on("trackSubscribed", (track) => {
        attachTrack(track);
      });
    });
  };

  const attachTrack = (track) => {
    const remoteVideoContainer = document.getElementById("remote-video");
    remoteVideoContainer.appendChild(track.attach());
  };

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
      if (localTrack) {
        localTrack.stop();
      }
    };
  }, [room, localTrack]);

  // Function to convert 24-hour time to 12-hour format with AM/PM
  const formatTimeTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    let hours12 = parseInt(hours, 10);
    const ampm = hours12 >= 12 ? "PM" : "AM";
    hours12 = hours12 % 12;
    hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
    return `${hours12}:${minutes} ${ampm}`;
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  const currentDateTime = new Date();

  return (
    <>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#f4f7fb",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "220px",
            backgroundColor: "#2d3f50",
            color: "white",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <nav>
              <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                <li>
                  <a
                    href="#"
                    onClick={() => setActiveSection("profile")}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      padding: "12px",
                      display: "block",
                      borderRadius: "8px",
                      backgroundColor:
                        activeSection === "profile" ? "#4a90e2" : "#2b6cb0",
                      marginBottom: "10px",
                      fontFamily: "Roboto",
                      transition: "background-color 0.3s",
                    }}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/doctor-appointment"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      padding: "12px",
                      display: "block",
                      borderRadius: "8px",
                      backgroundColor: "#2b6cb0",
                      marginBottom: "10px",
                      fontFamily: "Roboto",
                      transition: "background-color 0.3s",
                    }}
                  >
                    Book Appointment
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => setActiveSection("myAppointments")}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      padding: "12px",
                      display: "block",
                      borderRadius: "8px",
                      backgroundColor:
                        activeSection === "myAppointments"
                          ? "#4a90e2"
                          : "#2b6cb0",
                      marginBottom: "10px",
                      fontFamily: "Roboto",
                      transition: "background-color 0.3s",
                    }}
                  >
                    My Appointments
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#e53e3e",
              color: "white",
              borderRadius: "8px",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div style={{ flex: "1", padding: "24px", backgroundColor: "#dce3ea" }}>
          {activeSection === "profile" && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#2d3748",
                  marginBottom: "24px",
                  fontFamily: "Roboto",
                }}
              >
                <span style={{ color: "#2b6cb0", fontWeight: "bold" }}>
                  Welcome,
                </span>{" "}
                Mr. {user.firstName}
              </h2>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  fontFamily: "Roboto",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#edf2f7" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Field
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: "#fff" }}>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Full Name:
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >{`${user.firstName} ${user.lastName}`}</td>
                  </tr>
                  <tr style={{ backgroundColor: "#f9f9f9" }}>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Email:
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {user.email}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeSection === "myAppointments" && (
            <div>
              {appointments.length > 0 ? (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "0 auto",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#2d3f50", color: "#fff" }}>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "16px",
                        }}
                      >
                        Doctor
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "16px",
                        }}
                      >
                        Doctor Email
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "16px",
                        }}
                      >
                        Phone Number
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "16px",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "16px",
                        }}
                      >
                        Time
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "16px",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "16px",
                        }}
                      >
                        Chat
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => {
                      const isExpired =
                        new Date(
                          appointment.appointmentDate +
                            " " +
                            appointment.appointmentTime
                        ) < currentDateTime;
                      return (
                        <tr
                          key={appointment.id}
                          style={{ borderBottom: "1px solid #ddd" }}
                        >
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {appointment.selectedDoctor}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {appointment.doctorEmail}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {appointment.doctorPhoneNumber}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {appointment.appointmentDate}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {formatTimeTo12Hour(appointment.appointmentTime)}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {isExpired ? (
                              <span style={{ color: "red" }}>
                                Expired
                              </span>
                            ) : (
                              <span style={{ color: "green" }}>Upcoming</span>
                            )}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            <button
                              onClick={() => {
                                setSelectedDoctor(appointment);
                                setChatOpen(true);
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#2b6cb0")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "#2d3f50")
                              }
                              style={{
                                position: "relative",
                                backgroundColor: "#2d3f50",
                                color: "white",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              Chat
                              <UnreadBadge
                                count={unreadCounts[appointment.id] || 0}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p
                  style={{
                    padding: "50px",
                    textAlign: "center",
                    color: "#f44336",
                    fontSize: "18px",
                  }}
                >
                  No appointments found.
                </p>
              )}
            </div>
          )}
        </div>

        {chatOpen && selectedDoctor && (
          <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)}>
            <Chat
              appointmentId={selectedDoctor.id}
              currentUser={{
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email, // Add email to currentUser
                type: "patient",
              }}
              recipientUser={{
                id: selectedDoctor.doctorId,
                name: selectedDoctor.selectedDoctor,
                email: selectedDoctor.doctorEmail, // Add email to recipientUser
                type: "doctor",
              }}
            />
          </ChatModal>
        )}
        <div id="local-video"></div>
        <div id="remote-video"></div>
      </div>
    </>
  );
}