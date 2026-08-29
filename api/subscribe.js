export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { name, email, interests } = req.body || {};

      if (!email || !email.includes('@')) {
        return res.status(400).json({
          success: false,
          error: 'A valid email address is required.',
        });
      }

      console.log(`[Vercel Serverless] VIP Subscriber registered: ${email} (${name || 'Anonymous'})`);

      return res.status(200).json({
        success: true,
        message: 'Successfully registered for 24OURS pre-launch VIP updates.',
        data: {
          name: name?.trim() || 'Racer',
          email: email.trim().toLowerCase(),
          interests: Array.isArray(interests) ? interests : [],
          registeredAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to process subscription request.',
      });
    }
  }

  return res.status(200).json({
    status: 'VIP Subscription Endpoint Active',
  });
}
