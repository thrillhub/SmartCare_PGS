import React, { useEffect, useRef, useState } from "react";
import { createLocalVideoTrack, createLocalAudioTrack, connect } from "twilio-video";
import { FiMic, FiMicOff, FiPhoneOff, FiVideo, FiVideoOff } from "react-icons/fi";

// Enhanced token caching with expiration
const tokenCache = {
  _cache: {},
  get(key) {
    const item = this._cache[key];
    if (item && Date.now() < item.expires) {
      return item.token;
    }
    return null;
  },
  set(key, token, ttl = 3600000) { // 1 hour TTL
    this._cache[key] = { token, expires: Date.now() + ttl };
  },
  clear() {
    this._cache = {};
  }
};

const VideoCallModal = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  recipientUser, 
  appointmentId 
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoContainerRef = useRef(null);
  const roomRef = useRef(null);
  const localTracksRef = useRef([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Enhanced token fetching with better error handling
  const getToken = async () => {
    const cacheKey = `${currentUser.id}-${recipientUser.id}-${appointmentId}`;
    const cachedToken = tokenCache.get(cacheKey);
    
    if (cachedToken) {
      return cachedToken;
    }

    try {
      setStatus("Fetching token...");
      const response = await fetch(
        `/api/twilio/token?identity=${encodeURIComponent(currentUser.id)}&appointmentId=${encodeURIComponent(appointmentId)}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Token request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      
      if (!data.token) {
        throw new Error("Invalid token received");
      }

      tokenCache.set(cacheKey, data.token);
      return data.token;
    } catch (error) {
      console.error("Token request failed:", error);
      setError(`Failed to get access token: ${error.message}`);
      throw error;
    }
  };

  // Enhanced room connection with better state management
  const connectToRoom = async (token) => {
    try {
      setStatus("Connecting...");
      setError(null);
      
      // Cleanup any existing connections
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
      
      cleanupLocalTracks();

      // Create local tracks
      const videoTrack = await createLocalVideoTrack({
        width: 640,
        height: 480,
        frameRate: 24
      }).catch(err => {
        console.warn("Failed to create video track:", err);
        return null;
      });

      const audioTrack = await createLocalAudioTrack().catch(err => {
        console.warn("Failed to create audio track:", err);
        return null;
      });

      const tracks = [videoTrack, audioTrack].filter(Boolean);
      localTracksRef.current = tracks;

      // Attach local video if available
      if (videoTrack && localVideoRef.current) {
        localVideoRef.current.innerHTML = "";
        localVideoRef.current.appendChild(videoTrack.attach());
      }

      // Connect to room
      const room = await connect(token, {
        name: `appointment-${appointmentId}`,
        tracks,
        bandwidthProfile: {
          video: {
            mode: "collaboration",
            dominantSpeakerPriority: "standard",
            renderDimensions: {
              high: { width: 1280, height: 720 },
              standard: { width: 640, height: 480 },
              low: { width: 320, height: 240 }
            }
          }
        },
        dominantSpeaker: true,
        networkQuality: { local: 1, remote: 1 }
      });

      roomRef.current = room;
      setStatus("Connected");

      // Handle participants
      room.participants.forEach(participantConnected);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.on("disconnected", handleRoomDisconnect);

    } catch (error) {
      console.error("Connection failed:", error);
      setStatus("Connection failed");
      setError(error.message);
      throw error;
    }
  };

  // Participant management
  const participantConnected = (participant) => {
    setStatus(`${participant.identity} joined`);
    
    participant.tracks.forEach(track => {
      if (track.track) {
        trackPublished(track, participant);
      }
    });

    participant.on("trackPublished", track => trackPublished(track, participant));
  };

  const trackPublished = (publication, participant) => {
    if (publication.isSubscribed) {
      trackSubscribed(publication.track, participant);
    }
    
    publication.on("subscribed", track => trackSubscribed(track, participant));
    publication.on("unsubscribed", trackUnsubscribed);
  };

  const trackSubscribed = (track, participant) => {
    if (!remoteVideoContainerRef.current) return;
    
    const element = track.attach();
    element.style.width = "100%";
    element.style.height = "100%";
    element.style.objectFit = "cover";
    
    const container = document.createElement("div");
    container.id = `participant-${participant.sid}`;
    container.style.width = "100%";
    container.style.height = "100%";
    container.appendChild(element);
    
    remoteVideoContainerRef.current.innerHTML = "";
    remoteVideoContainerRef.current.appendChild(container);
  };

  const trackUnsubscribed = (track) => {
    track.detach().forEach(element => element.remove());
  };

  const participantDisconnected = (participant) => {
    setStatus(`${participant.identity} left`);
    if (remoteVideoContainerRef.current) {
      const element = document.getElementById(`participant-${participant.sid}`);
      if (element) element.remove();
    }
  };

  const handleRoomDisconnect = () => {
    setStatus("Disconnected");
    cleanup();
  };

  const cleanup = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    
    cleanupLocalTracks();
    
    if (localVideoRef.current) {
      localVideoRef.current.innerHTML = "";
    }
    
    if (remoteVideoContainerRef.current) {
      remoteVideoContainerRef.current.innerHTML = "";
    }
  };

  const cleanupLocalTracks = () => {
    localTracksRef.current.forEach(track => {
      track.stop();
      track.detach().forEach(element => element.remove());
    });
    localTracksRef.current = [];
  };

  // Control functions
  const toggleMute = () => {
    localTracksRef.current.forEach(track => {
      if (track.kind === "audio") {
        track.isEnabled ? track.disable() : track.enable();
      }
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localTracksRef.current.forEach(track => {
      if (track.kind === "video") {
        track.isEnabled ? track.disable() : track.enable();
      }
    });
    setIsVideoOff(!isVideoOff);
  };

  const endCall = () => {
    cleanup();
    onClose();
  };

  // Effect for managing connection
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    let isMounted = true;

    const setupCall = async () => {
      try {
        const token = await getToken();
        if (isMounted) await connectToRoom(token);
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setTimeout(() => setRetryCount(c => c + 1), 5000);
        }
      }
    };

    setupCall();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [isOpen, retryCount]);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.header}>
          <h2>Call with {recipientUser?.name || "Participant"}</h2>
          <div style={styles.status}>
            {status}
            {error && <div style={styles.error}>{error}</div>}
          </div>
        </div>

        <div style={styles.videoContainer}>
          <div ref={remoteVideoContainerRef} style={styles.remoteVideo}>
            {status === "Connected" ? "Waiting for video..." : status}
          </div>
          
          <div ref={localVideoRef} style={{
            ...styles.localVideo,
            backgroundColor: isVideoOff ? "#333" : "#222"
          }}>
            {isVideoOff ? "Your camera is off" : "Your camera"}
          </div>
        </div>

        <div style={styles.controls}>
          <button 
            onClick={toggleMute}
            style={{
              ...styles.controlButton,
              backgroundColor: isMuted ? "#ff4d4d" : "#444"
            }}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
          </button>

          <button 
            onClick={toggleVideo}
            style={{
              ...styles.controlButton,
              backgroundColor: isVideoOff ? "#ff4d4d" : "#444"
            }}
            aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
          >
            {isVideoOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
          </button>

          <button 
            onClick={endCall}
            style={{
              ...styles.controlButton,
              backgroundColor: "#ff4d4d"
            }}
            aria-label="End call"
          >
            <FiPhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modalContent: {
    width: "90%",
    maxWidth: "1000px",
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    padding: "20px",
    color: "white"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  status: {
    fontSize: "14px",
    color: "#aaa"
  },
  error: {
    color: "#ff6b6b",
    fontSize: "13px",
    marginTop: "5px"
  },
  videoContainer: {
    display: "flex",
    position: "relative",
    height: "60vh",
    marginBottom: "20px",
    gap: "20px"
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "#aaa"
  },
  localVideo: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    width: "25%",
    height: "30%",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "#aaa",
    minWidth: "200px",
    minHeight: "150px"
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },
  controlButton: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    transition: "all 0.2s"
  }
};

export default VideoCallModal;