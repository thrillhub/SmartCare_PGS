"use client";
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

function FloatingButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 100) {  
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-4 right-1">
          <button
            className="bg-customPrimary text-white md:p-[10px] p-[8px] rounded-full shadow-lg hover:bg-customDark focus:outline-none transition-all duration-500"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <FaArrowUp className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}

export default FloatingButton;
