import React from 'react';

export const metadata = {
  title: 'Privacy Policy | MediConnect Telemedicine',
  description: 'Learn how we protect your personal health information and data privacy.',
}

const PrivacyPolicyPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-[150px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Privacy Policy</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-500">Effective Date: {currentDate}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-8 md:p-10 space-y-10">
            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                Introduction
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  MediConnect Telemedicine ("we," "our," or "us") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our telemedicine services.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  This policy complies with the Health Insurance Portability and Accountability Act (HIPAA), the General Data Protection Regulation (GDPR), and other applicable privacy laws.
                </p>
              </div>
            </section>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                Information We Collect
              </h2>
              <div className="pl-11">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                  <li>Full name, date of birth, and contact information</li>
                  <li>Government-issued identification numbers</li>
                  <li>Insurance information and policy numbers</li>
                  <li>Payment and billing information</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">Health Information:</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                  <li>Medical history and current health conditions</li>
                  <li>Symptoms, diagnoses, and treatment plans</li>
                  <li>Medication prescriptions and allergies</li>
                  <li>Laboratory test results and imaging reports</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">Technical Information:</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>IP address, browser type, and device information</li>
                  <li>Cookies and usage data</li>
                  <li>Geolocation data (with your consent)</li>
                </ul>
              </div>
            </section>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                How We Use Your Information
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2">
                  <li>To provide, maintain, and improve our telemedicine services</li>
                  <li>To facilitate communication between you and healthcare providers</li>
                  <li>To process payments and insurance claims</li>
                  <li>To comply with legal and regulatory requirements</li>
                  <li>To conduct research and analytics (de-identified data only)</li>
                  <li>To send important notices and updates</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  We will never sell your personal health information to third parties.
                </p>
              </div>
            </section>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                Data Security Measures
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  We implement robust security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2">
                  <li>End-to-end encryption for all data transmissions</li>
                  <li>Secure servers with multi-factor authentication</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Role-based access controls for staff members</li>
                  <li>Data minimization and retention policies</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Despite these measures, no system is 100% secure. In the event of a data breach, we will notify affected individuals and regulatory authorities as required by law.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                Your Rights and Choices
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2 mb-4">
                  <li>Right to access and receive a copy of your health records</li>
                  <li>Right to request corrections to inaccurate information</li>
                  <li>Right to request deletion of your data (with certain exceptions)</li>
                  <li>Right to restrict or object to certain processing activities</li>
                  <li>Right to data portability</li>
                  <li>Right to withdraw consent (where applicable)</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  To exercise these rights or for any privacy-related concerns, please contact our Data Protection Officer at:
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-700">MediConnect Data Protection Officer</p>
                  <p className="text-blue-600">smartcare.privacy@gmail.com</p>
                  <p className="text-gray-600">+977 9869100969</p>
                  <p className="text-gray-600">Baneshwor, Kathmandu, Nepal</p>
                </div>
                <p className="text-gray-600 leading-relaxed mt-4">
                  We may require verification of your identity before processing certain requests.
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SmartCare Connects. All rights reserved.</p>
          <p className="mt-1">This document was last updated on {currentDate}.</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage;