import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../../../lib/firebaseConfig";


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { appointmentId } = req.query;

  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('appointmentId', '==', appointmentId));
    const snapshot = await getDocs(q);
    
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}