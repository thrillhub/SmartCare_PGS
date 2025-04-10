"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUserInjured, FaHeartbeat, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";

function PatientLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/Patient-profile");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
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
                <FaHeartbeat className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Patient Login</h2>
              <p className="text-gray-500 mt-1">Access your health records and appointments</p>
            </div>
          </div>

          <div className="p-8 pt-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50/80 text-red-700 rounded-lg border border-red-100 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition-colors">
                  <MdEmail />
                </div>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-200 group-hover:border-green-300"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition-colors">
                  <MdLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all duration-200 group-hover:border-green-300"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-blue-500 hover:text-blue-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-lg font-medium text-white shadow-md transition-all duration-300 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 hover:shadow-lg"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    <FaSignInAlt className="inline mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">
                    New patient?
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Link 
                  href="/patient-register" 
                  className="w-full block text-center py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all hover:border-green-300"
                >
                  <FaUserInjured className="inline mr-2" />
                  Register as Patient
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientLogin;