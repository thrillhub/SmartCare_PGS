import twilio from 'twilio';

export default async function handler(req, res) {
  const { identity, appointmentId } = req.query;

  if (!identity || !appointmentId) {
    return res.status(400).json({ error: "Identity and appointmentId are required" });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;

  if (!accountSid || !apiKey || !apiSecret) {
    return res.status(500).json({ error: "Twilio credentials not configured" });
  }

  try {
    const token = new twilio.jwt.AccessToken(
      accountSid,
      apiKey,
      apiSecret,
      { identity, ttl: 3600 }
    );

    const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
      room: `appointment-${appointmentId}`
    });
    token.addGrant(videoGrant);

    res.status(200).json({ 
      token: token.toJwt(),
      identity,
      expiresAt: Math.floor(Date.now() / 1000) + 3600
    });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
}