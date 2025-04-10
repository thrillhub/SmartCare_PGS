"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUserInjured, FaHeart, FaLock, FaUser, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

function PatientRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/patient-login");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[600px]">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header with logo */}
          <div className="bg-white p-6 text-center border-b border-gray-100">
            <div className="flex justify-center mb-6">
              <Image 
                src="/images/front.png" 
                alt="Healthcare Logo" 
                width={180} 
                height={60}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center mb-4 shadow-md">
                <FaHeart className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Patient Registration</h2>
              <p className="text-gray-500 mt-1">Join our healthcare community</p>
            </div>
          </div>

          <div className="p-8 pt-6">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50/80 text-green-700 rounded-lg border border-green-100 text-sm backdrop-blur-sm">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50/80 text-red-700 rounded-lg border border-red-100 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition-colors">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-200 group-hover:border-green-300"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition-colors">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-200 group-hover:border-green-300"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition-colors">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-200 group-hover:border-green-300"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition-colors">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (min 8 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-200 group-hover:border-green-300"
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition-colors">
                  <FaLock />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-200 group-hover:border-green-300"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-500 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
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
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/patient-login" className="font-medium text-blue-500 hover:text-blue-600 transition-colors">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientRegister;