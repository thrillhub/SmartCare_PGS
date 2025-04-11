// src/app/ClientLayout.js
"use client";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import FloatingButton from "./Components/FloatingButton";
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
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
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <FloatingButton />}
      {showHeaderFooter && <Footer />}
    </>
  );
}