"use client";
import React from "react";
import Image from "next/image";

function Page() {
  const newsEvents = [
    {
      id: 1,
      title: '2023 Recap of AI developments',
      date: '2024-01-03',
      author: 'Digwatch',
      description: 'In the swiftly evolving landscape of the artificial intelligence technology...',
      image: 'https://danphehealth.com/storage/uploads/qJC8UWbueNgrVxOUzwXyz4vAXQi9zxmNFD2dBWU9.png',
      getLink: () => '/news/2023-recap-of-ai-developments',
    },
    {
      id: 2,
      title: 'Navigating the Healthcare Landscape: A Comprehensive Guide to HIPAA Compliance in Hospitals',
      date: '2024-01-08',
      author: 'Danphe Health',
      description: 'In the ever-evolving realm of healthcare, safeguarding patient information...',
      image: 'https://danphehealth.com/storage/uploads/UCplaL4d4WzJAv9ZxgqTOUIpvHGjL2ZPj6jOnDdf.jpg',
      getLink: () => '/news/hipaa-compliance-guide',
    },
    {
      id: 3,
      title: 'How do electronic health records (EHR or EMR) make healthcare better?',
      date: '2023-02-17',
      author: 'Eduhealth System',
      description: 'There is a growing interest in EHRs around the world. Technology and innovations are changing the health industry, governments and organizations are focusing on providing better health services to the public.',
      image: 'https://danphehealth.com/storage/uploads/h2HDNsv5bp2mI8WG9xv7spFXiQFhIWlr2hUMHLG5.jpg',
      getLink: () => '/news/hipaa-compliance-guide',
    },
    {
      id: 4,
      title: 'Importance of Electronic Health Records in Nursing',
      date: '2023-05-04',
      author: 'Regis College',
      description: 'In 2009, only 12% of hospitals used EHRs, according to the Office of the National Coordinator for Health Information Technology. By 2021 — thanks in part to $27 billion in financial incentives from Congress — EHRs were almost universal, with 96% of hospitals adopting them.',
      image: 'https://danphehealth.com/storage/uploads/an0lprVHccGkqUYrQk6A3spAlUjZWuVMB7E1gUo0.jpg',
      getLink: () => '/news/hipaa-compliance-guide',
    },
    {
      id: 5,
      title: 'स्वास्थ्य मन्त्रालयले भन्यो- कोरोनाको नयाँ सब-भेरियन्टको जोखिम बढ्यो, सतर्कता अप्नाउनु',
      date: '2024-01-03',
      author: 'स्वास्थ्यखबर',
      description: 'स्वास्थ्य तथा जनसंख्या मन्त्रालयले कोभिड-१९ को नयाँ सब-भेरियन्ट जेएन.१ को  जोखिम बढेको भन्दै सतर्कता अपनाउन आग्रह गरेको छ। मन्त्रालयले बुधबार विज्ञप्ति जारी गर्दै नेपालमा अहिलेसम्म यो सब-भेरियन्ट पुष्टि नभएपनि छिमेकी देशहरुमा संक्रमण बढिरहेकाले सतर्कता अपनाउन ध्यानाकर्षण गराएको हो।',
      image: 'https://danphehealth.com/storage/uploads/TxGTJmHp4LKQTw9eJLomffxWju2Ra9AC37yjrZMu.jpg',
      getLink: () => '/news/hipaa-compliance-guide',
    },
  ];      

  return (
    <>
    <section className="bg-[#F9F9F9] py-10">
  <div className="container mx-auto md:p-12 p-10 pt-[150px] md:pt-[130px]">
  <h1 className="text-2xl lg:text-4xl text-center md:text-start font-bold mb-4">News & Events</h1>
    <p className="text-gray-600 mb-8 text-center md:text-start">Stay updated with the latest happenings and upcoming events from SmartCare HIMS!</p>

    <div className="grid gap-6 md:grid-cols-3">
      {/* Left content */}
      <div className="md:col-span-2">
        {newsEvents.map((event) => (
          <div key={event.id} className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="flex flex-col">
              <Image 
                src={event.image} 
                alt={event.title} 
                width={300} 
                height={200} 
                className="w-full h-48 md:h-auto object-cover" 
              />
              <div className="p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                <div className="flex justify-between items-center text-xs md:text-sm text-gray-500 mb-4">
                  <span>Posted on: {event.date}</span>
                  <span>Posted by: {event.author}</span>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <a href={event.getLink()} className="text-[#61a3f8] hover:text-customSecondary font-semibold">
                  Read More »
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

     {/* Right content */}
<div className="bg-white shadow-md rounded-lg p-6 md:h-[360px] lg:h-[320px] sticky top-[150px]">
  <div className="mb-6">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Search</h4>
    <input 
      type="text" 
      placeholder="Find Something..." 
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPrimary"
    />
  </div>
  <div>
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Categories</h4>
    <ul className="text-gray-600">
      <li className="flex justify-between items-center mb-2">
        <span>SmartCare Monthly Newsletter</span>
        <span className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-lg">0</span>
      </li>
      <li className="flex justify-between items-center mb-2">
        <span>General Updates on SmartCare Connect</span>
        <span className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-lg">0</span>
      </li>
      <li className="flex justify-between items-center">
        <span>Events News</span>
        <span className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-lg">0</span>
      </li>
    </ul>
  </div>
</div>
    </div>
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
  )
}

export default Page;
