import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { field, value } = req.query;

    if (!field || !value) {
      return res.status(400).json({ 
        isUnique: false,
        error: "Field and value parameters are required" 
      });
    }

    // Validate field names
    const allowedFields = ['email', 'nmcNumber', 'citizenshipNumber'];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ 
        isUnique: false,
        error: "Invalid field parameter" 
      });
    }

    try {
      const doctorsRef = collection(db, "doctors");
      const q = query(doctorsRef, where(field, "==", value));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let errorMessage = '';
        switch (field) {
          case 'email':
            errorMessage = 'This email is already registered';
            break;
          case 'nmcNumber':
            errorMessage = 'This NMC number is already registered';
            break;
          case 'citizenshipNumber':
            errorMessage = 'This citizenship number is already registered';
            break;
        }
        
        return res.status(200).json({ 
          isUnique: false,
          error: errorMessage
        });
      }

      return res.status(200).json({ isUnique: true });
    } catch (error) {
      console.error(`Error checking ${field}:`, error);
      return res.status(500).json({ 
        isUnique: false,
        error: "Internal Server Error" 
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ 
      isUnique: false,
      error: `Method ${req.method} Not Allowed` 
    });
  }
}