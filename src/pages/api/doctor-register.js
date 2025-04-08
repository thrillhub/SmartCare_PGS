import bcrypt from "bcryptjs";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      fullName,
      address,
      email,
      phoneNumber,
      nmcNumber,
      citizenshipNumber,
      speciality,
      password,
    } = req.body;

    if (
      !fullName ||
      !address ||
      !email ||
      !phoneNumber ||
      !nmcNumber ||
      !citizenshipNumber ||
      !speciality ||
      !password
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      const id = uuidv4();
      const newDoctor = {
        id,
        full_name: fullName, // Changed from fullName to full_name
        address,
        email,
        phone_number: phoneNumber, // Changed from phoneNumber to phone_number
        nmc_number: nmcNumber, // Changed from nmcNumber to nmc_number
        citizenship_number: citizenshipNumber, // Changed from citizenshipNumber to citizenship_number
        speciality,
        password: hashedPassword, // Save the hashed password
        created_at: new Date().toISOString(),
      };

      const doctorsRef = collection(db, "doctors");
      await setDoc(doc(doctorsRef, id), newDoctor);

      res.status(201).json({ message: "Doctor registered successfully" });
    } catch (error) {
      console.error("Error registering doctor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}