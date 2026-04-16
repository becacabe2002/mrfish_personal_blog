import express from 'express';
import { prisma } from './lib/prisma.js';
import { deviceMiddleware } from './middleware/device.js';

const app = express();

app.use(express.json());
app.use(deviceMiddleware);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Post view tracking
app.post('/api/views', async (req, res) => {
  const { postSlug } = req.body;

  if (!postSlug) {
    return res.status(400).json({ error: 'postSlug is required' });
  }

  try {
    const view = await prisma.viewEvent.create({
      data: {
        postSlug,
        device: req.deviceInfo?.device,
        browser: req.deviceInfo?.browser,
        os: req.deviceInfo?.os,
        userAgent: req.deviceInfo?.userAgent,
      },
    });

    res.status(201).json({ success: true, id: view.id });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Feedback ingestion
app.post('/api/feedback', async (req, res) => {
  const { postSlug, content, rating, name, email } = req.body;

  if (!postSlug || !content) {
    return res.status(400).json({ error: 'postSlug and content are required' });
  }

  try {
    const feedback = await prisma.feedbackEvent.create({
      data: {
        postSlug,
        content,
        rating,
        name,
        email,
      },
    });

    res.status(201).json({ success: true, id: feedback.id });
  } catch (error) {
    console.error('Error tracking feedback:', error);
    res.status(500).json({ error: 'Failed to track feedback' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from TypeScript Backend');
});

export default app;
