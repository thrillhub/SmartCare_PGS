import { db } from "../../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const { id } = req.query; // Extract ID from query

  if (req.method === "GET") {
    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    try {
      // Fetch doctor details from Firestore
      const docRef = doc(db, "doctors", id);
      const doctorDoc = await getDoc(docRef);

      if (!doctorDoc.exists()) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      const doctorData = doctorDoc.data();
      res.status(200).json(doctorData);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}