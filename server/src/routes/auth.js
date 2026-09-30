import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { User } from '../models.js';
import { wrap, validate } from '../middleware/index.js';

const r = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many attempts. Try again later.' } });
const schema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1) });

r.post('/login', limiter, validate(schema), wrap(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const ok = user && (await bcrypt.compare(req.body.password, user.password));
  if (!ok) return res.status(401).json({ message: 'Incorrect email or password' });
  const token = jwt.sign({ id: user._id, email: user.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ token, user: { email: user.email } });
}));

export default r;
