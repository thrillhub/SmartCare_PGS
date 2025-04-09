import React, { useEffect, useRef, useState } from "react";
import {
  createLocalVideoTrack,
  createLocalAudioTrack,
  connect,
} from "twilio-video";
import {
  FiMic,
  FiMicOff,
  FiPhoneOff,
  FiVideo,
  FiVideoOff,
} from "react-icons/fi";

const VideoCallModal = ({ isOpen, onClose, currentUser, recipientUser, appointmentId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const getToken = async () => {
    try {
      setStatus("Fetching token...");
      const response = await fetch(
        `/api/twilio/token?identity=${encodeURIComponent(currentUser.id)}&appointmentId=${encodeURIComponent(appointmentId)}`
      );

      if (!response.ok) throw new Error(`Token request failed: ${response.status}`);

      const data = await response.json();
      return data.token;
    } catch (err) {
      setError(`Failed to get access token: ${err.message}`);
      throw err;
    }
  };

  const connectToRoom = async (token) => {
    try {
      setStatus("Connecting...");
      setError(null);

      // Clean up any existing connection
      if (room) {
        room.disconnect();
        setRoom(null);
      }

      // Create new local tracks
      const tracks = await Promise.all([
        !isVideoOff ? createLocalVideoTrack().catch(() => null) : null,
        !isMuted ? createLocalAudioTrack().catch(() => null) : null,
      ]).then(tracks => tracks.filter(Boolean));

      setLocalTracks(tracks);

      // Attach local video if available
      const localVideoTrack = tracks.find(t => t.kind === "video");
      if (localVideoTrack && localVideoRef.current) {
        localVideoRef.current.innerHTML = '';
        const localElement = localVideoTrack.attach();
        localElement.style.width = "100%";
        localElement.style.height = "100%";
        localVideoRef.current.appendChild(localElement);
      }

      const newRoom = await connect(token, {
        name: `appointment-${appointmentId}`,
        tracks,
        dominantSpeaker: true,
        networkQuality: { local: 1, remote: 1 },
        audio: { autoGainControl: true, echoCancellation: true, noiseSuppression: true }
      });

      setRoom(newRoom);
      setStatus("Connected");

      // Handle remote participants
      newRoom.participants.forEach(participantConnected);
      newRoom.on("participantConnected", participantConnected);
      newRoom.on("participantDisconnected", participantDisconnected);
      newRoom.once("disconnected", () => {
        cleanup();
        setStatus("Disconnected");
      });
    } catch (err) {
      console.error("Error connecting to room:", err);
      setError(err.message || "Failed to connect to video room");
      setStatus("Connection failed");
      cleanup();
    }
  };

  const participantConnected = (participant) => {
    setStatus(`${participant.identity} joined`);

    participant.tracks.forEach(publication => {
      if (publication.track) {
        trackSubscribed(publication.track);
      }
      publication.on('subscribed', trackSubscribed);
      publication.on('unsubscribed', trackUnsubscribed);
    });

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);
  };

  const participantDisconnected = (participant) => {
    setStatus(`${participant.identity} left`);
    setRemoteTracks([]);
    if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = '';
    if (remoteAudioRef.current) remoteAudioRef.current.innerHTML = '';
  };

  const trackSubscribed = (track) => {
    setRemoteTracks(prev => [...prev, track]);
    
    if (track.kind === 'video' && remoteVideoRef.current) {
      remoteVideoRef.current.innerHTML = '';
      const element = track.attach();
      element.style.width = "100%";
      element.style.height = "100%";
      remoteVideoRef.current.appendChild(element);
    } else if (track.kind === 'audio') {
      // Create a dedicated audio element for remote audio
      if (!remoteAudioRef.current) {
        remoteAudioRef.current = document.createElement('audio');
        remoteAudioRef.current.autoplay = true;
        document.body.appendChild(remoteAudioRef.current);
      }
      track.attach(remoteAudioRef.current);
    }
  };

  const trackUnsubscribed = (track) => {
    track.detach().forEach(el => el.remove());
    setRemoteTracks(prev => prev.filter(t => t !== track));
    
    if (track.kind === 'audio' && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
  };

  const cleanup = () => {
    // Clean up remote tracks
    remoteTracks.forEach(track => {
      track.detach().forEach(el => el.remove());
    });
    setRemoteTracks([]);

    // Clean up local tracks
    localTracks.forEach(track => {
      if (track.stop) track.stop();
      track.detach().forEach(el => el.remove());
    });
    setLocalTracks([]);

    // Clean up audio element
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current.remove();
      remoteAudioRef.current = null;
    }

    // Disconnect from room
    if (room) {
      room.disconnect();
      setRoom(null);
    }

    // Clear video elements
    if (localVideoRef.current) localVideoRef.current.innerHTML = "";
    if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = "";
  };

  const toggleMute = async () => {
    const audioTrack = localTracks.find(t => t.kind === "audio");
    
    if (audioTrack) {
      // If we have an existing audio track, toggle it
      if (audioTrack.isEnabled) {
        audioTrack.disable();
        setIsMuted(true);
      } else {
        audioTrack.enable();
        setIsMuted(false);
      }
    } else {
      // If no audio track exists (or was muted during initialization), create one
      try {
        const newAudioTrack = await createLocalAudioTrack();
        setLocalTracks(prev => [...prev.filter(t => t.kind !== "audio"), newAudioTrack]);
        
        if (room) {
          room.localParticipant.publishTrack(newAudioTrack);
        }
        
        setIsMuted(false);
      } catch (err) {
        console.error("Error creating audio track:", err);
        setError("Failed to unmute microphone");
      }
    }
  };

  const toggleVideo = async () => {
    const videoTrack = localTracks.find(t => t.kind === "video");
    
    if (videoTrack) {
      // If we have an existing video track, toggle it
      if (videoTrack.isEnabled) {
        videoTrack.disable();
        setIsVideoOff(true);
      } else {
        videoTrack.enable();
        setIsVideoOff(false);
      }
    } else {
      // If no video track exists, create one
      try {
        const newVideoTrack = await createLocalVideoTrack();
        setLocalTracks(prev => [...prev.filter(t => t.kind !== "video"), newVideoTrack]);
        
        if (room) {
          room.localParticipant.publishTrack(newVideoTrack);
        }
        
        // Attach to local video element
        if (localVideoRef.current) {
          localVideoRef.current.innerHTML = '';
          const element = newVideoTrack.attach();
          element.style.width = "100%";
          element.style.height = "100%";
          localVideoRef.current.appendChild(element);
        }
        
        setIsVideoOff(false);
      } catch (err) {
        console.error("Error creating video track:", err);
        setError("Failed to enable camera");
      }
    }
  };

  const endCall = () => {
    cleanup();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    let mounted = true;
    const setupCall = async () => {
      try {
        const token = await getToken();
        if (mounted) await connectToRoom(token);
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setTimeout(() => setRetryCount(r => r + 1), 5000);
        }
      }
    };

    setupCall();

    return () => {
      mounted = false;
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
          <div ref={remoteVideoRef} style={styles.remoteVideo}>
            {status === "Connected" && !remoteTracks.some(t => t.kind === 'video')
              ? "Waiting for participant to enable video..."
              : status}
          </div>

          <div
            ref={localVideoRef}
            style={{
              ...styles.localVideo,
              backgroundColor: isVideoOff ? "#333" : "#222",
              display: isVideoOff ? 'flex' : 'block',
            }}
          >
            {isVideoOff && "Your camera is off"}
          </div>
        </div>

        <div style={styles.controls}>
          <button
            onClick={toggleMute}
            style={{
              ...styles.controlButton,
              backgroundColor: isMuted ? "#ff4d4d" : "#444",
            }}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
          </button>

          <button
            onClick={toggleVideo}
            style={{
              ...styles.controlButton,
              backgroundColor: isVideoOff ? "#ff4d4d" : "#444",
            }}
            aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
          >
            {isVideoOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
          </button>

          <button
            onClick={endCall}
            style={{ ...styles.controlButton, backgroundColor: "#ff4d4d" }}
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
    zIndex: 1000,
  },
  modalContent: {
    width: "90%",
    maxWidth: "1000px",
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    padding: "20px",
    color: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  status: {
    fontSize: "14px",
    color: "#aaa",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "13px",
    marginTop: "5px",
  },
  videoContainer: {
    display: "flex",
    position: "relative",
    height: "60vh",
    marginBottom: "20px",
    gap: "20px",
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "#aaa",
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
    minHeight: "150px",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
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
    transition: "all 0.2s",
  },
};

export default VideoCallModal;