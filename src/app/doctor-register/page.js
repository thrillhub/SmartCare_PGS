"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUserMd, FaIdCard, FaHospital, FaStethoscope, FaLock } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

function RegisterDoctorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    email: "",
    phoneNumber: "",
    nmcNumber: "",
    citizenshipNumber: "",
    speciality: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setErrorMessage("Email and password are required!");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (!formData.nmcNumber || formData.nmcNumber.length < 8) {
      setErrorMessage("NMC number must be at least 8 digits long.");
      return false;
    }

    if (!/^\d+$/.test(formData.nmcNumber)) {
      setErrorMessage("NMC number should contain only digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/doctor-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful! You can now log in.");
        setFormData({
          fullName: "",
          address: "",
          email: "",
          phoneNumber: "",
          nmcNumber: "",
          citizenshipNumber: "",
          speciality: "",
          password: "",
        });
      } else {
        setErrorMessage(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while registering. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="md:flex">
            {/* Left side - Visual */}
            <div className="hidden md:block md:w-2/5 bg-white p-8 text-white relative">
              <div className="absolute top-6 left-6">
                <Image 
                  src="/images/front.png" 
                  alt="Healthcare Logo" 
                  width={200} 
                  height={50}
                  className=""
                />
              </div>
              <div className="flex flex-col h-full justify-center pt-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mt-12 mb-3 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">Join Our Medical Network</h2>
                  <p className="text-gray-400">Register to access our comprehensive healthcare platform</p>
                </div>
                
                <div className="space-y-6 mt-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center mr-4">
                        <span className="text-sm font-medium">1</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#3b85f4]">Personal Information</h4>
                      <p className="text-sm text-gray-400 mt-1">Provide your basic details</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center mr-4">
                        <span className="text-sm font-medium">2</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#3b85f4]">Professional Details</h4>
                      <p className="text-sm text-gray-400 mt-1">Verify your medical credentials</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center mr-4">
                        <span className="text-sm font-medium">3</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#3b85f4]">Account Setup</h4>
                      <p className="text-sm text-gray-400 mt-1">Create secure login credentials</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="md:w-3/5 p-8">
              <div className="md:hidden mb-6 text-center">
                <div className="flex justify-center mb-6">
                  <Image 
                    src="/images/front.png" 
                    alt="Healthcare Logo" 
                    width={180} 
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <FaUserMd className="text-white text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Doctor Registration</h2>
                <p className="text-gray-500 mt-1">Join our healthcare professional network</p>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-50/80 text-green-700 rounded-lg border border-green-100 backdrop-blur-sm">
                  {successMessage}</div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50/80 text-red-700 rounded-lg border border-red-100 backdrop-blur-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FaUserMd />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:border-blue-300"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <MdEmail />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Professional Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:border-blue-300"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <MdPhone />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:border-blue-300"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <MdLocationOn />
                    </div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:border-blue-300"
                      required
                    />
                  </div>

                  {/* NMC Number */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FaIdCard />
                    </div>
                    <input
                      type="text"
                      name="nmcNumber"
                      placeholder="NMC License Number"
                      value={formData.nmcNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:border-blue-300"
                      required
                      minLength="8"
                    />
                  </div>

                  {/* Citizenship Number */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FaIdCard />
                    </div>
                    <input
                      type="text"
                      name="citizenshipNumber"
                      placeholder="Citizenship Number"
                      value={formData.citizenshipNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:border-blue-300"
                      required
                    />
                  </div>

                  {/* Speciality */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FaStethoscope />
                    </div>
                    <input
                      type="text"
                      name="speciality"
                      placeholder="Medical Speciality"
                      value={formData.speciality}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:border-blue-300"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:border-blue-300"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 px-4 rounded-lg font-medium text-white shadow-md transition-all duration-300 ${
                      isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 hover:shadow-lg"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </span>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/doctor-login" className="font-medium text-blue-500 hover:text-blue-600 transition-colors">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterDoctorPage;