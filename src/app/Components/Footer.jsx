import React from "react";
import Link from "next/link";


function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#212529] py-8 text-sm">
      <div className="container mx-auto px-5 md:px-12">
        {/* Main Footer Content */}
        <div className="flex flex-wrap md:flex-nowrap justify-between gap-8">
          {/* Site Menu */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg text-white mb-4 font-medium">Site Menu</h3>
            <ul className="text-[#ffffff8a] space-y-3">
              {['Company', 'Our Client', 'Career', 'News & Events', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors duration-200 block"
                    aria-label={`Navigate to ${item}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* HMIS Solutions */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg text-white mb-4 font-medium">HMIS with EMR Solutions</h3>
            <ul className="text-[#ffffff8a] space-y-3">
              {[
                'Patient Management',
                'Materials (goods) Management',
                'Revenue Management',
                'Hospital Employee Management (HR Management)'
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors duration-200 block"
                    aria-label={`Learn more about ${item}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg text-white mb-4 font-medium">Info</h3>
            <ul className="text-[#ffffff8a] space-y-3">
              <li>
                <a 
                  href="#" 
                  className="hover:text-white transition-colors duration-200 block"
                  aria-label="View FAQs"
                >
                  FAQs
                </a>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="hover:text-white transition-colors duration-200 block"
                  aria-label="View Terms & Conditions"
                >
                  Privacy & Policy
                </Link>
              </li>
              <li>
              <Link 
                  href="/terms-condition" 
                  className="hover:text-white transition-colors duration-200 block"
                  aria-label="View Terms & Conditions"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg text-white mb-4 font-medium">Contact Us</h3>
            <address className="not-italic text-[#ffffff8a] space-y-3">
              <p className="hover:text-white transition-colors duration-200">
                SmartCare Connects Pvt. Ltd.<br />
                Baneshwor, Kathmandu, Nepal
              </p>
              <p>
                <a 
                  href="tel:+9779852088004" 
                  className="hover:text-white transition-colors duration-200 flex items-start"
                  aria-label="Call us at +977 9852088004"
                >
                  <i className="bi bi-telephone-inbound pr-2 pt-1"></i>
                  <span>+977 9869100969, 9815253061</span>
                </a>
              </p>
              <p>
                <a 
                  href="mailto:info@smartcareconnects.com" 
                  className="hover:text-white transition-colors duration-200 flex items-start"
                  aria-label="Email us at info@smartcareconnects.com"
                >
                  <i className="bi bi-envelope-at pr-2 pt-1"></i>
                  <span>info@smartcareconnects.com</span>
                </a>
              </p>
              <p>
                <a 
                  href="https://www.smartcare.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200 flex items-start"
                  aria-label="Visit our website"
                >
                  <i className="bi bi-globe pr-2 pt-1"></i>
                  <span>www.smartcare.com / www.smartcareconnect.com</span>
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-white py-6 flex flex-col md:flex-row justify-between items-center border-t border-[#ffffff33] mt-8">
          <p className="mb-4 md:mb-0">
            Copyright © {currentYear}. All Rights Reserved.
          </p>
          
          <div className="social-links">
            <ul className="flex gap-6">
              {[
                {icon: 'bi-facebook', label: 'Facebook'},
                {icon: 'bi-instagram', label: 'Instagram'},
                {icon: 'bi-linkedin', label: 'LinkedIn'},
                {icon: 'bi-twitter', label: 'Twitter'}
              ].map((social) => (
                <li key={social.label}>
                  <a 
                    href="#" 
                    className="text-xl hover:text-white text-[#ffffff8a] transition-colors duration-200"
                    aria-label={`Visit our ${social.label} page`}
                  >
                    <i className={`bi ${social.icon}`}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;