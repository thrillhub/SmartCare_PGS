import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";


export default async function handler(req, res) {
  if (req.method === "GET") {
    const { doctorId } = req.query; // Get doctorId from the query parameters

    try {
      const appointmentsRef = collection(db, "appoinments");
      const q = query(appointmentsRef, where("doctorId", "==", doctorId)); // Filter by doctorId
      const snapshot = await getDocs(q);
      const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}