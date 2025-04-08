import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      address,
      phoneNumber,
      email,
      age,
      gender,
      selectedDoctor,
      selectedDisease,
      appointmentDate,
      appointmentTime,
      message,
    } = req.body

    if (!firstName || !lastName || !address || !phoneNumber || !email || !age || !gender || !selectedDoctor || !selectedDisease || !appointmentDate || !appointmentTime || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const id = uuidv4();
      const newAppointment = {
        id,
        first_name: firstName,
        last_name: lastName,
        address,
        phone_number: phoneNumber,
        email,
        age,
        gender,
        selected_doctor: selectedDoctor,
        selected_disease: selectedDisease,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        message,
        expirationDate: new Date(`${appointmentDate} ${appointmentTime}`),
        created_at: new Date().toISOString(),
      };

      const appointmentsRef = collection(db, "appoinments"); // Correct Firestore collection name
      await setDoc(doc(appointmentsRef, id), newAppointment);

      res.status(201).json({ message: "Appointment booked successfully" });
    } catch (error) {
      console.error("Error booking appointment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}