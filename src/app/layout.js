"use client"; 

import React from "react"; 
import "./globals.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import 'bootstrap-icons/font/bootstrap-icons.css';
import FloatingButton from "./Components/FloatingButton";
import { usePathname } from 'next/navigation'; 

export default function RootLayout({ children }) {
  const pathname = usePathname(); 


  const noHeaderFooterPaths = [
    '/patient-login',
    '/patient-register',
    '/doctor-login',
    '/doctor-register',
    '/doctor-appointment',
    '/chat-box',
    '/doctor-chat-box',
    '/Patient-profile',
  ];

  const showHeaderFooter = !noHeaderFooterPaths.includes(pathname);

  return (
    <html lang="en">
      <head>
        <title>Smart Care Connects</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-inter">
        {showHeaderFooter && <Header />}
        {children}
        {showHeaderFooter && <FloatingButton />}
        {showHeaderFooter && <Footer />}
      </body>
    </html>
  );
}
