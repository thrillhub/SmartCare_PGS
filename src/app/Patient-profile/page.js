"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Chat from '@components/Chat';
import ChatModal from '@components/ChatModal';
import UnreadBadge from "../Components/UnreadBadge";
import { 
  FiUser, 
  FiCalendar, 
  FiMessageSquare, 
  FiLogOut, 
  FiClock, 
  FiPhone, 
  FiMail,
  FiPlusCircle,
  FiHome,
  FiFileText,
  FiBell
} from "react-icons/fi";
import { FaStethoscope, FaRegHospital, FaUserMd } from "react-icons/fa";
import { RiMedicineBottleLine } from "react-icons/ri";

export default function PatientPortal() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/api/login";
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);
    setLoading(false);
    
    // Mock notifications - replace with actual data in production
    setNotifications([
      { id: 1, type: 'appointment', message: 'Your annual checkup is coming up', date: '2023-11-15', read: false },
      { id: 2, type: 'prescription', message: 'New prescription available', date: '2023-11-10', read: true }
    ]);
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("recipientEmail", "==", user.email),
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

  const formatTimeTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    let hours12 = parseInt(hours, 10);
    const ampm = hours12 >= 12 ? "PM" : "AM";
    hours12 = hours12 % 12;
    hours12 = hours12 ? hours12 : 12;
    return `${hours12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUpcomingAppointments = () => {
    return appointments.filter(appt => 
      new Date(appt.appointmentDate + " " + appt.appointmentTime) > new Date()
    ).slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-normal text-gray-500">Please Wait loading Your Health Portal....</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-700">Authenticating your credentials...</p>
      </div>
    );
  }

  const currentDateTime = new Date();
  const upcomingAppointments = getUpcomingAppointments();
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-white shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FaRegHospital className="text-blue-600 text-3xl" />
            <div>
              <h2 className="font-bold text-xl text-gray-800">Smart Care</h2>
              <p className="text-xs text-gray-500">Patient Dashboard</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser className="text-blue-600 text-xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-xs text-gray-500">Patient ID: {user.id?.slice(0, 8) || 'N/A'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeSection === "dashboard" ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiHome className="mr-3 text-lg" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveSection("profile")}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeSection === "profile" ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiUser className="mr-3 text-lg" />
              My Profile
            </button>
            
            <a
              href="/doctor-appointment"
              className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FiPlusCircle className="mr-3 text-lg" />
              Book Appointment
            </a>
            
            <button
              onClick={() => setActiveSection("appointments")}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeSection === "appointments" ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiCalendar className="mr-3 text-lg" />
              My Appointments
            </button>

            <button
              onClick={() => setActiveSection("medical-records")}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeSection === "medical-records" ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiFileText className="mr-3 text-lg" />
              Medical Records
            </button>

            <button
              onClick={() => setActiveSection("prescriptions")}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeSection === "prescriptions" ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <RiMedicineBottleLine className="mr-3 text-lg" />
              My Prescriptions
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200 mt-auto">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          >
            <FiLogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeSection === "dashboard" && "Health Dashboard"}
              {activeSection === "profile" && "My Profile"}
              {activeSection === "appointments" && "My Appointments"}
              {activeSection === "medical-records" && "Medical Records"}
              {activeSection === "prescriptions" && "My Prescriptions"}
            </h1>
            
            <div className="flex items-center space-x-6">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <FiBell className="text-xl" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiUser className="text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">{user.firstName}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {activeSection === "dashboard" && (
            <div className="max-w-7xl mx-auto">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white mb-8">
                <h2 className="text-2xl font-bold mb-2">Welcome, {user.firstName}</h2>
                <p className="opacity-90">Your health is our priority. Here's what's happening today.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Upcoming Appointments</h3>
                  <p className="text-2xl font-bold text-gray-800">{upcomingAppointments.length}</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Unread Messages</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Active Prescriptions</h3>
                  <p className="text-2xl font-bold text-gray-800">2</p>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800">Upcoming Appointments</h3>
                  <button 
                    onClick={() => setActiveSection("appointments")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                
                {upcomingAppointments.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaUserMd className="text-blue-600 text-xl" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{appointment.selectedDoctor}</h4>
                              <p className="text-sm text-gray-500">{appointment.doctorSpecialty || "General Practitioner"}</p>
                              <div className="mt-1 flex items-center space-x-4">
                                <span className="flex items-center text-sm text-gray-500">
                                  <FiCalendar className="mr-1.5" />
                                  {formatDate(appointment.appointmentDate)}
                                </span>
                                <span className="flex items-center text-sm text-gray-500">
                                  <FiClock className="mr-1.5" />
                                  {formatTimeTo12Hour(appointment.appointmentTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedDoctor(appointment);
                              setChatOpen(true);
                            }}
                            className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <FiMessageSquare className="mr-1.5" />
                            Message
                            <UnreadBadge count={unreadCounts[appointment.id] || 0} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No upcoming appointments scheduled
                  </div>
                )}
              </div>

              {/* Recent Notifications */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-medium text-gray-800">Recent Notifications</h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {notifications.slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          notification.type === 'appointment' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {notification.type === 'appointment' ? (
                            <FiCalendar className="text-lg" />
                          ) : (
                            <RiMedicineBottleLine className="text-lg" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                        </div>
                        {!notification.read && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                  <h2 className="text-xl font-bold">Personal Information</h2>
                  <p className="opacity-90 text-sm">Review and update your personal details</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            {`${user.firstName} ${user.lastName}`}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            January 15, 1985
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            Male
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            {user.email}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            (+977-) 9815401254
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            123 Wellness Ave, Health City, HC 12345
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Emergency Contacts</h3>
                    <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                          <p className="text-sm text-gray-500">Spouse</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">(555) 987-6543</p><p className="text-xs text-gray-500">Primary Contact</p>
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Edit Emergency Contacts
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Update Information
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-800">Medical Information</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Allergies</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-red-50 p-3 rounded-md border border-red-200">
                          <span className="text-sm font-medium text-red-800">Penicillin</span>
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Severe</span>
                        </div>
                        <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-md border border-yellow-200">
                          <span className="text-sm font-medium text-yellow-800">Pollen</span>
                          <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Moderate</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Conditions</h3>
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                          <span className="text-sm font-medium text-gray-800">Hypertension</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                          <span className="text-sm font-medium text-gray-800">Type 2 Diabetes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "appointments" && (
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
                  <p className="text-gray-600">View and manage your scheduled visits</p>
                </div>
                <a
                  href="/doctor-appointment"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FiPlusCircle className="mr-2" />
                  New Appointment
                </a>
              </div>

              {appointments.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">Appointment History</h3>
                      <div className="relative">
                        <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                          <option>All Status</option>
                          <option>Upcoming</option>
                          <option>Completed</option>
                          <option>Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {appointments.map((appointment) => {
                      const isExpired =
                        new Date(
                          appointment.appointmentDate +
                            " " +
                            appointment.appointmentTime
                        ) < currentDateTime;
                      return (
                        <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex items-start space-x-4 mb-4 md:mb-0">
                              <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUserMd className="text-blue-600 text-xl" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{appointment.selectedDoctor}</h4>
                                <p className="text-sm text-gray-500">{appointment.doctorSpecialty || "General Practitioner"}</p>
                                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                                  <span className="flex items-center text-sm text-gray-500">
                                    <FiCalendar className="mr-1.5" />
                                    {formatDate(appointment.appointmentDate)}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-500">
                                    <FiClock className="mr-1.5" />
                                    {formatTimeTo12Hour(appointment.appointmentTime)}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-500">
                                    <FiPhone className="mr-1.5" />
                                    {appointment.doctorPhoneNumber || "Not provided"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  isExpired
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {isExpired ? "Completed" : "Upcoming"}
                              </span>
                              
                              <button
                                onClick={() => {
                                  setSelectedDoctor(appointment);
                                  setChatOpen(true);
                                }}
                                className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <FiMessageSquare className="mr-1.5" />
                                Message
                                <UnreadBadge count={unreadCounts[appointment.id] || 0} />
                              </button>
                              
                              {!isExpired && (
                                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                  Reschedule
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                    <FiCalendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments scheduled</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    You don't have any upcoming or past appointments. Book one now to get started.
                  </p>
                  <div className="mt-6">
                    <a
                      href="/doctor-appointment"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FiPlusCircle className="mr-2" />
                      Book Appointment
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Placeholder sections for other menu items */}
          {activeSection === "medical-records" && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                <FiFileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Medical Records</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your complete medical history and records will appear here.
              </p>
            </div>
          )}

          {activeSection === "prescriptions" && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                <RiMedicineBottleLine className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">My Prescriptions</h3>
              <p className="mt-2 text-sm text-gray-500">
                View and manage your current and past prescriptions.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Chat Modal */}
      {chatOpen && selectedDoctor && (
        <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)}>
          <Chat
            appointmentId={selectedDoctor.id}
            currentUser={{
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              type: "patient",
            }}
            recipientUser={{
              id: selectedDoctor.doctorId,
              name: selectedDoctor.selectedDoctor,
              email: selectedDoctor.doctorEmail,
              type: "doctor",
            }}
          />
        </ChatModal>
      )}
    </div>
  );
}