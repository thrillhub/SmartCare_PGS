"use client";
import React from "react";
import Link from "next/link"; 

function Page() {
  return (
    <>
      <section
        className="bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://danphehealth.com/frontend/img/coming-soon.jpg')",
          height: "100vh", 
        }}
      >
        <div className="container mx-auto md:p-8 p-4 pt-0 flex flex-col items-center justify-center text-center">
          <div className="space-y-4">
            <h1 className="text-2xl lg:text-5xl font-bold">
              <span className="text-customPrimary">We Will Be Live</span> <span className="text-[#195694]">Soon</span>
            </h1>
            <p className="font-semibold text-sm pb-2">
              Get notified when we launch.
            </p>
            <Link href="/">
              <button className="py-3 px-4 rounded-md bg-customDark text-white hover:bg-customSecondary items-center justify-center  transition-colors duration-500 ease-in-out">
                <i className="bi bi-arrow-left pr-2"></i>
                Go Back To Home
              </button>
            </Link>
            <div className="space-x-3 flex justify-center">
              <a href="" className="bg-blue-600 text-white p-2 rounded-full flex items-center justify-center w-10 h-10">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="" className="bg-blue-700 text-white p-2 rounded-full flex items-center justify-center w-10 h-10">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="" className="bg-red-600 text-white p-2 rounded-full flex items-center justify-center w-10 h-10">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="" className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white p-2 rounded-full flex items-center justify-center w-10 h-10">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Page;
