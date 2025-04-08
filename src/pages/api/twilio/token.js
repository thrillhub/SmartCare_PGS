import twilio from 'twilio';
const rateLimits = new Map();
export default async function handler(req, res) {
  const { identity, appointmentId } = req.query;

  if (!identity || typeof identity !== 'string' || !appointmentId) {
    return res.status(400).json({ error: "Valid identity and appointmentId are required" });
  }

  const userKey = identity.split('-')[0];
  const now = Date.now();
  const window = 60 * 1000;

  if (!rateLimits.has(userKey)) {
    rateLimits.set(userKey, []);
  }

  const requests = rateLimits.get(userKey).filter(timestamp => now - timestamp < window);

  if (requests.length >= 5) {
    res.setHeader('Retry-After', 60);
    return res.status(429).json({ 
      error: "Too many requests. Please wait a minute before trying again.",
      retryAfter: 60
    });
  }

  rateLimits.set(userKey, [...requests, now]);

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
      room: `room-${appointmentId}`
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