"use client";
import React from 'react';

const CallNotification = ({ onAccept, onDecline, recipientName }) => {
  return (
    <div style={styles.callNotificationContainer}>
      <div style={styles.callNotification}>
        <p>{recipientName} is calling...</p>
        <div style={styles.callButtons}>
          <button onClick={onAccept} style={styles.acceptButton}>Accept</button>
          <button onClick={onDecline} style={styles.declineButton}>Decline</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  callNotificationContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
  },
  callNotification: {
    backgroundColor: '#38a169',
    padding: '10px 20px',
    borderRadius: '10px',
    color: 'white',
    textAlign: 'center',
  },
  callButtons: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    marginRight: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  declineButton: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default CallNotification;