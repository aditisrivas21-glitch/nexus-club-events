import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import events from './routes/events.js';
import registrations from './routes/registrations.js';
import { notFound, errorHandler } from './middleware/index.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());

const origins = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim().replace(/\/$/, '')).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    const dev = process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin || '');
    cb(null, !origin || origins.includes(origin) || dev);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', uptime: Math.round(process.uptime()) })
);
app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/registrations', registrations);
app.use(notFound);
app.use(errorHandler);

export default app;
