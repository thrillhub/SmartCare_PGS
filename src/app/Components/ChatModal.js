import React from 'react';

export default function ChatModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'opacity 0.3s ease-in-out',
    backdropFilter: 'blur(4px)',
    padding: '1rem', // add some breathing room around the modal
  };

  const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '42rem',
    maxHeight: '90vh', // this ensures it won't overflow vertically
    overflowY: 'auto',
    animation: 'fadeInScale 0.3s ease-in-out',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease-in-out, transform 0.2s ease-in-out',
  };

  const closeButtonHoverStyle = {
    color: '#111827',
    transform: 'scale(1.1)',
  };

  const contentStyle = {
    padding: '1.5rem',
    fontSize: '1rem',
    color: '#374151',
    lineHeight: 1.6,
    backgroundColor: '#ffffff',
  };

  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>💬 Chat with Us</h2>
          <button
            onClick={onClose}
            style={{
              ...closeButtonStyle,
              ...(isHovering ? closeButtonHoverStyle : {}),
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            aria-label="Close chat"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
}
