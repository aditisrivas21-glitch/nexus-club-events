import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { ensureAdmin, seedEvents } from './seedData.js';

const { MONGODB_URI, JWT_SECRET, PORT = 5000, NODE_ENV } = process.env;
if (!MONGODB_URI || !JWT_SECRET) { console.error('Missing MONGODB_URI or JWT_SECRET'); process.exit(1); }
if (NODE_ENV === 'production' && JWT_SECRET.length < 16) { console.error('JWT_SECRET must be at least 16 characters'); process.exit(1); }

try {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('MongoDB connected');
  await ensureAdmin();
  if (process.env.SEED_DEMO_DATA === 'true') await seedEvents();
} catch (e) {
  console.error('Startup failed:', e.message);
  process.exit(1);
}
const server = app.listen(PORT, () => console.log(`NEXUS API listening on ${PORT}`));
process.on('SIGTERM', () => server.close(() => mongoose.connection.close(false).then(() => process.exit(0))));
