// Mark this file as a Client Component
"use client"; 

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import 'bootstrap-icons/font/bootstrap-icons.css';
import FloatingButton from "./Components/FloatingButton";
import { usePathname } from 'next/navigation'; // Import usePathname hook

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current page path

  // Define an array of routes where header and footer should not be shown
  const noHeaderFooterPaths = ['/patient-login', '/patient-register', '/doctor-login', '/doctor-register', '/doctor-appointment',   '/chat-box', '/doctor-chat-box',  '/Patient-profile',  ];

  // Check if the current path is in the noHeaderFooterPaths array
  const showHeaderFooter = !noHeaderFooterPaths.includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        {showHeaderFooter && <Header />}
        {children}
        {showHeaderFooter && <FloatingButton />}
        {showHeaderFooter && <Footer />}
      </body>
    </html>
  );
}