import bcrypt from "bcryptjs";
import { collection, query, where, getDocs } from "firebase/firestore"; // Updated import
import { db } from "../../lib/firebaseConfig";


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Fetch the doctor document by email
      const doctorsRef = collection(db, "doctors");
      const q = query(doctorsRef, where("email", "==", email)); // Query by email
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const doctor = querySnapshot.docs[0].data(); // Get the first matching document
      console.log('Fetched Doctor Data:', doctor);

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      console.log('Password Valid:', isPasswordValid);

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Successful login
      res.status(200).json({
        message: "Login successful",
        redirectTo: `/doctor/${doctor.id}`, // Redirect to doctor profile page
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}