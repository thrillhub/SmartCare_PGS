"use client";
import React from 'react';

export default function UnreadBadge({ count }) {
  if (count === 0) return null;
  
  return (
    <div style={{
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      border: '2px solid white'
    }}>
      {count > 99 ? '99+' : count}
    </div>
  );
}