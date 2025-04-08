"use client";
import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "./Components/Uni.css";

function Page() {
  const services = [
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/o8LhlIHosonN1ss1Xbnx4BuPQIH2j5kTJLsqkWUF.svg",
      alt: "Patient Administration",
      title: "Patient Administration",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/1FLzrtg52EKgMbKXaPPcngIBl8ThbVT5f93VKn5U.svg",
      alt: "OPD Management",
      title: "OPD Management",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/JZb6vJSIzCQZjvPUKBy1ds3KmAL8FMlvVL1XhtV7.svg",
      alt: "IPD Management",
      title: "IPD Management",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/CACHu7gc6zeiiyuUvDBzfZIn2tBT51gzsKA0wpLj.svg",
      title: "OT Management",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/TEOZjK4GizUOcRSJNzlS57CV0JKt5mQxvJPUsKiS.svg",
      alt: "SSF Management",
      title: "SSF Management",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/Xvqm3QartPuNThCvMEGOaXKlPYTcOgAKAJJbELsw.svg",
      alt: "Pathalogy Software",
      title: "Pathalogy Software",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/ap8hzm56Nfyn3drN6WloW0nimKuACXPl0ViThHH8.svg",
      alt: "Pharmacy",
      title: "Pharmacy",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/CSdzRoHePc9wwhavblw3rEj0yPSAFqL9bbIiWR2A.svg",
      alt: "Inventory Management",
      title: "Inventory Management",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/CSdzRoHePc9wwhavblw3rEj0yPSAFqL9bbIiWR2A.svg",
      alt: "Quene Management",
      title: "Queue Management",
    },
    {
      href: "",
      src: "https://danphehealth.com/storage/uploads/X58IC6Jo47xTRG1OactLdafrZ7AMXYmNJuaYmjkw.svg",
      alt: "Pathalogy Software",
      title: "Pathalogy Software",
    },
  ];

  const testimonials = [
    {
      id: 1,
      title: "MI Kidney Centre",
      description:
        "MI Kidney Centre is focusing on spreading Dialysis services in different districts of Nepal, prioritizing rural cities with frequent screening and awareness programs for Kidney diseases.",
      rating: 4,
      image:
        "https://danphehealth.com/storage/uploads/CvegKrVeoWfcXC7sMrXLVmB6Vj5ikChWIPZEln7d.png",
      company: "Mark International Kidney Center",
    },
    {
      id: 2,
      title: "Buddhanilkantha Healthcare Pvt. Ltd.",
      description:
        "A team of doctors committed to providing affordable and high-quality basic medical services believes in preventing and reducing illness within an affordable setup.",
      rating: 4,
      image:
        "https://danphehealth.com/storage/uploads/WJhqEGEa3RoG8kMO0vitnHKhk5L3LDixj72dxwfm.png",
      company: "Buddhanilkantha Healthcare Pvt. Ltd.",
    },
    {
      id: 3,
      title: "Charak Hospital Pvt. Ltd.",
      description:
        "Charak Memorial Hospital strives for excellence in quality, hygiene, and technology, meeting public health needs in the Western Region through innovation and cost-effective solutions.",
      rating: 4,
      image:
        "https://danphehealth.com/storage/uploads/s6mv48ri5hDrXDxgzU3E1lIW8qRj9TUrV69b5hQc.jpg",
      company: "Charak Hospital Pvt. Ltd.",
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

  // State to manage active service index
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <section className="bg-[#F2FBF8]">
        <div className="container mx-auto p-7 md:px-12 md:pt-[140px] pt-[220px]">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{
              clickable: true,
            }}
            navigation={false}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="md:font-bold font-extrabold md:text-5xl text-3xl text-[#3D3D3D]">
                    Efficient, Reliable and <br /> Affordable
                  </h2>
                  <h4 className="pt-3">
                    Transforming healthcare information management with complete
                    Health Care Solutions
                  </h4>
                  <div>
                    <button className="mt-5 py-3 px-3 rounded-md bg-customSecondary text-white hover:bg-customDark transition-colors duration-500 ease-in-out">
                      <i className="bi bi-calendar2-minus-fill pr-2"></i>
                      Schedule a Demo
                    </button>
                    <button className="mt-5 py-3 px-4 rounded-md border border-customSecondary text-customSecondary hover:bg-customDark ml-3 hover:text-white hover:border-transparent transition-colors duration-500 ease-in-out">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Image
                    src="https://danphehealth.com/storage/uploads/5BRPoCDX4MLIIdGkW2LQVtlcBFKZa61HMKed8Plg.png"
                    alt="Logo"
                    width={420}
                    height={0}
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="md:font-bold font-extrabold md:text-5xl text-3xl text-[#3D3D3D]">
                    What values{" "}
                    <span className="text-customPrimary">
                      SmartCare Connect <br /> can ADD
                    </span>{" "}
                    to your <br />
                    business
                  </h2>
                  <div className="md:w-2/3 w-3/3 pt-5 space-y-5">
                    <h4>
                      <i className="bi bi-arrow-right-square-fill pr-3 text-customSecondary"></i>
                      Help our customer to take a lead in their business using
                      information technology
                    </h4>
                    <h4>
                      <i className="bi bi-arrow-right-square-fill pr-3 text-customSecondary"></i>
                      Time tested products to increase customer operation
                      efficiency immediately
                    </h4>
                  </div>
                  <button className="mt-5 py-3 px-3 rounded-md bg-customSecondary text-white hover:bg-[#07092B] transition-colors duration-500 ease-in-out">
                    <i className="bi bi-calendar2-minus-fill pr-2"></i>
                    Schedule a Demo
                  </button>
                  <button className="mt-5 py-3 px-4 rounded-md border border-customSecondary text-customSecondary hover:bg-customDark ml-3 hover:text-white hover:hover:border-transparent transition-colors duration-500 ease-in-out">
                    Learn More
                  </button>
                </div>
                <div className="hidden lg:block">
                  <Image
                    src="https://danphehealth.com/frontend/img/slideimg2.png"
                    alt="Logo"
                    width={450}
                    height={0}
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex justify-between items-center">
                <div className="md:w-1/2 w-3/3 space-y-10">
                  <h2 className="md:font-bold font-extrabold md:text-5xl text-3xl text-[#3D3D3D]">
                    All-In-One Solutions for Hospital Information Management
                  </h2>
                  <h4>
                    Trusted by Top Hospitals. Used in 53+ Hospitals and growing
                    more?
                  </h4>
                  <button className="mt-5 py-3 px-3 rounded-md bg-customSecondary text-white hover:bg-customDark transition-colors duration-500 ease-in-out">
                    <i className="bi bi-calendar2-minus-fill pr-2"></i>
                    Schedule a Demo
                  </button>
                  <button className="mt-5 py-3 px-4 rounded-md border border-customSecondary text-customSecondary hover:bg-customDark ml-3 hover:text-white hover:border-transparent transition-colors duration-500 ease-in-out">
                    Learn More
                  </button>
                </div>
                <div className="hidden lg:block">
                  <Image
                    src="https://danphehealth.com/storage/uploads/gNobfWer8kFqkYAYiKbXvwkIAMe5sKqX6PSSkyNH.png"
                    alt="Logo"
                    width={450}
                    height={0}
                  />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <section className="md:py-[50px]">
        <div className="container mx-auto md:p-8 p-8  text-center">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold text-[#3D3D3D]">
              Discover a complete solution for HIMS with EMR
            </h1>
            <p className="text-base text-[#3D3D3D] py-3">
              All-in-one hospital management solution for seamless operations
            </p>
          </div>
        </div>

        <div className="container mx-auto md:px-4 px-8">
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            pagination={false}
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
            }}
            modules={[Navigation]}
            className="mySwiper secswipe border rounded-md shadow-blue-400 shadow-lg lg:w-[80%]"
          >
            {services.map((service, index) => (
              <SwiperSlide
                key={index}
                className={`swiper-slide-custom text-center flex flex-col items-center py-5 relative ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => setActiveIndex(index)}
                style={{
                  cursor: "pointer",
                }}
              >
                <div
                  className={`flex flex-col items-center ${
                    index === activeIndex ? "active" : "hover"
                  }`}
                >
                  <Image
                    src={service.src}
                    alt={service.alt}
                    width={30}
                    height={30} 
                    className="mx-auto"
                  />
                  <h4
                    className={`mt-2 text-sm ${
                      service.textColor || "text-gray-800"
                    } relative text`}
                  >
                    {service.title}
                    <span
                      className={`underline ${
                        index === activeIndex
                          ? "underline-active"
                          : "underline-hover"
                      }`}
                    ></span>
                  </h4>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ... */}

      <section className="md:py-[50px] pt-6">
        <div className="container mx-auto md:p-12 p-10">
          <div className="flex flex-col-reverse md:flex-row justify-center items-center">
            <div class="w-full md:w-1/2 bg-gray-100 rounded-md shadow-xl shadow-slate-300 px-4 md:relative left-5 py-5 md:py-5">
              <h4 className="text-green-600 font-semibold">OUR MODULE</h4>
              <h2 className="text-3xl font-bold mb-4 text-[#3D3D3D]">
              Enhancing Patient Care and Staff Incentives
              </h2>
              <p className="mb-6">
              This system assists patients in scheduling appointments online, as well as registering walk-in patients. It facilitates the collection of demographic, insurance, and other
              </p>
              <a
                href="#"
                class="bg-customSecondary hover:bg-customDark text-white py-2 px-4 rounded transition-colors duration-500 ease-in-out;"
              >
                View Detail
              </a>
            </div>
            <div className="w-full md:w-1/2">
              <Image
                src="/images/1.jpg"
                alt="Operation Theater"
                width={800}
                height={0}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-6 md:pb-0">
        <div className="container mx-auto md:p-12 p-10">
          <div className="flex flex-col-reverse md:flex-row justify-center items-center bg-white overflow-visible">
            <div className="w-full lg:w-1/2 p-4 md:py-4 bg-gray-100 rounded-md shadow-xl shadow-slate-300 md:relative left-5">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/icon-1.png"
                  alt="Icon"
                  className="w-10 h-10 mr-4"
                  width={100}
                  height={0}
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    SmartCare Connect 
                  </h3>
                  <p className="text-gray-600">For Healthcare Institutions</p>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Delivering better outcomes by working together to build smart
                system solutions for you
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  Improve your patient experience by improving your process with
                  SmartCare HMIS Software
                </li>
                <li>
                  Significant reduction in time and effort required to manage
                  your Health Institution
                </li>
              </ul>
              <a
                href="#"
                className="mt-6 inline-block bg-customSecondary hover:bg-customDark text-white py-2 px-4 rounded transition-colors duration-500 ease-in-out"
              >
                Explore More
              </a>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="https://danphehealth.com/storage/uploads/J5HGllnvBypttl0s1w0gHmgj05xHz50zl1ly15NQ.jpg"
                alt="Danphe HIMS"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="md:py-[50px]">
        <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:p-12 p-10 bg-gray-100">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Danphe Efficiency"
              class="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-4 text-white">
              <h2 class="text-xl font-semibold">SmartCare Efficiency</h2>
              <p class="mt-2 text-lg font-bold">Explore more about SmartCare Connect!</p>
              <button className="mt-6 w-[100px] p-2 text-sm bg-customSecondary text-white rounded hover:bg-[#070928] transition-colors duration-500 ease-in-out">
                View Detail
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center ">
              <div className="text-green-500 lg:text-3xl text-2xl">
                <i className="bi bi-download  lg:mr-4 md:mr-2 mr-4"></i>
              </div>
              <h2 className="lg:text-4xl text-2xl font-bold text-customSecondary">
                Brochure
              </h2>
            </div>
            <p className="mt-4 text-gray-600">
              One solution, no software clutter – Comprehensive EHR and HIMS in
              a nutshell.
            </p>
            <button className="mt-6 px-4 py-2 text-customSecondary rounded bg-transparent border border-customSecondary hover:bg-[#07092B] hover:text-white hover:border-transparent transition-colors duration-500 ease-in-out">
              Download Now
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center ">
              <div className="text-green-500 lg:text-3xl text-2xl ">
                <i className="bi bi-download lg:mr-4 md:mr-2 mr-4"></i>
              </div>
              <h2 className="lg:text-4xl text-2xl font-bold text-customSecondary">
                Presentation
              </h2>
            </div>
            <p className="mt-4 text-gray-600">
              One solution, no software clutter – Comprehensive EHR and HIMS in
              a nutshell.
            </p>
            <button className="mt-6 px-4 py-2 text-customSecondary rounded bg-transparent border border-customSecondary hover:bg-[#07092B] hover:text-white hover:border-transparent transition-colors duration-500 ease-in-out">
              Download Now
            </button>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-0">
        <div className="container mx-auto md:p-8 p-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-[#3D3D3D]">
              We Provide Trusted and Best Software
            </h1>
            <p className="text-base text-[#3D3D3D] py-3">
              All-in-one hospital management solution for seamless operations
            </p>
          </div>

          <div className="flex flex-wrap md:gap-[100px] gap-12 md:p-4 items-center md:py-5 py-5">
            {/* Left Section */}
            <div className="flex-1 min-w-[300px]">
              <Image
                src="https://danphehealth.com/frontend/img/about-img.png"
                alt="img"
                width={480}
                height={0}
                className="rounded-md shadow-md shadow-slate-300 w-full"
              />
            </div>

            <div className="flex-1 min-w-[300px] space-y-6">
              <div className="flex items-start space-x-3">
                <Image
                  src="https://danphehealth.com/frontend/img/svg/fi_2785482.svg"
                  alt="img"
                  width={100}
                  height={0}
                  className="border p-2 rounded-md bg-[#00AC75]"
                />
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">
                    Built By Doctors For Doctors
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We have your efficiency and ease in mind, so we have
                    developed a user-friendly solution.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Image
                  src="https://danphehealth.com/frontend/img/svg/fi_487551.svg"
                  alt="img"
                  width={140}
                  height={0}
                  className="border p-2 rounded-md bg-[#00AC75]"
                />
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Customizable & Scalable</h4>
                  <p className="text-gray-600 text-sm">
                    We built it from the bottom up, so we can customize to your
                    needs. Also, as your business grows, SmartCare can scale to
                    meet your demands.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Image
                  src="https://danphehealth.com/frontend/img/svg/fi_3305673.svg"
                  alt="img"
                  width={85}
                  height={0}
                  className="border p-2 rounded-md bg-[#00AC75]"
                />
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Cloudbase Service</h4>
                  <p className="text-gray-600 text-sm">
                    We offer both on-premises and cloud-based services catering
                    to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="md:py-[50px]">
        <div className="container flex-col mx-auto md:p-12 p-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-[#3D3D3D]">
            Access Your Inventory
          </h1>
          <p className="text-base text-[#3D3D3D] py-3">
            See what our valuable clients tell about us
          </p>

          {/* Slider for mobile and tablet screens */}
          <div className="block md:hidden py-10">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]} // Add the Pagination module here
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-white border shadow-xl shadow-slate-300 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      {testimonial.description}
                    </p>
                    <div className="flex items-center mb-4 justify-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      {[...Array(5 - testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="font-semibold text-lg text-gray-800">
                      {testimonial.company}
                    </p>
                    <img
                      src={testimonial.image}
                      alt={testimonial.company}
                      className="mt-4 h-12 object-contain mx-auto"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Static layout for PC screens */}
          <div className="hidden md:flex flex-col items-center justify-between space-y-8 md:flex-row md:space-y-0 md:space-x-7">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white shadow-lg shadow-slate-400 rounded-lg p-6 w-100 lg:h-[350px] "
              >
                <p className="text-gray-700 mb-4">{testimonial.description}</p>
                <div className="flex items-center mb-4 justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="font-semibold text-lg text-gray-800">
                  {testimonial.company}
                </p>
                <img
                  src={testimonial.image}
                  alt={testimonial.company}
                  className="mt-4 h-12 object-contain mx-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F2FBF8]">
        <div className="container mx-auto text-center md:space-y-10 md:p-8 p-10">
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-[#3D3D3D]">
            Trusted by
          </h1>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-8 mb-8 md:p-0 p-4">
            {logos.map((logo, index) => (
              <div key={index} className="flex justify-center items-center">
               <a href=""> <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120} 
                  height={60} 
                  className="object-contain"
                /></a>
              </div>
            ))}
          </div>
          <button className="px-6 py-2 bg-customSecondary text-white rounded-full hover:bg-[#070928] transition-colors duration-500 ease-in-out">
            View All <i class="bi bi-arrow-right-short"></i>
          </button>
        </div>
      </section>

      <section className="md:py-[50px] py-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8 p-10 md:p-12">
          <div className="w-full md:w-1/2 lg:w-2/3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#3D3D3D]">
              Let us know how we can help you.
            </h1>
            <p className="text-base text-[#3D3D3D] pb-8">
              You can send an email to{" "}
              <a href="#">
                <span className="text-customPrimary">info@danphehealth.com</span>
              </a>
            </p>
            <form className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="firstName"
                  >
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="lastName"
                  >
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-700"
                  htmlFor="phoneNumber"
                >
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-700"
                  htmlFor="message"
                >
                  Message<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Message"
                ></textarea>
              </div>

              <div className="text-start">
                <button
                  type="submit"
                  className="px-6 py-2 bg-customSecondary text-white rounded-md hover:bg-customDark transition-colors duration-500 ease-in-out"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.6164001962547!2d85.32716410000002!3d27.729127799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19fba7e5fa51%3A0xc4172146a7cef225!2sDanphe%20Health%20Inc.%20Pvt.%20Ltd.!5e0!3m2!1sen!2ssg!4v1724390089888!5m2!1sen!2ssg"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <section>
  <div className="container mx-auto md:p-12 p-4">
    <div className="rounded-2xl flex flex-col md:flex-row justify-between items-center bg-[#F9F9F9] py-10">
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

export default Page;
