"use client";
import React from "react";
import Image from "next/image";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import "../Components/Uni.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

function page() {
  const information = [
    {
      href: "",
      src: "https://danphehealth.com/frontend/img/svg/mobile-friendly.svg",
      alt: "user",
      title: "User Friendly",
    },
    {
      href: "",
      src: "https://danphehealth.com/frontend/img/svg/lock.svg",
      alt: "access",
      title: "Easy to Access",
    },
    {
      href: "",
      src: "https://danphehealth.com/frontend/img/svg/suitcase.svg",
      alt: "Appearance",
      title: "Professional Appearance",
    },
    {
      href: "",
      src: "https://danphehealth.com/frontend/img/svg/jigsaw.svg",
      alt: "Rich",
      title: "Feature Rich",
    },
  ];

  const card = [
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/nc2YYOp5UgiAIZbiOMUj82uxIdG4jlNwKztoLIdn.jpg",
      alt: "img",
      name: "Ram P. Dhungana",
      bio: "Chairman",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/oQLbkHz6vDmpHhrZodXRmQiXOv44n7S5MX6WrKbm.jpg",
      alt: "img",
      name: "Dr Prabhat Adhikari, MD",
      bio: "Co-Founder and Clinical Director",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/Z5p6J64WddandSwTO03HBpjeNI0dxB2T8rauXZwv.jpg",
      alt: "img",
      name: "Shiv P Koirala",
      bio: "Co-Founder and Technical Director",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/Ez0mPHOJJ7XkxkvkgerlblVKqiwtJcQDGHPTF73J.jpg",
      alt: "img",
      name: "Dr.Binod Dhungana, MD, MBA",
      bio: "Co-founder and Director",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/R9gD9uD4mHA8hKxg5p5ZUIvs1GXp0CloKR3C1TZX.jpg",
      alt: "img",
      name: "Yubraj Parajuli",
      bio: "Chief Executive Officer",
    },
  ];

  const logos = [
    {
      src: "https://danphehealth.com/storage/uploads/4IY4SO3BaLokN5TATWTijwqOSQvnAq880dX06swm.png",
      alt: "Company 1",
    },
    {
      src: "https://danphehealth.com/storage/uploads/YRlPFHdotC4yL6OpPwfpJi6W0S8G0kcPNNmvL5JG.png",
    },
    {
      src: "https://danphehealth.com/storage/uploads/LvNtx7mQtJlbz9ycPe8pQZVoPzLBiFsuMyfRY1Pr.png",
      alt: "Company 3",
    },
    {
      src: "https://danphehealth.com/storage/uploads/dpOuibvB4foJdzuMpROb1Xaduko2KPZ8h5sof1Nz.png",
      alt: "Company 4",
    },
    {
      src: "https://danphehealth.com/storage/uploads/s6mv48ri5hDrXDxgzU3E1lIW8qRj9TUrV69b5hQc.jpg",
      alt: "Company 5",
    },
    {
      src: "https://danphehealth.com/storage/uploads/rqjKdONW5AKP4sX49m4IIgKAx8zo4I6qm9pHLIdw.png",
      alt: "Company 6",
    },
    {
      src: "https://danphehealth.com/storage/uploads/DvtgZd0LZopNWutTMb8AYZ7AnQRKHH4ROmN7zCIw.png",
      alt: "Company 7",
    },
    {
      src: "https://danphehealth.com/storage/uploads/WQEEaXp58AGxNO61rv0xqypPC4KpMhnvpJb2Q01c.png",
      alt: "Company 8",
    },
    {
      src: "https://danphehealth.com/storage/uploads/PSjGCpwlgqK620FI8qTz4h6vkUvexhNIq0iQUvEz.png",
      alt: "Company 9",
    },
    {
      src: "https://danphehealth.com/storage/uploads/IHeII9hv0UFpBpwTLouWfOOnGMWDtNaFIbmnQZg1.jpg",
      alt: "Company 10",
    },
    {
      src: "https://danphehealth.com/storage/uploads/XwKrcFgg8NzD5hs58C8dz91oiCFZ0MnLJNKoqdaQ.png",
      alt: "Company 11",
    },
    {
      src: "https://danphehealth.com/storage/uploads/roKTGWaMI1ZvCpKyogTJV22ri3QYifaTXylgCdcC.png",
      alt: "Company 12",
    },
  ];
  return (
    <>
      <section>
        <div className="relative flex items-center justify-center h-[460px] md:h-[400px] lg:h-[500px] bg-gray-800">
          <Image
            src="/images/2.png"
            alt="Healthcare professionals"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="opacity-40"
          />
          <div className="absolute bottom-[80px] md:bottom-[90px] lg:bottom-[100px] text-center px-4">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-white leading-tight">
              Transforming Healthcare with <br className="hidden lg:block" />{" "}
              Innovation and Compassionate Expertise
            </h1>
            <p className="mt-2 md:mt-4 text-sm md:text-lg text-white">
              Incorporate decision support systems and evidence-based{" "}
              <br className="hidden lg:block" />
              practices for enhanced clinical care.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center p-9 md:p-12 ">
          <div className="w-full lg:w-1/2 flex flex-col items-start order-1 lg:order-1">
            <h1 className="text-xl lg:text-4xl font-bold">
              Empowering Healthcare Through{" "}
              <span className="text-customPrimary ">
                Customized Software Solutions
              </span>
            </h1>
            <h5 className="mt-4 text-sm lg:text-lg">
              Harnessing Technology to Transform Healthcare Delivery Worldwide
            </h5>
            <p className="mt-4 text-sm lg:text-lg">
              Imark Digital Pvt. Ltd. in Kathmandu, Nepal, delivers tailored
              healthcare software solutions globally. With over 15 years of
              experience, we offer cost-effective IT services, leveraging
              advanced technical skills and a dedicated team of 130+
              professionals. Our expertise includes customizable applications,
              risk assessment, and decision analytics, ensuring clients receive
              innovative solutions to meet their specific needs.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-2 lg:order-2 pt-5 md:pt-6 lg:pt-0">
            <Image
              src="/images/2.jpg"
              width={480}
              height={0}
              className="rounded-lg"
              alt="Healthcare Software Solutions"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F2FBF8] md:pb-10">
        <div className="container mx-auto p-10 md:p-8 text-center">
          <h1 className="text-xl lg:text-4xl font-bold ">
            Choose{" "}
            <span className="text-customPrimary">SmartCare Connect For</span>
          </h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg">
            SmartCare offers a top-notch, affordable Hospital Management
            Information <br />
            System with a decade of leadership and quality commitment.
          </p>
        </div>

        <div className="container mx-auto md:p-4 p-10">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            loop={true}
            pagination={{
              clickable: true,
            }}
            centeredSlides={true}
            modules={[Pagination]}
            className="mySwipertwo"
            slideActiveClass="swiper-slide-active"
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
          >
            {information.map((info, index) => (
              <SwiperSlide key={index} className="flex justify-center">
                <div
                  className={`p-6 text-center transition-all duration-500 swiper-slide-content`}
                >
                  <Image
                    src={info.src}
                    alt={info.alt}
                    width={50}
                    height={50}
                    className="mx-auto"
                  />
                  <h4 className="mt-4 text-lg font-semibold">{info.title}</h4>
                  <p className="text-gray-600 mt-2">
                    {index === 0
                      ? "SmartCare HMIS is a fully web-based system, enabling access and management of patient data and organization updates from anywhere in the world."
                      : index === 1
                      ? "SmartCare HMIS enhances patient care with professional management of hospital data. Features like online appointment scheduling and fully integrated EMR and HER streamline patient and hospital management."
                      : "SmartCare is a complete HMIS/EMR solution that encompasses over 32 modules with all the features required to operate a hospital ranging from small to large size."}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="bg-gradient-to-r from-gray-100 to-gray-300 p-10 md:p-12 rounded-lg shadow-lg">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">
            Unveiling Our Pillars of Strength
          </h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg">
            The Core Attributes and Values that Propel SmartCare Connect.
            Forward in Excellence, Innovation, and Client-Centric Success.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-3xl font-bold text-gray-800">
              <CountUp end={15} duration={3} />+
            </span>
            <span className="text-gray-600 mt-1">Years of Experience</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-3xl font-bold text-gray-800">
              <CountUp end={55} duration={3} />+
            </span>
            <span className="text-gray-600 mt-1">Hospitals and Clinics</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-3xl font-bold text-gray-800">
              <CountUp end={130} duration={3} />+
            </span>
            <span className="text-gray-600 mt-1">Employees</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-3xl font-bold text-gray-800">
              <CountUp end={30} duration={3} />+
            </span>
            <span className="text-gray-600 mt-1">HIMS Modules</span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto md:p-12 p-10 space-y-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            Professional Team Members of{" "}
            <span className="text-customPrimary">SmartCare Connect</span>
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {card.map((person, index) => (
              <div
                key={index}
                className="max-w-full sm:max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <Image
                  className="rounded-t-lg w-full h-auto"
                  src={person.src}
                  alt={person.alt}
                  width={400}
                  height={0}
                />
                <div className="p-5">
                  <h5 className="mb-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {person.name}
                  </h5>
                  <p className="mb-3 text-sm sm:text-base font-normal text-gray-700 dark:text-gray-400">
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="md:p-12 p-10">
        <div className="container mx-auto p-4 bg-[#F2FBF8] text-black rounded-xl">
          <h1 className="text-xl lg:text-4xl font-bold md:text-center mb-4">
            SmartCare Solutions & Services Overview
          </h1>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center mb-10">
            <button className="bg-white text-customPrimary hover:bg-customSecondary hover:text-white px-4 py-2 rounded-lg shadow-md shadow-slate-300">
              SmartCare HMIS with EHR
            </button>
            <button className="bg-white text-customPrimary hover:bg-customSecondary hover:text-white px-4 py-2 rounded-lg shadow-md shadow-slate-300">
              Telemedicine
            </button>
            <button className="bg-white text-customPrimary hover:bg-customSecondary hover:text-white px-4 py-2 rounded-lg shadow-md shadow-slate-300">
              SmartCare Services
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-semibold">
                  Patient Management
                </h2>
                <p className="mb-4">
                  Smart Care Patient Management involves comprehensive health
                  services to assist patient in managing their health practices
                  like online appointment, queue management through WEB and APP
                  management.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Patient Master Setup</li>
                  <li>Online Appointment Scheduling</li>
                  <li>Patient Registration</li>
                  <li>ADT (Admission, Discharge & Transfer)</li>
                  <li>Referral Management</li>
                  <li>Medical Records</li>
                  <li>Queue & Token Management</li>
                  <li>Patient APP</li>
                </ul>
              </div>

              <div className="space-y-2 mt-8">
                <h2 className="text-gray-400">Materials (goods) Management</h2>
                <h2 className="text-gray-400">Revenue Management</h2>
              </div>

              <div className="mt-8">
                <button className=" bg-customSecondary text-white hover:bg-customDark transition-colors duration-500 ease-in-out px-6 py-2 rounded-lg shadow-md shadow-slate-300">
                  View All
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

      <section className="md:p-12 p-4">
        <div className="container mx-auto text-center md:space-y-10 bg-[#F2FBF8] rounded-xl p-4">
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-[#3D3D3D]">
            Trusted by
          </h1>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-8 mb-8 md:p-0 p-4">
            {logos.map((logo, index) => (
              <div key={index} className="flex justify-center items-center">
                <a href="">
                  {" "}
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={120} // Adjust the width as needed
                    height={60} // Adjust the height as needed
                    className="object-contain"
                  />
                </a>
              </div>
            ))}
          </div>
          <button className="px-6 py-2 bg-customSecondary text-white rounded-full hover:bg-[#070928] transition-colors duration-500 ease-in-out">
            View All <i class="bi bi-arrow-right-short"></i>
          </button>
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
