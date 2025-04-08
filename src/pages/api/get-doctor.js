import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";


export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    try {
      const docRef = doc(db, "doctors", id);
      const doctorDoc = await getDoc(docRef);

      if (!doctorDoc.exists()) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      res.status(200).json(doctorDoc.data());
    } catch (error) {
      console.error("Error fetching doctor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}