import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/subscribers.json');

const router = Router();

// Ensure storage directory and data file exist
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

// POST /api/subscribe - Record new VIP pre-launch follower
router.post('/', (req, res) => {
  try {
    const { name, email, interests } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'A valid email address is required.',
      });
    }

    ensureDataFile();
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const subscribers = JSON.parse(rawData || '[]');

    // Check if already subscribed
    const existingIndex = subscribers.findIndex((sub) => sub.email.toLowerCase() === email.toLowerCase());

    const newEntry = {
      name: name?.trim() || 'Racer',
      email: email.trim().toLowerCase(),
      interests: Array.isArray(interests) ? interests : [],
      registeredAt: new Date().toISOString(),
      source: '24OURS-PreLaunch-Web',
    };

    if (existingIndex >= 0) {
      // Update existing interests
      subscribers[existingIndex] = { ...subscribers[existingIndex], ...newEntry };
    } else {
      subscribers.push(newEntry);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');

    console.log(`[24OURS Backend] New VIP follower registered: ${email} (${name || 'Anonymous'})`);

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for 24OURS pre-launch VIP updates.',
      data: {
        email: newEntry.email,
        name: newEntry.name,
      },
    });
  } catch (error) {
    console.error('[24OURS Backend Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing subscription.',
    });
  }
});

// GET /api/subscribe/count - Get follower count (for internal pre-launch tracking)
router.get('/count', (req, res) => {
  try {
    ensureDataFile();
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const subscribers = JSON.parse(rawData || '[]');
    return res.status(200).json({
      success: true,
      count: subscribers.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
