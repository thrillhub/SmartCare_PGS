import bcrypt from "bcryptjs";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      const id = uuidv4();
      const newUser = {
        id,
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword, // Save the hashed password
      };

      const usersRef = collection(db, "users");
      await setDoc(doc(usersRef, id), newUser);

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}