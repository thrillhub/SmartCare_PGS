"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../../app/Components/Uni.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const sidebarRef = useRef(null);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      isMenuOpen
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <section className="fixed top-0 left-0 w-full bg-customDark z-40">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-1 text-xs px-4 md:px-12">
          <div className="text-white mb-3 md:mb-0 hidden md:block">
            <ul className="flex flex-col md:flex-row gap-2 md:gap-6">
              <li>
                <a href="#" className="flex items-center">
                  <i className="bi bi-envelope px-2"></i>
                  info@danphehealth.com
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  <i className="bi bi-telephone px-2"></i>
                  +977 9869100966
                </a>
              </li>
            </ul>
          </div>

          <div className="text-white md:py-0 py-2">
            <ul className="flex flex-row md:gap-3 gap-6">
              <li className="border-2 border-solid border-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-customSecondary hover:border-transparent transition-colors duration-500 ease-in-out">
                <a href="#">
                  <i className="bi bi-facebook"></i>
                </a>
              </li>
              <li className="border-2 border-solid border-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-customSecondary hover:border-transparent transition-colors duration-500 ease-in-out">
                <a href="#">
                  <i className="bi bi-instagram"></i>
                </a>
              </li>

              <button className="border border-transparent p-1 rounded-md bg-white text-black hover:bg-customSecondary hover:text-white flex items-center justify-center text-center gap-2 transition-colors duration-500 ease-in-out">
                <i className="bi bi-people-fill"></i>
                Partners
              </button>

              <button className="border border-transparent p-1 rounded-md bg-white text-black hover:bg-customSecondary hover:text-white flex items-center justify-center text-center gap-2 transition-colors duration-500 ease-in-out">
                <i className="bi bi-telephone-inbound-fill"></i>
                Contact Us
              </button>
            </ul>
          </div>
        </div>
      </section>

      <section className="fixed md:top-[40px] top-[50px] left-0 w-full bg-white shadow-md z-30">
        <div className="container mx-auto md:py-1 py-3 md:px-12 px-8 flex justify-between items-center text-sm">
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/front.png" alt="Logo" width={180} height={0} />
          </Link>
          <div className="hidden md:flex flex-grow justify-end items-center gap-7">
            <ul className="flex gap-7 nav-item text-xs">
              {["/company", "/our-solution", "/our-clients", "/news-events", "/career", "/smart-community"].map((link) => (
                <li key={link}>
                  <Link
                    href={link}
                    className={`hover:text-customPrimary transition-colors duration-300 ease-in-out ${
                      activeLink === link ? "text-customSecondary font-semibold" : ""
                    }`}
                    onClick={() => handleLinkClick(link)}
                  >
                    {link.replace("/", "").replace("-", " ").toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>

              <Link
                href="/doctor-login"
                className="p-3 rounded-md bg-customDark text-white hover:bg-customSecondary text-xs transition-colors duration-500 ease-in-out"
              >
                Login as Doctor
              </Link>

              <Link
                href="/patient-login"
                className="p-3 rounded-md bg-customDark text-white hover:bg-customSecondary text-xs transition-colors duration-500 ease-in-out"
              >
                Login as Patient
              </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-customDark focus:outline-none text-2xl"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>

        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-500 py-[70px] ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col p-5 text-customDark">
            <div className="flex justify-between items-center border-b border-[#cccccc] pb-4">
              <h2 className="text-lg font-semibold">Danphe Health Menu</h2>
              <button
                onClick={toggleMenu}
                className="text-customDark focus:outline-none text-2xl"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <ul className="flex flex-col gap-3 mt-5">
              {[
                "/company",
                "/our-solution",
                "/our-clients",
                "/news-events",
                "/career",
                "/smart-community",
              ].map((link) => (
                <li
                  key={link}
                  className={`hover:text-customSecondary ${
                    activeLink === link ? "text-customSecondary font-semibold" : ""
                  }`}
                >
                  <Link href={link} onClick={() => handleLinkClick(link)}>
                    {link.replace("/", "").replace("-", " ").toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
            
              <Link
                href="/doctor-appointment"
                className="p-3 rounded-md bg-customDark text-white hover:bg-customSecondary text-xs transition-colors duration-500 ease-in-out"
              >
                <i className="bi bi-calendar2-minus-fill pr-2" />
                Make an Appointment
              </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Header;
