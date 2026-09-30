import 'dotenv/config';
import mongoose from 'mongoose';
import { ensureAdmin, seedEvents } from './seedData.js';

if (!process.env.MONGODB_URI) { console.error('Missing MONGODB_URI'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);
await ensureAdmin();
await seedEvents({ force: true });
await mongoose.disconnect();
