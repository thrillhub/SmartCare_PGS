"use client";
import React from "react";
import Image from "next/image";

const logos = [
  {
    id: 1,
    category: "Medical College",
    name: "Manipal College of Medical Sciences",
    location: "Pokhara, Nepal",
    logoUrl: "/images/company-one.jpg",
  },
  {
    id: 2,
    category: "Tertiary Hospital",
    name: "Tilganga Institute of Ophthalmology",
    location: "Kathmandu, Nepal",
    logoUrl: "/images/company-two.png",
  },
  {
    id: 3,
    category: "Health Centre",
    name: "Budhanilkantha",
    location: "Kathmandu, Nepal",
    logoUrl: "/images/budanilkantha.jpg",
  },
  {
    id: 4,
    category: "Multispeciality",
    name: "Siddarthanagar City Hospital",
    location: "Lumbini, Nepal",
    logoUrl: "/images/company-four.png",
  },
  {
    id: 5,
    category: "Multispeciality",
    name: "Charak Memorial Hospital",
    location: "Pokhara, Nepal",
    logoUrl: "/images/charak.png",
  },
  {
    id: 6,
    category: "Diagnostic Centre",
    name: "Fishtail Hospital",
    location: "Pokhara, Nepal",
    logoUrl: "/images/company-six.jpeg",
  },
  {
    id: 7,
    category: "Multispeciality",
    name: "Manakamana Hospital",
    location: "Bharatpur, Nepal",
    logoUrl: "/images/company-seven.png",
  },
  {
    id: 8,
    category: "Multispeciality",
    name: "Maya Metro Hospital Pvt.Ltd",
    location: "Dhangadhi, Nepal",
    logoUrl: "/images/company-eight.png",
  },
  {
    id: 9,
    category: "Multispeciality",
    name: "Neuro Cardio Hospital",
    location: "Biratnagar, Nepal",
    logoUrl: "/images/company-nine.png",
  },
  {
    id: 10,
    category: "Multispeciality",
    name: "ManMohan Hospital",
    location: "Kathmandu, Nepal",
    logoUrl: "/images/company-ten.jpeg",
  },
  {
    id: 11,
    category: "Tertiary (Provincial)",
    name: "Lumbini Province Hospital",
    location: "Lumbini, Nepal",
    logoUrl: "/images/company-eleven.png",
  },
  {
    id: 12,
    category: "Multispeciality",
    name: "S.G.M.P.G. Ayurvedic Medical College & Hospital",
    location: "Awakarpur, India",
    logoUrl: "/images/company-twelve.png",
  },
];

function page() {
  return (
    <>
      <section className="md:p-12 p-6 pt-[175px] md:pt-[150px]">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-1">
          {logos.map((logo) => (
            <a href="" key={logo.id}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:h-[250px] h-[300px]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-white bg-customPrimary px-2 py-1 rounded">
                    {logo.category}
                  </span>
                </div>
                <Image
                  src={logo.logoUrl}
                  alt={`${logo.name} logo`}
                  className="mx-auto"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
                <h3 className="text-base font-semibold text-center">{logo.name}</h3>
                <p className="text-gray-500 text-center mt-2">{logo.location}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

export default page;