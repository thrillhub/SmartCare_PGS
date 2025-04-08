import React from "react";

function Footer() {
  return (
    <section className="bg-[#212529] py-8">
      <div className="container mx-auto px-5 md:px-12">
        <div className="flex flex-wrap md:flex-nowrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg text-white mb-3">Site Menu</h3>
            <ul className="text-[#ffffff8a] text-sm space-y-2 foot">
              <li>
                <a href="#">Company</a>
              </li>
              <li>
                <a href="#">Our Client</a>
              </li>
              <li>
                <a href="#">Career</a>
              </li>
              <li>
                <a href="#">News & Events</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg text-white mb-3">HMIS with EMR Solutions</h3>
            <ul className="text-[#ffffff8a] text-sm space-y-2 foot">
              <li>
                <a href="#">Patient Management</a>
              </li>
              <li>
                <a href="#">Materials (goods) Management</a>
              </li>
              <li>
                <a href="#">Revenue Management</a>
              </li>
              <li>
                <a href="#">Hospital Employee Management (HR Management)</a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg text-white mb-3">Info</h3>
            <ul className="text-[#ffffff8a] text-sm space-y-2 foot">
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Term & Conditions</a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="text-lg text-white mb-3">Contact Us</h3>
            <ul className="text-[#ffffff8a] text-sm space-y-2 foot">
              <li>
                <a href="#">
                  Imark Digital Pvt. Ltd. Dillibazar, Kathmandu, Nepal
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-telephone-inbound pr-2"></i>+977 9852088004, 9802310817
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-envelope-at pr-2"></i>info@danphehealth.com
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-globe pr-2"></i>www.smartcare.com / www.smartcareconnect.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-white text-xs py-4 flex justify-between items-center border-t border-[#ffffff33] mt-8">
          <div className="md:w-0 w-1/2">
            <h4>Copyright 2024. All Rights Reserved.</h4>
          </div>
          <div>
            <ul className="flex gap-4 md:mr-4 mr-6">
              <li>
                <a href="#">
                  <i className="bi bi-facebook"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-linkedin"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-twitter"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
