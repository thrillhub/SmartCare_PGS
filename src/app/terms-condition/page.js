import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | MediConnect Telemedicine',
  description: 'Read our terms of service for using our online healthcare platform.',
}

const TermsConditionsPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-[150px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Terms & Conditions</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-500">Effective Date: {currentDate}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-8 md:p-10 space-y-10">
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <p className="font-medium text-gray-800 text-center">
                <span className="font-bold">Important:</span> These Terms & Conditions govern your use of MediConnect Telemedicine services. By accessing our platform, you agree to be bound by these terms.
              </p>
            </div>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                Acceptance of Terms
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("Patient," "User," or "you") and MediConnect Telemedicine ("MediConnect," "we," "us," or "our"). By accessing or using our website, mobile application, or services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  If you do not agree with any part of these Terms, you must not use our services. We reserve the right to modify these Terms at any time, with changes effective upon posting.
                </p>
              </div>
            </section>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                Service Description and Limitations
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  MediConnect provides a technology platform that connects users with licensed healthcare professionals for telemedicine consultations. Our services include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2 mb-4">
                  <li>Virtual consultations with healthcare providers</li>
                  <li>Electronic prescription services (where permitted by law)</li>
                  <li>Secure messaging and health record access</li>
                  <li>Appointment scheduling and reminders</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="font-medium text-yellow-700">
                    <span className="font-bold">Important:</span> Our services are not for medical emergencies. In case of emergency, call 911 or go to the nearest emergency room.
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We do not guarantee the availability of any specific healthcare provider or that our services will meet your particular needs.
                </p>
              </div>
            </section>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                User Responsibilities
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  As a user of our services, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2 mb-4">
                  <li>Provide accurate, current, and complete information about yourself and your health</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the services only for lawful purposes and in compliance with all applicable laws</li>
                  <li>Be at least 18 years of age or have parental/guardian consent</li>
                  <li>Not misrepresent your identity or health information</li>
                  <li>Not record consultations without provider consent</li>
                  <li>Not use the service while operating a vehicle or machinery</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Violation of these responsibilities may result in termination of your access to our services.
                </p>
              </div>
            </section>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                Medical Disclaimers
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  MediConnect does not provide medical advice or practice medicine. Healthcare providers using our platform are independent practitioners solely responsible for the healthcare services they provide.
                </p>
                <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                  <p className="font-medium text-red-700">
                    <span className="font-bold">Disclaimer:</span> There are limitations to telemedicine services. Providers may determine that certain conditions are not appropriate for telemedicine and may recommend in-person care.
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  You understand that no doctor-patient relationship is established with MediConnect itself, only with the healthcare providers you consult with through our platform.
                </p>
              </div>
            </section>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                Payments, Billing, and Insurance
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  You agree to pay all fees associated with your use of our services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2 mb-4">
                  <li>Consultation fees are due at the time of service</li>
                  <li>We accept major credit cards and other payment methods as displayed</li>
                  <li>You are responsible for verifying insurance coverage</li>
                  <li>Refunds are issued at our discretion for service interruptions</li>
                  <li>Late cancellations may incur fees as specified in our cancellation policy</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  All fees are non-transferable and quoted in U.S. dollars unless otherwise specified.
                </p>
              </div>
            </section>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">6</span>
                Intellectual Property
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  All content, features, and functionality on our platform, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are the exclusive property of MediConnect or our licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  You are granted a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes only.
                </p>
              </div>
            </section>

            <section className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">7</span>
                Limitation of Liability
              </h2>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  To the maximum extent permitted by law, MediConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2 mb-4">
                  <li>Your access to or use of or inability to access or use the services</li>
                  <li>Any conduct or content of any third party on the services</li>
                  <li>Any unauthorized access, use, or alteration of your transmissions or content</li>
                  <li>Any health outcomes resulting from the use of our services</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Our total liability for any claims under these terms shall not exceed the amount you paid us to use the services in the past 12 months.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-50 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">8</span>
                General Provisions
              </h2>
              <div className="pl-11">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Governing Law:</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
                </p>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">Dispute Resolution:</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Any disputes arising from these Terms shall be resolved through binding arbitration in San Francisco, California, in accordance with the rules of the American Arbitration Association.
                </p>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Information:</h3>
                <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-700">SmartCare Connects</p>
                  <p className="text-blue-600">smartcare.legal@gmail.com</p>
                  <p className="text-gray-600">+977 9869100969</p>
                  <p className="text-gray-600">Baneshwor, Kathmandu, Nepal</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SmartCare Connects . All rights reserved.</p>
          <p className="mt-1">These Terms & Conditions were last updated on {currentDate}.</p>
        </div>
      </div>
    </div>
  )
}

export default TermsConditionsPage;