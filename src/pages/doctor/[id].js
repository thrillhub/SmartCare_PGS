"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"; // Updated import to include React
import { collection, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import Chat from "../../../src/app/Components/Chat";
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
  }, [id, currentDateTime]);

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

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>Loading your profile...</p>
    </div>
  );
  
  if (error) return (
    <div style={styles.errorContainer}>
      <div style={styles.errorIcon}>⚠️</div>
      <h3 style={styles.errorTitle}>Error Loading Profile</h3>
      <p style={styles.errorText}>{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        style={styles.retryButton}
      >
        Try Again
      </button>
    </div>
  );
  
  if (!doctor) return (
    <div style={styles.notFoundContainer}>
      <h3 style={styles.notFoundTitle}>Doctor Not Found</h3>
      <p style={styles.notFoundText}>The requested doctor profile could not be found.</p>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "Profile Overview":
        return (
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.avatarContainer}>
                <img
                  src="https://th.bing.com/th/id/OIP.Z-jIioX1b136277SvqD10QHaHx?rs=1&pid=ImgDetMain"
                  alt="Profile"
                  style={styles.avatar}
                />
              </div>
              <div style={styles.profileTitles}>
                <h2 style={styles.doctorName}>Dr. {doctor.full_name}</h2>
                <p style={styles.doctorSpeciality}>{doctor.speciality || "Medical Specialist"}</p>
                <div style={styles.ratingContainer}>
                  <span style={styles.ratingStars}>★★★★★</span>
                  <span style={styles.ratingText}>5.0 (24 reviews)</span>
                </div>
              </div>
            </div>
            
            <div style={styles.profileDetails}>
              <h3 style={styles.sectionTitle}>Professional Information</h3>
              <div style={styles.detailsGrid}>
                {[
                  { icon: "📧", label: "Email", value: doctor.email },
                  { icon: "📱", label: "Phone", value: doctor.phone_number || "Not provided" },
                  { icon: "🆔", label: "NMC Number", value: doctor.nmc_number },
                  { icon: "💼", label: "Speciality", value: doctor.speciality || "Not specified" },
                  { icon: "💰", label: "Consultation Fee", value: doctor.consultation_fee ? `$${doctor.consultation_fee}` : "Not set" },
                ].map((item, index) => (
                  <div key={`info-${index}`} style={styles.detailItem}>
                    <span style={styles.detailIcon}>{item.icon}</span>
                    <div>
                      <div style={styles.detailLabel}>{item.label}</div>
                      <div style={styles.detailValue}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 style={styles.sectionTitle}>About Me</h3>
              <div style={styles.bioContainer}>
                {doctor.bio ? (
                  <p style={styles.bioText}>{doctor.bio}</p>
                ) : (
                  <p style={styles.emptyBio}>No bio provided</p>
                )}
              </div>
              
              <h3 style={styles.sectionTitle}>Availability</h3>
              <div style={styles.availabilityGrid}>
                {Object.entries(availability).map(([day, schedule]) => (
                  <div key={day} style={styles.availabilityItem}>
                    <span style={styles.availabilityDay}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>
                    {schedule.available ? (
                      <span style={styles.availabilityTime}>
                        {formatTimeTo12Hour(schedule.start)} - {formatTimeTo12Hour(schedule.end)}
                      </span>
                    ) : (
                      <span style={styles.availabilityClosed}>Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case "Patients":
        return (
          <div style={styles.patientsContainer}>
            <div style={styles.patientsHeader}>
              <h2 style={styles.patientsTitle}>Your Patients</h2>
              <div style={styles.patientsStats}>
                <div style={styles.statCard}>
                  <span style={styles.statNumber}>{patients.length}</span>
                  <span style={styles.statLabel}>Total</span>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statNumber}>
                    {patients.filter(p => !p.isExpired).length}
                  </span>
                  <span style={styles.statLabel}>Upcoming</span>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statNumber}>
                    {patients.filter(p => p.isExpired).length}
                  </span>
                  <span style={styles.statLabel}>Completed</span>
                </div>
              </div>
            </div>
            
            {patients.length > 0 ? (
              <div style={styles.tableContainer}>
                <table style={styles.patientTable}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      {["Patient", "Details", "Appointment", "Status", "Actions"].map((header, index) => (
                        <th key={`header-${index}`} style={styles.tableHeaderCell}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={`patient-${patient.id}`} style={styles.tableRow}>
                        <td style={styles.tableCell}>
                          <div style={styles.patientInfo}>
                            <div style={styles.patientAvatar}>
                              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                            </div>
                            <div>
                              <div style={styles.patientName}>
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div style={styles.patientMeta}>
                                {patient.age} • {patient.gender}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.patientDetails}>
                            <div style={styles.diseaseTag}>
                              {patient.selectedDisease}
                            </div>
                            <div style={styles.contactInfo}>
                              {patient.phoneNumber}
                            </div>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.appointmentTime}>
                            <div style={styles.appointmentDate}>
                              {patient.appointmentDate}
                            </div>
                            <div style={styles.appointmentHour}>
                              {formatTimeTo12Hour(patient.appointmentTime)}
                            </div>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{
                            ...styles.statusBadge,
                            backgroundColor: patient.isExpired ? '#f0f0f0' : '#e3f2fd',
                            color: patient.isExpired ? '#666' : '#1976d2'
                          }}>
                            {patient.isExpired ? 'Completed' : 'Upcoming'}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <button
                            onClick={() => handleChatOpen(patient)}
                            style={styles.chatButton}
                          >
                            <span style={styles.chatIcon}>💬</span>
                            Chat
                            <UnreadBadge count={unreadCounts[patient.id] || 0} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={styles.noPatients}>
                <div style={styles.noPatientsIcon}>👨‍⚕️</div>
                <h3 style={styles.noPatientsTitle}>No Patients Yet</h3>
                <p style={styles.noPatientsText}>
                  You don't have any patients scheduled yet. New appointments will appear here.
                </p>
              </div>
            )}
          </div>
        );
        
      case "Settings":
        return (
          <div style={styles.settingsContainer}>
            <div style={styles.settingsTabs}>
              <button 
                style={{
                  ...styles.settingsTab,
                  ...(editMode ? {} : styles.activeTab)
                }}
                onClick={() => setEditMode(false)}
              >
                View Profile
              </button>
              <button 
                style={{
                  ...styles.settingsTab,
                  ...(editMode ? styles.activeTab : {})
                }}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
            
            {settingsError && (
              <div style={styles.alertError}>
                <span style={styles.alertIcon}>⚠️</span>
                {settingsError}
              </div>
            )}
            
            {settingsSuccess && (
              <div style={styles.alertSuccess}>
                <span style={styles.alertIcon}>✅</span>
                {settingsSuccess}
              </div>
            )}
            
            <div style={styles.settingsCard}>
              <h2 style={styles.settingsTitle}>
                {editMode ? 'Edit Your Profile' : 'Profile Information'}
              </h2>
              
              <form onSubmit={handleProfileUpdate}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Phone Number</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      style={styles.formInput}
                      placeholder="Enter phone number"
                      disabled={!editMode}
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
                      disabled={!editMode}
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Consultation Fee ($)</label>
                    <input
                      type="number"
                      name="consultation_fee"
                      value={formData.consultation_fee}
                      onChange={handleInputChange}
                      style={styles.formInput}
                      placeholder="Enter consultation fee"
                      disabled={!editMode}
                    />
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    style={styles.formTextarea}
                    placeholder="Tell patients about yourself"
                    disabled={!editMode}
                    rows={4}
                  />
                </div>
                
                <h3 style={styles.subsectionTitle}>Availability</h3>
                <div style={styles.availabilitySettings}>
                  {Object.entries(availability).map(([day, schedule]) => (
                    <div key={day} style={styles.availabilitySettingItem}>
                      <label style={styles.availabilitySettingLabel}>
                        <input
                          type="checkbox"
                          checked={schedule.available}
                          onChange={() => handleAvailabilityChange(day, "available")}
                          style={styles.checkbox}
                          disabled={!editMode}
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
                            disabled={!editMode}
                          />
                          <span style={styles.timeSeparator}>to</span>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => handleAvailabilityChange(day, "end", e.target.value)}
                            style={styles.timeInput}
                            disabled={!editMode}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <h3 style={styles.subsectionTitle}>Notification Preferences</h3>
                <div style={styles.notificationSettings}>
                  {Object.entries(notificationPrefs).map(([type, enabled]) => (
                    <label key={type} style={styles.notificationSettingLabel}>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleNotificationChange(type)}
                        style={styles.checkbox}
                        disabled={!editMode}
                      />
                      <span style={styles.notificationType}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
                      </span>
                    </label>
                  ))}
                </div>
                
                {editMode && (
                  <div style={styles.formActions}>
                    <button 
                      type="button" 
                      onClick={() => setEditMode(false)}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      style={styles.saveButton}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
            
            <div style={styles.settingsCard}>
              <h2 style={styles.settingsTitle}>Change Password</h2>
              <form onSubmit={handlePasswordUpdate}>
                <div style={styles.formRow}>
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
                </div>
                
                <div style={styles.formRow}>
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
                </div>
                
                <div style={styles.formActions}>
                  <button 
                    type="submit" 
                    style={styles.saveButton}
                  >
                    Update Password
                  </button>
                </div>
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
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarAvatar}>
            <img
              src="https://th.bing.com/th/id/OIP.Z-jIioX1b136277SvqD10QHaHx?rs=1&pid=ImgDetMain"
              alt="Profile"
              style={styles.sidebarAvatarImage}
            />
          </div>
          <div style={styles.sidebarUserInfo}>
            <div style={styles.sidebarUserName}>Dr. {doctor.full_name}</div>
            <div style={styles.sidebarUserRole}>{doctor.speciality || "Doctor"}</div>
          </div>
        </div>
        
        <ul style={styles.sidebarMenu}>
          {["Profile Overview", "Patients", "Settings", "Logout"].map((item) => (
            <li
              key={`menu-${item}`}
              style={{
                ...styles.menuItem,
                ...(activeSection === item ? styles.activeMenuItem : {}),
              }}
              onClick={() => setActiveSection(item)}
            >
              <span style={styles.menuItemIcon}>
                {item === "Profile Overview" && "👤"}
                {item === "Patients" && "👨‍⚕️"}
                {item === "Settings" && "⚙️"}
                {item === "Logout" && "🚪"}
              </span>
              <span style={styles.menuItemText}>{item}</span>
              {activeSection === item && (
                <span style={styles.menuItemActiveMarker}></span>
              )}
            </li>
          ))}
        </ul>
        
        <div style={styles.sidebarFooter}>
          <div style={styles.versionText}>v1.0.0</div>
        </div>
      </aside>
      
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>
              {activeSection === "Profile Overview" && "My Profile"}
              {activeSection === "Patients" && "Patient Management"}
              {activeSection === "Settings" && "Account Settings"}
            </h1>
            <p style={styles.pageSubtitle}>
              {activeSection === "Profile Overview" && "View and manage your professional profile"}
              {activeSection === "Patients" && "Manage your patient appointments and communications"}
              {activeSection === "Settings" && "Update your account preferences and security"}
            </p>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.notificationButton}>
              <span style={styles.notificationIcon}>🔔</span>
              <span style={styles.notificationBadge}>3</span>
            </button>
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
    </div>
  );
}

const styles = {
  // Dashboard Layout
  dashboardContainer: { 
    display: "flex", 
    minHeight: "100vh", 
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f8fafc"
  },
  
  // Sidebar Styles
  sidebar: { 
    width: "280px", 
    backgroundColor: "#ffffff", 
    color: "#334155",
    padding: "0",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #e2e8f0"
  },
  sidebarHeader: {
    padding: "24px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  sidebarAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#f1f5f9"
  },
  sidebarAvatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  sidebarUserInfo: {
    display: "flex",
    flexDirection: "column"
  },
  sidebarUserName: {
    fontWeight: "600",
    fontSize: "15px",
    color: "#0f172a"
  },
  sidebarUserRole: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "2px"
  },
  sidebarMenu: { 
    listStyleType: "none", 
    padding: "0",
    margin: "0",
    flex: "1"
  },
  menuItem: {
    fontSize: "14px",
    padding: "12px 24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    position: "relative",
    color: "#64748b",
    transition: "all 0.2s ease"
  },
  activeMenuItem: {
    backgroundColor: "#f8fafc",
    color: "#3b82f6",
    fontWeight: "500"
  },
  menuItemIcon: {
    marginRight: "12px",
    fontSize: "18px",
    width: "24px",
    textAlign: "center"
  },
  menuItemText: {
    flex: "1"
  },
  menuItemActiveMarker: {
    width: "4px",
    height: "24px",
    backgroundColor: "#3b82f6",
    borderRadius: "2px",
    position: "absolute",
    right: "0"
  },
  sidebarFooter: {
    padding: "16px 24px",
    borderTop: "1px solid #f1f5f9",
    fontSize: "12px",
    color: "#94a3b8"
  },
  versionText: {
    textAlign: "center"
  },
  
  // Main Content Styles
  mainContent: { 
    flex: "1", 
    padding: "0",
    backgroundColor: "#f8fafc"
  },
  header: {
    padding: "24px 32px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  pageTitle: { 
    fontSize: "22px", 
    fontWeight: "600", 
    color: "#0f172a", 
    margin: "0" 
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: "4px 0 0",
    fontWeight: "400"
  },
  headerActions: {
    display: "flex",
    gap: "16px"
  },
  notificationButton: {
    position: "relative",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    backgroundColor: "#f1f5f9",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  notificationIcon: {
    fontSize: "18px"
  },
  notificationBadge: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  
  // Loading State
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: "16px"
  },
  loadingSpinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e2e8f0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    fontSize: "16px",
    color: "#64748b",
    marginTop: "16px"
  },
  
  // Error State
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "24px",
    textAlign: "center",
    maxWidth: "400px",
    margin: "0 auto"
  },
  errorIcon: {
    fontSize: "48px",
    marginBottom: "16px"
  },
  errorTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 8px"
  },
  errorText: {
    fontSize: "15px",
    color: "#64748b",
    margin: "0 0 24px"
  },
  retryButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#2563eb"
    }
  },
  
  // Not Found State
  notFoundContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "24px",
    textAlign: "center"
  },
  notFoundTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 8px"
  },
  notFoundText: {
    fontSize: "15px",
    color: "#64748b",
    margin: "0"
  },
  
  // Profile Overview Section
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    margin: "24px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #f1f5f9",
    gap: "20px"
  },
  avatarContainer: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    flexShrink: "0"
  },
  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  profileTitles: {
    flex: "1"
  },
  doctorName: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 4px"
  },
  doctorSpeciality: {
    fontSize: "15px",
    color: "#64748b",
    margin: "0 0 8px"
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  ratingStars: {
    color: "#f59e0b",
    fontSize: "16px"
  },
  ratingText: {
    fontSize: "13px",
    color: "#64748b"
  },
  profileDetails: {
    padding: "24px"
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 16px",
    paddingBottom: "8px",
    borderBottom: "1px solid #f1f5f9"
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "24px"
  },
  detailItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start"
  },
  detailIcon: {
    fontSize: "20px",
    color: "#64748b",
    marginTop: "2px"
  },
  detailLabel: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "2px"
  },
  detailValue: {
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: "500"
  },
  bioContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px"
  },
  bioText: {
    fontSize: "15px",
    color: "#334155",
    lineHeight: "1.6",
    margin: "0"
  },
  emptyBio: {
    fontSize: "15px",
    color: "#94a3b8",
    fontStyle: "italic",
    margin: "0"
  },
  availabilityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px"
  },
  availabilityItem: {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  availabilityDay: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#0f172a"
  },
  availabilityTime: {
    fontSize: "13px",
    color: "#3b82f6",
    fontWeight: "500"
  },
  availabilityClosed: {
    fontSize: "13px",
    color: "#94a3b8",
    fontStyle: "italic"
  },
  
  // Patients Section
  patientsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    margin: "24px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },
  patientsHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  patientsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0"
  },
  patientsStats: {
    display: "flex",
    gap: "16px"
  },
  statCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "12px 16px",
    minWidth: "80px",
    textAlign: "center"
  },
  statNumber: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    display: "block"
  },
  statLabel: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "4px",
    display: "block"
  },
  tableContainer: {
    overflowX: "auto",
    padding: "0 24px 24px"
  },
  patientTable: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    marginTop: "16px"
  },
  tableHeader: {
    backgroundColor: "#f8fafc"
  },
  tableHeaderCell: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "500",
    color: "#64748b",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e2e8f0"
  },
  tableRow: {
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f8fafc"
    }
  },
  tableCell: {
    padding: "16px",
    textAlign: "left",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle"
  },
  patientInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  patientAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    flexShrink: "0"
  },
  patientName: {
    fontWeight: "500",
    color: "#0f172a"
  },
  patientMeta: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "2px"
  },
  patientDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  diseaseTag: {
    backgroundColor: "#f0fdf4",
    color: "#166534",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "4px",
    display: "inline-block",
    fontWeight: "500"
  },
  contactInfo: {
    fontSize: "13px",
    color: "#64748b"
  },
  appointmentTime: {
    display: "flex",
    flexDirection: "column"
  },
  appointmentDate: {
    fontWeight: "500",
    color: "#0f172a"
  },
  appointmentHour: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "2px"
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block"
  },
  chatButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
    ":hover": {
      backgroundColor: "#2563eb"
    }
  },
  chatIcon: {
    fontSize: "16px"
  },
  noPatients: {
    padding: "40px 24px",
    textAlign: "center"
  },
  noPatientsIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: "0.6"
  },
  noPatientsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 8px"
  },
  noPatientsText: {
    fontSize: "15px",
    color: "#64748b",
    margin: "0",
    maxWidth: "400px",
    margin: "0 auto"
  },
  
  // Settings Section
  settingsContainer: {
    padding: "24px"
  },
  settingsTabs: {
    display: "flex",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "24px"
  },
  settingsTab: {
    padding: "12px 24px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
    position: "relative",
    ":hover": {
      color: "#3b82f6"
    }
  },
  activeTab: {
    color: "#3b82f6",
    ":after": {
      content: '""',
      position: "absolute",
      bottom: "-1px",
      left: "0",
      right: "0",
      height: "2px",
      backgroundColor: "#3b82f6"
    }
  },
  alertError: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px"
  },
  alertSuccess: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px"
  },
  alertIcon: {
    fontSize: "16px"
  },
  settingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },
  settingsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 24px"
  },
  formRow: {
    display: "flex",
    gap: "24px",
    marginBottom: "16px",
    ":last-child": {
      marginBottom: "0"
    }
  },
  formGroup: {
    flex: "1",
    marginBottom: "16px"
  },
  formLabel: {
    display: "block",
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
    fontWeight: "500"
  },
  formInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "border-color 0.2s",
    ":focus": {
      outline: "none",
      borderColor: "#3b82f6"
    },
    ":disabled": {
      backgroundColor: "#f8fafc",
      color: "#94a3b8",
      cursor: "not-allowed"
    }
  },
  formTextarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "border-color 0.2s",
    resize: "vertical",
    minHeight: "100px",
    ":focus": {
      outline: "none",
      borderColor: "#3b82f6"
    },
    ":disabled": {
      backgroundColor: "#f8fafc",
      color: "#94a3b8",
      cursor: "not-allowed"
    }
  },
  subsectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "24px 0 16px",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9"
  },
  availabilitySettings: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "12px",
    marginBottom: "16px"
  },
  availabilitySettingItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  availabilitySettingLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#334155",
    cursor: "pointer",
    userSelect: "none"
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    ":disabled": {
      cursor: "not-allowed"
    }
  },
  timeInputs: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginLeft: "24px"
  },
  timeInput: {
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    ":focus": {
      outline: "none",
      borderColor: "#3b82f6"
    },
    ":disabled": {
      backgroundColor: "#f8fafc",
      color: "#94a3b8",
      cursor: "not-allowed"
    }
  },
  timeSeparator: {
    fontSize: "13px",
    color: "#64748b"
  },
  notificationSettings: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  notificationSettingLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#334155",
    cursor: "pointer",
    userSelect: "none"
  },
  notificationType: {
    flex: "1"
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9"
  },
  cancelButton: {
    backgroundColor: "transparent",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#f8fafc"
    }
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#2563eb"
    }
  },

  // Chat Modal Styles
  chatModal: {
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    width: "400px",
    backgroundColor: "#ffffff",
    boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
    zIndex: "1000",
    display: "flex",
    flexDirection: "column"
  },
  chatHeader: {
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  chatTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0"
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    color: "#64748b",
    padding: "4px"
  },
  chatContent: {
    flex: "1",
    overflow: "hidden"
  },

  // Keyframes for loading spinner
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
  }
};

export default DoctorProfilePage;