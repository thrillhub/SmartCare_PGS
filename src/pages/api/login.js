import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      console.log("Request body:", req.body);

      const usersRef = collection(db, "users");

      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No user found with email:", email);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      console.log("User data retrieved:", userData);

      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        console.log("Invalid password attempt for email:", email);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}