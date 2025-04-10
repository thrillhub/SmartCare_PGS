"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const DoctorAppointmentForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    email: "",
    age: "",
    gender: "",
    selectedDoctor: "",
    selectedDisease: "",
    appointmentDate: "",
    appointmentTime: "",
    message: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    success: false,
    message: "",
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        yoyo: Infinity,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  useEffect(() => {
    // Set minimum date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setFormData((prev) => ({
        ...prev,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, "doctors");
        const doctorsSnapshot = await getDocs(doctorsCollection);
        const doctorsList = doctorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          fullName: doc.data().full_name,
          email: doc.data().email,
          phoneNumber: doc.data().phone_number,
          specialty: doc.data().specialty || "General Practitioner",
        }));
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneNumberChange = (e) => {
    // Ensure only numbers are entered and limit to 10 digits after +977
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (modalData.success) {
      router.push("/Patient-profile");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Additional validation to prevent past dates
    const selectedDate = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
    const now = new Date();
    
    if (selectedDate < now) {
      setModalData({
        success: false,
        message: "Please select a future date and time for your appointment."
      });
      setShowModal(true);
      setIsSubmitting(false);
      return;
    }

    const selectedDoctor = doctors.find(doctor => doctor.fullName === formData.selectedDoctor);
    
    const appointmentData = {
      ...formData,
      phoneNumber: `+977${formData.phoneNumber}`, // Add country code before saving
      doctorId: selectedDoctor?.id || "",
      doctorEmail: selectedDoctor?.email || "",
      doctorPhoneNumber: selectedDoctor?.phoneNumber || "",
      expirationDate: new Date(`${formData.appointmentDate}T${formData.appointmentTime}`),
    };

    try {
      const appointmentsCollection = collection(db, "appoinments");
      await addDoc(appointmentsCollection, appointmentData);

      // Send email notifications
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedDoctor: formData.selectedDoctor,
          doctorEmail: selectedDoctor?.email,
          patientEmail: formData.email,
          patientDetails: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            phoneNumber: `+977${formData.phoneNumber}`,
            email: formData.email,
            age: formData.age,
            gender: formData.gender,
            selectedDisease: formData.selectedDisease,
            appointmentDate: formData.appointmentDate,
            appointmentTime: formData.appointmentTime,
            message: formData.message,
            selectedDoctor: formData.selectedDoctor,
          },
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email notification");
      }

      setModalData({
        success: true,
        message: "Appointment booked successfully!"
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setModalData({
        success: false,
        message: "Failed to book appointment. Please try again."
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          className="w-full max-w-5xl h-[708px] bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="md:flex">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="hidden md:block md:w-2/5 bg-[#1E354C] p-6 text-white"
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-bold mb-2"
                  >
                    Book Your Appointment
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-blue-200 text-sm"
                  >
                    Fill out the form to schedule your visit with our specialists.
                  </motion.p>
                </div>
                <div className="mt-6">
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <motion.div variants={itemVariants} className="flex items-start">
                      <div className="bg-[#2DA891] rounded-full p-2 mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Quick Response</h3>
                        <p className="text-xs text-blue-200">We'll confirm your appointment within 24 hours</p>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex items-start">
                      <div className="bg-[#2DA891] rounded-full p-2 mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Verified Doctors</h3>
                        <p className="text-xs text-blue-200">All our specialists are board-certified</p>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex items-start">
                      <div className="bg-[#2DA891] rounded-full p-2 mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Reminder Alerts</h3>
                        <p className="text-xs text-blue-200">We'll remind you before your appointment</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full md:w-3/5 p-4 md:p-6"
            >
              <div className="md:hidden mb-4 text-center">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-gray-800 mb-1"
                >
                  Book Your Appointment
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-sm"
                >
                  Fill out the form to schedule your visit with our specialists.
                </motion.p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-medium text-white bg-[#2DA891] mb-1 p-1 rounded">Email</label>
                    <input
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-medium text-white bg-[#2DA891] mb-1 p-1 rounded">Address</label>
                    <input
                      name="address"
                      type="text"
                      placeholder="Your full address"
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="flex items-center">
                            <img 
                              src="https://flagcdn.com/w20/np.png" 
                              alt="Nepal Flag" 
                              className="w-4 h-4 mr-1"
                            />
                            <span className="text-sm text-gray-500">+977</span>
                          </span>
                        </div>
                        <input
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handlePhoneNumberChange}
                          placeholder="98XXXXXXXX"
                          className="w-full pl-16 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                      <input
                        name="age"
                        type="number"
                        placeholder="Your age"
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="0"
                        max="120"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Health Concern</label>
                      <select
                        name="selectedDisease"
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Common cold">Common cold</option>
                        <option value="Flu & virus">Flu & virus</option>
                        <option value="Fever">Fever</option>
                        <option value="Chronic condition">Chronic condition</option>
                        <option value="Follow-up visit">Follow-up visit</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-medium text-white bg-[#2DA891] mb-1 p-1 rounded">Select Doctor</label>
                    <select
                      name="selectedDoctor"
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.fullName}>
                          Dr. {doctor.fullName} ({doctor.specialty})
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Appointment Date</label>
                      <input
                        name="appointmentDate"
                        type="date"
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min={minDate}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Appointment Time</label>
                      <input
                        name="appointmentTime"
                        type="time"
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min={formData.appointmentDate === minDate ? new Date().toTimeString().substring(0, 5) : undefined}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-medium text-white bg-[#2DA891] mb-1 p-1 rounded">Additional Information</label>
                    <textarea
                      name="message"
                      placeholder="Please describe your symptoms or any other relevant information"
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required
                    ></textarea>
                  </motion.div>
                </motion.div>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-4 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors ${isSubmitting ? 'bg-[#1E354C] cursor-not-allowed' : 'bg-[#1E354C] hover:bg-[#416589]'}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Book Appointment'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className={`bg-white rounded-xl p-6 max-w-md w-full shadow-xl ${modalData.success ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'}`}
          >
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${modalData.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {modalData.success ? (
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
              <h3 className="mt-3 text-lg leading-6 font-medium text-gray-900">
                {modalData.success ? 'Success!' : 'Error!'}
              </h3>
              <div className="mt-2 px-4 py-3">
                <p className="text-sm text-gray-500">
                  {modalData.message}
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${modalData.success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${modalData.success ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
                  onClick={handleModalClose}
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DoctorAppointmentForm;