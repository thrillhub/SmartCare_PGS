"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    // Basic validation
    if (!formData.email || !formData.password) {
      setErrorMessage("Email and password are required!");
      return;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
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
        setErrorMessage(result.error || "Registration failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred while registering. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Register as Doctor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["fullName", "address", "email", "phoneNumber", "nmcNumber", "citizenshipNumber", "speciality", "password"].map((field, idx) => (
            <div key={idx}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                name={field}
                placeholder={`Enter your ${field}`}
                value={formData[field]}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          ))}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Register
            </button>
          </div>
        </form>

        {/* Display Success or Error Message */}
        {successMessage && <div className="mt-4 text-center text-green-600">{successMessage}</div>}
        {errorMessage && <div className="mt-4 text-center text-red-600">{errorMessage}</div>}

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/doctor-login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterDoctorPage;