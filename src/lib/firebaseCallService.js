import { db } from "./firebaseConfig";
import { doc, setDoc, onSnapshot, deleteDoc, collection, query, where } from "firebase/firestore";

export const initiateCall = async (appointmentId, caller, recipient) => {
  const callRef = doc(db, "calls", appointmentId);
  await setDoc(callRef, {
    appointmentId,
    caller: { id: caller.id, name: caller.name, email: caller.email },
    recipient: { id: recipient.id, name: recipient.name, email: recipient.email },
    status: "ringing",
    timestamp: Date.now(),
  });
};

export const listenForCalls = (userId, callback) => {
  const callsRef = collection(db, "calls");
  const q = query(callsRef, where("recipient.id", "==", userId));

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        callback(change.doc.data());
      }
    });
  });
};

export const endCall = async (appointmentId) => {
  const callRef = doc(db, "calls", appointmentId);
  await deleteDoc(callRef);
};