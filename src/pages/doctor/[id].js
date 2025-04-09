"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import Chat from "../../app/Components/Chat";
import UnreadBadge from "../../app/Components/UnreadBadge";
import ChatModal from "../../app/Components/ChatModal";


function DoctorProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [activeSection, setActiveSection] = useState("Profile Overview");
  const currentDateTime = new Date();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  

  // Settings state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    speciality: "",
    bio: "",
    consultation_fee: "",
  });
  const [availability, setAvailability] = useState({
    monday: { available: true, start: "09:00", end: "17:00" },
    tuesday: { available: true, start: "09:00", end: "17:00" },
    wednesday: { available: true, start: "09:00", end: "17:00" },
    thursday: { available: true, start: "09:00", end: "17:00" },
    friday: { available: true, start: "09:00", end: "17:00" },
    saturday: { available: false, start: "09:00", end: "17:00" },
    sunday: { available: false, start: "09:00", end: "17:00" },
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  const formatTimeTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    let hours12 = parseInt(hours, 10);
    const ampm = hours12 >= 12 ? "PM" : "AM";
    hours12 = hours12 % 12 || 12;
    return `${hours12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (!id) return;

    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctor/${id}`);
        if (!response.ok) throw new Error("Failed to fetch doctor details");
        const data = await response.json();
        setDoctor(data);
        setFormData({
          phone_number: data.phone_number || "",
          speciality: data.speciality || "",
          bio: data.bio || "",
          consultation_fee: data.consultation_fee || "",
        });
        if (data.availability) setAvailability(data.availability);
        if (data.notificationPrefs) setNotificationPrefs(data.notificationPrefs);
        await fetchPatients(data.id);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (!doctor) return;

    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("recipientId", "==", doctor.id), where("read", "==", false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        counts[data.appointmentId] = (counts[data.appointmentId] || 0) + 1;
      });
      setUnreadCounts(counts);
    });

    return () => unsubscribe();
  }, [doctor]);

  const fetchPatients = async (doctorId) => {
    try {
      const response = await fetch(`/api/get-appointments?doctorId=${doctorId}`);
      const data = await response.json();
      if (response.ok) setPatients(data);
      else console.error("Error fetching patients:", data.error);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(collection(db, "appoinments"), (snapshot) => {
      const updatedPatients = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isExpired: new Date(`${doc.data().appointmentDate} ${doc.data().appointmentTime}`) < currentDateTime,
        }))
        .filter((appointment) => appointment.doctorId === id);
      setPatients(updatedPatients);
    });

    return () => unsubscribe();
  }, [id]);

  const handleChatOpen = (patient) => {
    setSelectedPatient(patient);
    setChatOpen(true);
    console.log("Chat opened for patient:", patient); // Debug log
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: { ...availability[day], [field]: field === "available" ? !availability[day].available : value },
    });
  };

  const handleNotificationChange = (type) => {
    setNotificationPrefs({ ...notificationPrefs, [type]: !notificationPrefs[type] });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const doctorRef = doc(db, "doctors", id);
      await updateDoc(doctorRef, {
        phone_number: formData.phone_number,
        speciality: formData.speciality,
        bio: formData.bio,
        consultation_fee: formData.consultation_fee,
        availability,
        notificationPrefs,
      });
      setDoctor({
        ...doctor,
        phone_number: formData.phone_number,
        speciality: formData.speciality,
        bio: formData.bio,
        consultation_fee: formData.consultation_fee,
        availability,
        notificationPrefs,
      });
      setSettingsSuccess("Profile updated successfully!");
      setSettingsError("");
      setTimeout(() => setSettingsSuccess(""), 3000);
    } catch (err) {
      setSettingsError("Failed to update profile. Please try again.");
      console.error("Error updating doctor profile:", err);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSettingsError("New passwords do not match");
      return;
    }
    try {
      setSettingsSuccess("Password updated successfully!");
      setSettingsError("");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSettingsSuccess(""), 3000);
    } catch (err) {
      setSettingsError("Failed to update password. Please try again.");
      console.error("Error updating password:", err);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.notFound}>{error}</div>;
  if (!doctor) return <div style={styles.notFound}>Doctor not found.</div>;

  const renderSection = () => {
    switch (activeSection) {
      case "Profile Overview":
        return (
          <div style={styles.card}>
            <div style={styles.infoGrid}>
              {[
                { label: "Full Name", value: doctor.full_name },
                { label: "Email", value: doctor.email },
                { label: "Phone Number", value: doctor.phone_number },
                { label: "NMC Number", value: doctor.nmc_number },
                { label: "Speciality", value: doctor.speciality },
                { label: "Consultation Fee", value: doctor.consultation_fee ? `$${doctor.consultation_fee}` : "Not set" },
                { label: "Bio", value: doctor.bio || "Not provided" },
              ].map((item, index) => (
                <div key={`info-${index}`} style={styles.infoItem}>
                  <strong>{item.label}:</strong> {item.value}
                </div>
              ))}
            </div>
          </div>
        );
      case "Patients":
        return (
          <div style={styles.patientsSection}>
            {patients.length > 0 ? (
              <table style={styles.patientTable}>
                <thead>
                  <tr style={styles.tableHeader}>
                    {["Full Name", "Age", "Gender", "Phone", "Disease", "Date", "Time", "Status", "Chat"].map((header, index) => (
                      <th key={`header-${index}`} style={styles.tableHeaderCell}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={`patient-${patient.id}`} style={styles.tableRow}>
                      <td style={styles.tableCell}>{`${patient.firstName} ${patient.lastName}`}</td>
                      <td style={styles.tableCell}>{patient.age}</td>
                      <td style={styles.tableCell}>{patient.gender}</td>
                      <td style={styles.tableCell}>{patient.phoneNumber}</td>
                      <td style={styles.tableCell}>{patient.selectedDisease}</td>
                      <td style={styles.tableCell}>{patient.appointmentDate}</td>
                      <td style={styles.tableCell}>{formatTimeTo12Hour(patient.appointmentTime)}</td>
                      <td style={styles.tableCell}>
                        {patient.isExpired ? <span style={{ color: "red" }}>Expired</span> : <span style={{ color: "green" }}>Upcoming</span>}
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          onClick={() => handleChatOpen(patient)}
                          style={{
                            position: "relative",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Chat <UnreadBadge count={unreadCounts[patient.id] || 0} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={styles.notFound}>No patients found for this doctor.</p>
            )}
          </div>
        );
      case "Settings":
        return (
          <div style={styles.settingsContainer}>
            <div style={styles.settingsCard}>
              <h2 style={styles.settingsTitle}>Profile Settings</h2>
              {settingsError && <div style={styles.errorMessage}>{settingsError}</div>}
              {settingsSuccess && <div style={styles.successMessage}>{settingsSuccess}</div>}
              <form onSubmit={handleProfileUpdate}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    placeholder="Enter phone number"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Speciality</label>
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    placeholder="Enter your speciality"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Consultation Fee ($)</label>
                  <input
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    placeholder="Enter consultation fee"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    style={{ ...styles.formInput, height: "100px" }}
                    placeholder="Tell patients about yourself"
                  />
                </div>
                <h3 style={styles.subsectionTitle}>Availability</h3>
                {Object.entries(availability).map(([day, schedule]) => (
                  <div key={day} style={styles.availabilityItem}>
                    <label style={styles.availabilityLabel}>
                      <input
                        type="checkbox"
                        checked={schedule.available}
                        onChange={() => handleAvailabilityChange(day, "available")}
                        style={styles.checkbox}
                      />
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </label>
                    {schedule.available && (
                      <div style={styles.timeInputs}>
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => handleAvailabilityChange(day, "start", e.target.value)}
                          style={styles.timeInput}
                        />
                        <span style={styles.timeSeparator}>to</span>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => handleAvailabilityChange(day, "end", e.target.value)}
                          style={styles.timeInput}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <h3 style={styles.subsectionTitle}>Notification Preferences</h3>
                <div style={styles.notificationPrefs}>
                  {Object.entries(notificationPrefs).map(([type, enabled]) => (
                    <label key={type} style={styles.notificationLabel}>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleNotificationChange(type)}
                        style={styles.checkbox}
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
                    </label>
                  ))}
                </div>
                <button type="submit" style={styles.saveButton}>Save Changes</button>
              </form>
            </div>
            <div style={styles.settingsCard}>
              <h2 style={styles.settingsTitle}>Change Password</h2>
              <form onSubmit={handlePasswordUpdate}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    style={styles.formInput}
                    placeholder="Enter current password"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    style={styles.formInput}
                    placeholder="Enter new password"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    style={styles.formInput}
                    placeholder="Confirm new password"
                  />
                </div>
                <button type="submit" style={styles.saveButton}>Update Password</button>
              </form>
            </div>
          </div>
        );
      case "Logout":
        router.push("/");
        return null;
      default:
        return <div style={styles.notFound}>Invalid section.</div>;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <aside style={styles.sidebar}>
        <ul style={styles.sidebarMenu}>
          {["Profile Overview", "Patients", "Settings", "Logout"].map((item) => (
            <li
              key={`menu-${item}`}
              style={{
                ...styles.menuItem,
                backgroundColor: activeSection === item ? "#34495e" : "transparent",
              }}
              onClick={() => setActiveSection(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>
            <span style={styles.welcomeText}>Welcome,</span> Dr. {doctor.full_name}
          </h1>
          <div style={{ width: "100px", height: "100px", overflow: "hidden", borderRadius: "50%" }}>
            <img
              src="https://th.bing.com/th/id/OIP.Z-jIioX1b136277SvqD10QHaHx?rs=1&pid=ImgDetMain"
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </header>
        {renderSection()}
      </main>
      {chatOpen && selectedPatient && (
        <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)}>
          <Chat
            appointmentId={selectedPatient.id}
            currentUser={{ id: doctor.id, name: `Dr. ${doctor.full_name}`, type: "doctor" }}
            recipientUser={{
              id: selectedPatient.id,
              name: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
              type: "patient",
            }}
          />
        </ChatModal>
      )}
      <div id="local-video"></div>
      <div id="remote-video"></div>
    </div>
  );
}

const styles = {
  dashboardContainer: { display: "flex", minHeight: "100vh", fontFamily: "'Arial', sans-serif", backgroundColor: "#f4f6f9" },
  sidebar: { width: "250px", backgroundColor: "#1E354C", color: "#ecf0f1", padding: "20px" },
  sidebarMenu: { listStyleType: "none", padding: "0" },
  menuItem: {
    fontSize: "16px",
    padding: "10px 0",
    cursor: "pointer",
    borderBottom: "1px solid #34495e",
    transition: "background-color 0.3s ease",
    ":hover": { backgroundColor: "#34495e" },
  },
  mainContent: { flexGrow: "1", padding: "20px" },
  header: {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: { fontSize: "24px", fontWeight: "bold", color: "#34495e", margin: "0" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(285px, 1fr))", gap: "15px" },
  infoItem: {
    fontSize: "16px",
    color: "#6e87a0",
    padding: "15px",
    borderRadius: "6px",
    backgroundColor: "#ecf0f1",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  loading: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "20px", color: "#7f8c8d" },
  notFound: { fontSize: "18px", color: "#e74c3c", textAlign: "center", padding: "20px", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
  welcomeText: { color: "#61a3f8", fontWeight: "normal" },
  patientsSection: { backgroundColor: "#ffffff", borderRadius: "8px", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" },
  patientTable: { width: "100%", borderCollapse: "collapse", marginTop: "20px", backgroundColor: "#ffffff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
  tableHeader: { backgroundColor: "#2c3e50", color: "#ecf0f1" },
  tableHeaderCell: { padding: "12px 15px", textAlign: "left", fontSize: "14px", fontWeight: "bold" },
  tableRow: { borderBottom: "1px solid #e0e0e0", ":last-child": { borderBottom: "none" }, ":hover": { backgroundColor: "#f5f5f5" } },
  tableCell: { padding: "12px 15px", textAlign: "left", fontSize: "14px", color: "#34495e" },
  settingsContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  settingsCard: { backgroundColor: "#ffffff", borderRadius: "8px", padding: "25px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
  settingsTitle: { fontSize: "20px", color: "#2c3e50", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #eee" },
  formGroup: { marginBottom: "20px" },
  formLabel: { display: "block", marginBottom: "8px", fontWeight: "500", color: "#34495e" },
  formInput: { width: "100%", padding: "10px 15px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "16px", transition: "border-color 0.3s", ":focus": { borderColor: "#3b82f6", outline: "none" } },
  subsectionTitle: { fontSize: "18px", color: "#2c3e50", margin: "25px 0 15px" },
  availabilityItem: { display: "flex", alignItems: "center", marginBottom: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px" },
  availabilityLabel: { display: "flex", alignItems: "center", width: "120px", cursor: "pointer" },
  timeInputs: { display: "flex", alignItems: "center", marginLeft: "20px" },
  timeInput: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", margin: "0 5px" },
  timeSeparator: { margin: "0 10px", color: "#7f8c8d" },
  notificationPrefs: { display: "flex", flexDirection: "column", gap: "10px" },
  notificationLabel: { display: "flex", alignItems: "center", cursor: "pointer", padding: "8px 10px", borderRadius: "4px", ":hover": { backgroundColor: "#f8f9fa" } },
  checkbox: { marginRight: "10px" },
  saveButton: { backgroundColor: "#3b82f6", color: "white", padding: "12px 20px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", fontWeight: "500", marginTop: "20px", transition: "background-color 0.3s", ":hover": { backgroundColor: "#2563eb" } },
  errorMessage: { backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px 15px", borderRadius: "4px", marginBottom: "20px" },
  successMessage: { backgroundColor: "#dcfce7", color: "#166534", padding: "10px 15px", borderRadius: "4px", marginBottom: "20px" },
};

export default DoctorProfilePage;