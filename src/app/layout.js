// src/app/layout.js (Server component)
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ClientLayout from "./ClientLayout"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Smart Care Connects",
  description: "Your Website Description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}