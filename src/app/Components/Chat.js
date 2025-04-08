"use client";
import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, addDoc, serverTimestamp, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperclip, faPaperPlane, faVideo } from '@fortawesome/free-solid-svg-icons';
import VideoCallModal from './VideoCallModal';

export default function Chat({ appointmentId, currentUser, recipientUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!appointmentId) return;

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('appointmentId', '==', appointmentId));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }))
      .sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return a.timestamp - b.timestamp;
      });
      
      setMessages(newMessages);
      
      const unreadMessages = snapshot.docs.filter(doc => {
        const data = doc.data();
        return data.recipientId === currentUser.id && !data.read;
      });

      for (const unreadDoc of unreadMessages) {
        await updateDoc(doc(db, 'messages', unreadDoc.id), {
          read: true
        });
      }

      setError('');
      setLoading(false);
      scrollToBottom();
    }, (err) => {
      console.error('Real-time updates error:', err);
      setError('Failed to receive new messages');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [appointmentId, currentUser.id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file && !voiceMessage) return;

    setIsUploading(true);
    setError('');

    try {
      const messageData = {
        appointmentId,
        text: newMessage.trim(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderType: currentUser.type,
        recipientId: recipientUser.id,
        recipientName: recipientUser.name,
        timestamp: serverTimestamp(),
        read: false,
      };

      // Upload file if exists
      if (file) {
        try {
          const fileData = await uploadFile(file);
          messageData.file = {
            url: fileData.url,
            name: file.name,
            type: file.type,
            size: file.size
          };
        } catch (err) {
          console.error('Error uploading file:', err);
          setError('Failed to upload file');
          setIsUploading(false);
          return;
        }
      }

      // Upload voice message if exists
      if (voiceMessage) {
        try {
          const voiceData = await uploadVoice(voiceMessage);
          messageData.voiceMessage = {
            url: voiceData.url,
            duration: voiceData.duration
          };
        } catch (err) {
          console.error('Error uploading voice message:', err);
          setError('Failed to upload voice message');
          setIsUploading(false);
          return;
        }
      }

      // Add the message to Firestore
      await addDoc(collection(db, 'messages'), messageData);
      
      // Reset the form
      setNewMessage('');
      setFile(null);
      setVoiceMessage(null);
      setError('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording');
      return;
    }

    setIsRecording(true);
    audioChunksRef.current = [];
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setVoiceMessage(audioBlob);
          setIsRecording(false);
          
          // Stop all tracks in the stream
          stream.getTracks().forEach(track => track.stop());
        };
      })
      .catch(err => {
        console.error('Error accessing media devices.', err);
        setError('Failed to start recording');
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadFile = async (file) => {
    try {
      // Create a reference to the storage location
      const fileRef = ref(storage, `chat-files/${appointmentId}/${file.name}-${Date.now()}`);
      
      // Upload the file
      const snapshot = await uploadBytes(fileRef, file);
      
      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);
      
      return { url };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const uploadVoice = async (blob) => {
    try {
      // Create a reference to the storage location
      const voiceRef = ref(storage, `voice-messages/${appointmentId}/${Date.now()}.wav`);
      
      // Upload the blob
      const snapshot = await uploadBytes(voiceRef, blob);
      
      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);
      
      // Create a temporary audio element to get duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(blob);
      
      return new Promise((resolve) => {
        audio.onloadedmetadata = () => {
          const duration = Math.round(audio.duration);
          resolve({ url, duration });
        };
        // Fallback in case duration can't be determined
        setTimeout(() => resolve({ url, duration: 0 }), 1000);
      });
    } catch (error) {
      console.error('Error uploading voice message:', error);
      throw error;
    }
  };

  const handleVideoCall = () => {
    setVideoCallOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (e.g., 10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading messages...</div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{recipientUser.name.charAt(0).toUpperCase()}</div>
            <div>
              <h3 style={styles.headerText}>{recipientUser.name}</h3>
              <div style={styles.status}>Online</div>
            </div>
          </div>
          <div style={styles.headerActions}>
            <button onClick={handleVideoCall} style={styles.videoCallButton}>
              <FontAwesomeIcon icon={faVideo} style={styles.videoIcon} />
              <span style={styles.buttonText}>Video Call</span>
            </button>
          </div>
        </div>

        <div style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div style={styles.noMessages}>
              <div style={styles.noMessagesIcon}>💬</div>
              <div style={styles.noMessagesText}>No messages yet</div>
              <div style={styles.noMessagesSubtext}>Start the conversation with {recipientUser.name.split(' ')[0]}</div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: message.senderId === currentUser.id ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    ...styles.messageContent,
                    backgroundColor: message.senderId === currentUser.id ? '#2d3f50' : '#f0f2f5',
                    color: message.senderId === currentUser.id ? 'white' : '#333',
                    borderBottomRightRadius: message.senderId === currentUser.id ? 0 : 12,
                    borderBottomLeftRadius: message.senderId === currentUser.id ? 12 : 0,
                  }}
                >
                  {message.senderId !== currentUser.id && (
                    <div style={styles.messageSender}>{message.senderName}</div>
                  )}
                  {message.text && <div style={styles.messageText}>{message.text}</div>}
                  
                  {/* File Attachment */}
                  {message.file && (
                    <div style={styles.fileAttachment}>
                      <FontAwesomeIcon icon={faPaperclip} style={styles.fileIcon} />
                      <div style={styles.fileInfo}>
                        {message.file.type.startsWith('image/') ? (
                          <>
                            <img 
                              src={message.file.url} 
                              alt="Attachment" 
                              style={styles.fileImage}
                              onClick={() => window.open(message.file.url, '_blank')}
                            />
                            <a 
                              href={message.file.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={styles.fileLink}
                              download
                            >
                              Download Image
                            </a>
                          </>
                        ) : (
                          <>
                            <div style={styles.fileName}>{message.file.name}</div>
                            <div style={styles.fileSize}>{formatFileSize(message.file.size)}</div>
                            <a 
                              href={message.file.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={styles.fileLink}
                              download
                            >
                              Download File
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Voice Message */}
                  {message.voiceMessage && (
                    <div style={styles.voiceMessage}>
                      <div style={styles.voiceMessageHeader}>
                        <FontAwesomeIcon icon={faMicrophone} style={styles.voiceIcon} />
                        <span>Voice Message</span>
                      </div>
                      <audio controls style={styles.audioPlayer}>
                        <source src={message.voiceMessage.url} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                      {message.voiceMessage.duration > 0 && (
                        <div style={styles.voiceDuration}>
                          {message.voiceMessage.duration}s
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div style={styles.messageTime}>
                    {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.senderId === currentUser.id && (
                      <span style={styles.readStatus}>
                        {message.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={sendMessage} style={styles.inputArea}>
          {(file || voiceMessage) && (
            <div style={styles.attachmentPreview}>
              {file && (
                <div style={styles.previewItem}>
                  <div style={styles.previewInfo}>
                    <FontAwesomeIcon icon={faPaperclip} style={styles.previewIcon} />
                    <span style={styles.previewText}>{file.name}</span>
                    <span style={styles.previewSize}>{formatFileSize(file.size)}</span>
                  </div>
                  <button 
                    onClick={() => setFile(null)} 
                    style={styles.removeButton}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              )}
              {voiceMessage && (
                <div style={styles.previewItem}>
                  <div style={styles.previewInfo}>
                    <FontAwesomeIcon icon={faMicrophone} style={styles.previewIcon} />
                    <span style={styles.previewText}>Voice message</span>
                  </div>
                  <button 
                    onClick={() => setVoiceMessage(null)} 
                    style={styles.removeButton}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div style={styles.inputContainer}>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              style={styles.recordButton}
              disabled={isUploading}
            >
              <FontAwesomeIcon 
                icon={faMicrophone} 
                style={{
                  ...styles.recordIcon,
                  color: isRecording ? '#ff3b30' : '#666'
                }} 
              />
            </button>
            
            <label style={styles.attachButton}>
              <input
                type="file"
                onChange={handleFileChange}
                style={styles.fileInput}
                accept="*/*"
                disabled={isUploading}
              />
              <FontAwesomeIcon 
                icon={faPaperclip} 
                style={{
                  ...styles.attachIcon,
                  opacity: isUploading ? 0.5 : 1
                }} 
              />
            </label>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={styles.textInput}
              disabled={isUploading}
            />
            
            <button
              type="submit"
              style={styles.sendButton}
              disabled={(!newMessage.trim() && !file && !voiceMessage) || isUploading}
            >
              {isUploading ? (
                <div style={styles.spinner}></div>
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} style={styles.sendIcon} />
              )}
            </button>
          </div>
        </form>
      </div>

      {videoCallOpen && (
        <VideoCallModal
          isOpen={videoCallOpen}
          onClose={() => setVideoCallOpen(false)}
          currentUser={currentUser}
          recipientUser={recipientUser}
        />
      )}
    </>
  );
}

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: '700px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e9ecef',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4e8cff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '16px',
  },
  headerText: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  videoCallButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#f5f7fa',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#e9ecef',
    },
  },
  videoIcon: {
    color: '#4e8cff',
    fontSize: '16px',
  },
  buttonText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f8f9fa',
  },
  noMessages: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999',
  },
  noMessagesIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  noMessagesText: {
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: '4px',
  },
  noMessagesSubtext: {
    fontSize: '14px',
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '12px',
  },
  messageContent: {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
    position: 'relative',
    wordBreak: 'break-word',
  },
  messageSender: {
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '4px',
    color: '#555',
  },
  messageText: {
    fontSize: '14px',
    lineHeight: '1.4',
    margin: '4px 0',
  },
  fileAttachment: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: '8px',
    gap: '8px',
  },
  fileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fileIcon: {
    marginTop: '4px',
    color: 'inherit',
  },
  fileImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  fileName: {
    fontWeight: '500',
    fontSize: '14px',
  },
  fileSize: {
    fontSize: '12px',
    color: 'inherit',
    opacity: '0.7',
  },
  fileLink: {
    color: 'inherit',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  voiceMessage: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  voiceMessageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500',
  },
  voiceIcon: {
    fontSize: '14px',
  },
  audioPlayer: {
    width: '100%',
    height: '32px',
  },
  voiceDuration: {
    fontSize: '12px',
    color: 'inherit',
    opacity: '0.7',
    textAlign: 'right',
  },
  messageTime: {
    fontSize: '11px',
    color: 'inherit',
    opacity: '0.8',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '4px',
  },
  readStatus: {
    fontSize: '14px',
    marginLeft: '4px',
  },
  inputArea: {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e9ecef',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: '24px',
    padding: '8px 16px',
  },
  recordButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  recordIcon: {
    fontSize: '18px',
  },
  attachButton: {
    cursor: 'pointer',
    padding: '8px',
  },
  attachIcon: {
    fontSize: '18px',
    color: '#666',
  },
  fileInput: {
    display: 'none',
  },
  textInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    color: '#333',
  },
  sendButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.2s ease',
    '&:disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },
  sendIcon: {
    fontSize: '18px',
    color: '#4e8cff',
  },
  errorMessage: {
    color: '#ff3b30',
    fontSize: '14px',
    padding: '8px 16px',
    textAlign: 'center',
    backgroundColor: '#ffebee',
    margin: '0 16px',
    borderRadius: '8px',
  },
  attachmentPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  previewItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f7fa',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  previewInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  previewIcon: {
    fontSize: '14px',
    color: '#666',
  },
  previewText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '200px',
  },
  previewSize: {
    fontSize: '12px',
    color: '#666',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: '#ff3b30',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0 4px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingText: {
    fontSize: '16px',
    color: '#666',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(0,0,0,0.1)',
    borderLeftColor: '#4e8cff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
};