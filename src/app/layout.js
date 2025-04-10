"use client";
import React from "react"; // Add this import
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
    '/Patient-profile'
  ];
  const showHeaderFooter = !noHeaderFooterPaths.includes(pathname);

  return (
    <html lang="en">
      <body className="inter-font">
        {showHeaderFooter && <Header />}
        {children}
        {showHeaderFooter && <FloatingButton />}
        {showHeaderFooter && <Footer />}
      </body>
    </html>
  );
}