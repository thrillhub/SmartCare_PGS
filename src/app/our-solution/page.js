"use client";
import React from "react";
import Image from "next/image";

function page() {
  const modules = [
    {
      title: "Patient Administration",
      description:
        "This system assists patients in scheduling appointments online, as well as registering walk-in patients. It facilitates the collection ...",
      icon: "https://danphehealth.com/storage/uploads/pCqJyn1pu7uF8Xe01RcdhS8Z7SUXL0H0pTgFaziI.svg", 
    },
    {
      title: "OPD Management",
      description:
        "An organized OPD is crucial for managing a large number of patients attended by multiple doctors. The complete cycle of an effective ...",
      icon: "https://danphehealth.com/storage/uploads/EpXK5EDyLENjofm1vsFABjwl9l831nRZw44NFfuc.svg",
    },
    {
      title: "IPD Management",
      description:
        "The Complete Inpatient Management Module efficiently handles all inpatient functionalities in your hospital, from patient registration to ...",
      icon: "https://danphehealth.com/storage/uploads/NZUBZq4tEOd4Y57kbvgsbE2UkZYnJGFQI5jpRdon.svg",
    },

    {
      title: "OT Management",
      description:
        "The Operation Theater module facilitates the scheduling of operation theaters, surgical teams, patient ...",
      icon: "https://danphehealth.com/storage/uploads/60DLrOSCtJoKjQAjfLtzrLJkmwE2PwYnXSnwdmNj.svg",
    },
    {
      title: "SSF Management",
      description:
        "This module aids in managing the Social Security Fund (SSF) insurance scheme in hospitals. It supports ...",
      icon: "https://danphehealth.com/storage/uploads/EpXK5EDyLENjofm1vsFABjwl9l831nRZw44NFfuc.svg",
    },
    {
      title: "Pathology Software",
      description:
        "The Pathology Lab Management module facilitates the definition of laboratory tests, supporting fully ...",
      icon: "https://danphehealth.com/storage/uploads/Xvqm3QartPuNThCvMEGOaXKlPYTcOgAKAJJbELsw.svg",
    },

    {
      title: "Pharmacy",
      description:
        "The pharmacy module encompasses both central and distributed pharmacies, incorporating several ...",
      icon: "https://danphehealth.com/storage/uploads/ap8hzm56Nfyn3drN6WloW0nimKuACXPl0ViThHH8.svg", // Replace with actual icon source
    },
    {
      title: "Inventory Management",
      description:
        "The inventory module spans across the entire hospital, encompassing wards, OT, pharmacy, and other ...",
      icon: "https://danphehealth.com/storage/uploads/CSdzRoHePc9wwhavblw3rEj0yPSAFqL9bbIiWR2A.svg",
    },
    {
      title: "Queue Management",
      description:
        "The queue management feature in DANPHE HIMS is utilized to manage patient queues and prioritize patient ...",
      icon: "https://danphehealth.com/storage/uploads/X58IC6Jo47xTRG1OactLdafrZ7AMXYmNJuaYmjkw.svg",
    },
    {
      title: "Radiology Management",
      description:
        "The radiology module allows you to choose from multiple tests and promptly make the results available ...",
      icon: "https://danphehealth.com/storage/uploads/6P5EHyHrrpLzE0sYzOILFcxmgaBOt44Oer2lTZxB.svg",
    },
    {
      title: "Finance And Account Management",
      description:
        "The financial module oversees and efficiently manages the entire monetary flow, ensuring transparency ...",
      icon: "https://danphehealth.com/storage/uploads/QcSA83qF2yOaNCctXIi6bYH1KAxQzblXgfwlyFB5.svg",
    },
    {
      title: "HR & Payroll Management",
      description:
        "The HR & Payroll Management module encompasses routine activities of HRD and tasks related to existing ...",
      icon: "https://danphehealth.com/storage/uploads/v52PDl4opz8tneJKc78GElK6VeMGtmfUTLqhMgAu.svg",
    },
    {
      title: "Emergency Management",
      description:
        "The Emergency module assists in registering and managing emergency cases and patients. It tracks the triag ...",
      icon: "https://danphehealth.com/storage/uploads/nv7FNYvHSKswmGzn3R663cgCQ6j9wlvjZ1HDgMKi.svg",
    },
    {
      title: "Telehealth Application",
      description:
        "Telehealth applications enable healthcare providers to deliver medical services remotely to patients via video conferencing or other ...",
      icon: "https://danphehealth.com/storage/uploads/EpXK5EDyLENjofm1vsFABjwl9l831nRZw44NFfuc.svg",
    },
    {
      title: "Health Insurance",
      description:
        "DANPHE incorporates the GoVN-HIB module, seamlessly managing insurance processes to settle patient bills covered under insurance ...",
      icon: "https://danphehealth.com/storage/uploads/NZUBZq4tEOd4Y57kbvgsbE2UkZYnJGFQI5jpRdon.svg",
    },
  ];

  const featuresData = [
    { feature: "Patient Appointment (Web-Based) & Registration System", basic: true, advance: false },
    { feature: "Patient Billing System (OP/IP Charges/Bills)", basic: true, advance: false },
    { feature: "Dr. Fraction (Sharing) System - General", basic: true, advance: false },
    { feature: "Dr. Fraction (Sharing) System - Dynamic", basic: false, advance: true },
    { feature: "Patient Admission, Discharge and Transfer (ADT)", basic: true, advance: false },
    { feature: "Laboratory Management System (LAB)", basic: true, advance: false },
    { feature: "Radiology Management System", basic: true, advance: false },
    { feature: "Pharmacy Management System", basic: true, advance: false },
    { feature: "Procurement & Inventory Management System", basic: true, advance: false },
    { feature: "Inventory Sub-Store Management System", basic: false, advance: true },
    { feature: "Asset Management System", basic: true, advance: false },
    { feature: "Integrated Accounting Management System", basic: true, advance: false },
    { feature: "Personal (Staff) Information Management System", basic: true, advance: false },
    { feature: "Staff Leave Management System", basic: true, advance: false },
    { feature: "Staff Payroll Management System", basic: true, advance: false },
    { feature: "Attendance Management System (Realtime Sync through Biometric Device)", basic: false, advance: true },
    { feature: "Emergency Management System", basic: true, advance: false },
    { feature: "In-Patient Clinical Management System", basic: false, advance: true },
    { feature: "Out-Patient Clinical Management System", basic: false, advance: true },
    { feature: "Nursing Station Management System", basic: true, advance: false },
    { feature: "OT Management System", basic: true, advance: false },
    { feature: "Medical Records Summary Management System (ward-wise)", basic: true, advance: false },
    { feature: "Medical Record Management System (General-Manual Entry)", basic: true, advance: false },
    { feature: "Medical Record Management System (Integrated with EMR)", basic: false, advance: true },
    { feature: "Patient Queue Management System", basic: false, advance: true },
    { feature: "Patient Appointment Mobile (iOS/Android)", basic: false, advance: true },
    { feature: "Managerial Reporting with DASHBOARD", basic: true, advance: false },
  ];


    const featuresData_two = [
    { feature: "Government Health Insurance Integration with Real-time Claim Management", basic: true, advance: false },
    { feature: "Social Security Fund (SSF) Integration", basic: true, advance: false },
    { feature: "Ex-Servicemen Contributory Health Scheme (ECHS) Integration.", basic: true, advance: false },
    { feature: "Online Payment Integration with Online Appointment System(Digital Wallets, Debit Cards, Credit Cards etc)", basic: false, advance: true },
  ];

  const featuresData_three = [
    { feature: "Online Consultation Platform (Telemedicine Service) with EMR Integration", basic: false, advance: true },
  ];
  
  const featuresData_four = [
  { feature: "LAB Machine Interfacing (Bi-Directional)", basic: true, advance: false },
    { feature: "PACS Integration with DANPHE HMIS", basic: true, advance: false },
  ];

  return (
    <>
      <section className="md:p-12 p-4 pt-[175px] md:pt-[150px]">
        <div className="container mx-auto p-4 bg-[#F2FBF8] text-black rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="space-y-4">
                <h1 className="text-2xl lg:text-4xl font-bold mb-4">
                  Unleash Efficiency with <br />
                  <span className="text-customPrimary">Our HIMS Modules!</span>
                </h1>
                <p className="mb-4">
                  Discover streamlined healthcare finances with our
                  revolutionary HIMS billing modules—ensuring precision,
                  efficiency, and compliance for healthcare providers.
                </p>
              </div>
              <div className="md:mt-8 mt-5">
              <button className="mt-5 py-3 px-3 rounded-md bg-customSecondary text-white hover:bg-[#07092B] transition-colors duration-500 ease-in-out">
                      <i className="bi bi-calendar2-minus-fill pr-2"></i>
                      Schedule a Demo
                    </button>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <Image
                  src="https://danphehealth.com/frontend/img/Group%204724.png"
                  alt="DANPHE Dashboard"
                  width={600}
                  height={0}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container mx-auto md:p-12 p-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl lg:text-4xl font-bold mb-4">
              Explore our
              <span className="text-customPrimary"> HIMS</span> Module
            </h1>
            <p className="text-gray-600 mt-2">
              Precision in Healthcare Information Management
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <div
                key={index}
                className="bg-white shadow-md shadow-slate-300 rounded-lg p-6 hover:shadow-lg hover:shadow-blue-200 transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 mr-4">
                      {/* Use Image component if the icon is an image */}
                      <Image
                        src={module.icon}
                        alt={module.title}
                        width={48}
                        height={48}
                      />
                    </div>
                    <h3 className="text-xl font-semibold">{module.title}</h3>
                  </div>
                  <p className="text-gray-600">{module.description}</p>
                </div>
                <div className="mt-4 flex">
                  <a
                    href="#"
                    className="text-customPrimary hover:text-white hover:bg-customSecondary border-2
              hover:border-transparent border-customPrimary rounded-full flex items-center justify-center w-9 h-9 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
  <div className="container mx-auto md:p-12 p-10">
    <div className="text-center mb-4">
      <h1 className="text-2xl lg:text-4xl font-bold mb-4">
        Find the Platform that is
        <span className="text-customPrimary"> Right for You</span>
      </h1>
      <p className="text-gray-600 mt-2">
        Align it with your audience, content, and goals for maximum impact and growth.
      </p>
    </div>

    {/* Features Data Table */}
    <div className="overflow-x-auto mb-8 rounded-lg">
      <table className="min-w-full text-left text-sm text-gray-600">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="p-4">Features</th>
            <th className="p-4">Basic</th>
            <th className="p-4">Advance</th>
          </tr>
        </thead>
        <tbody className="bg-[#F2FBF8]">
          {featuresData.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-4 hover:bg-[#d7e4ff]">{item.feature}</td>
              <td className="p-4 text-center">
                {item.basic ? (
                  <span className="w-4 h-4 rounded-full flex justify-center items-center bg-green-500">
                    <i className="bi bi-check2 text-white"></i>
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full flex justify-center items-center bg-red-500">
                    <i className="bi bi-x text-white"></i>
                  </span>
                )}
              </td>
              <td className="p-4 text-center">
                {item.advance ? (
                  <span className="w-4 h-4 rounded-full flex justify-center items-center bg-green-500">
                    <i className="bi bi-check2 text-white"></i>
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full flex justify-center items-center bg-red-500">
                    <i className="bi bi-x text-white"></i>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Features Data Two Table */}
    <div className="mb-8">
      <div className="bg-blue-900 text-white text-center py-4 font-bold mb-4 rounded-t-lg">
        Specific ADD-ONS Integration Modules
      </div>
      <table className="min-w-full text-left text-sm text-gray-600">
        <tbody className="bg-[#F2FBF8]">
          {featuresData_two.map((item2, index) => (
            <tr key={index} className="border-b">
              <td className="p-4 hover:bg-[#d7e4ff]">{item2.feature}</td>
              <td className="p-4 md:w-[160px] text-center">
                <span className="w-4 h-4 rounded-full flex justify-center items-center bg-green-500">
                  <i className="bi bi-check2 text-white"></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Features Data Three Table */}
    <div className="mb-8">
    <div className="bg-blue-900 text-white text-center py-4 font-bold mb-4 rounded-t-lg">
        Teleconsultation Platform
      </div>
      <table className="min-w-full text-left text-sm text-gray-600">
        <tbody className="bg-[#F2FBF8]">
          {featuresData_three.map((item3, index) => (
            <tr key={index} className="border-b">
              <td className="p-4 hover:bg-[#d7e4ff]">{item3.feature}</td>
              <td className="p-4 text-center md:w-[160px] ">
                <span className="w-4 h-4 rounded-full flex justify-center items-center bg-green-500">
                  <i className="bi bi-check2 text-white"></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div>
      <div className="bg-blue-900 text-white text-center py-4 font-bold mb-4 rounded-t-lg">
        LIS & PACS Integration
      </div>
      <table className="min-w-full text-left text-sm text-gray-600">
        <tbody className="bg-[#F2FBF8]">
          {featuresData_four.map((item4, index) => (
            <tr key={index} className="border-b">
              <td className="p-4 hover:bg-[#d7e4ff]">{item4.feature}</td>
              <td className="p-4 text-center sm:w-[0px] md:w-[160px] ">
                <span className="w-4 h-4 rounded-full flex justify-center items-center bg-green-500">
                  <i className="bi bi-check2 text-white"></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section>
  <div className="container mx-auto md:p-12 p-4">
    <div className="rounded-2xl flex flex-col md:flex-row justify-between items-center bg-[#F2FBF8] py-10">
      <div className="w-full md:w-1/4 mb-6 md:mb-0 hidden md:block">
        <Image
          src="https://danphehealth.com/frontend/img/doctor.png"
          alt="img"
          width={300}
          height={0}
          className="object-contain mx-auto"
        />
      </div>

      <div className="w-full md:w-2/3 text-start md:text-left p-4">
        <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold text-[#3D3D3D]">
          <span className="text-customPrimary">
            Subscribe for a Transformative Demo
          </span>
          <br />
          of Our Cutting-Edge Solutions!
        </h1>
        <p className="text-base text-[#3D3D3D] py-3">
          Subscribe now for a personalized demo and unlock the future with
          innovative solutions tailored to enhance efficiency and elevate
          your overall experience.
        </p>

        <div className="md:flex md:space-y-0 space-y-2 items-center md:border rounded-lg overflow-hidden w-full md:w-96 mx-auto md:mx-0">
          <input
            type="email"
            placeholder="Enter Email"
            className="flex-grow px-4 py-4 focus:outline-none"
          />
           <button className="bg-customSecondary text-white hover:bg-customDark font-semibold px-6 py-3 md:rounded-none rounded-lg transition-colors duration-500 ease-in-out">
            SUBSCRIBE
          </button>
        </div>
      </div>
    </div>
  </div>
</section>



    </>
  );
}

export default page;
