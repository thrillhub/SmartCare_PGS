import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";


export default async function handler(req, res) {
  if (req.method === "GET") {
    const { nmcNumber } = req.query;

    if (!nmcNumber) {
      return res.status(400).json({ error: "NMC number is required" });
    }

    try {
      const doctorsRef = collection(db, "doctors");
      const q = query(doctorsRef, where("nmc_number", "==", nmcNumber));
      const querySnapshot = await getDocs(q);

      return res.status(200).json({ isUnique: querySnapshot.empty });
    } catch (error) {
      console.error("Error checking NMC number:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}