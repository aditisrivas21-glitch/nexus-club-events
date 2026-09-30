import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Event, Registration } from '../models.js';
import { wrap, validate, validId, requireAdmin } from '../middleware/index.js';

const r = Router();
const schema = z.object({
  eventId: z.string().refine((v) => mongoose.isValidObjectId(v), 'Invalid event'),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  college: z.string().trim().min(2).max(120),
  year: z.string().trim().min(1).max(30),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,17}$/, 'Enter a valid phone number'),
});
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

r.post('/', validate(schema), wrap(async (req, res) => {
  const { eventId, ...data } = req.body;
  const ev = await Event.findById(eventId);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  if (ev.date < new Date(new Date().toDateString())) return res.status(400).json({ message: 'Registration for this event has closed' });
  if ((await Registration.countDocuments({ event: ev._id })) >= ev.capacity) return res.status(409).json({ message: 'Sorry, this event is full' });
  try {
    const reg = await Registration.create({ ...data, event: ev._id });
    res.status(201).json({ registration: reg, event: { title: ev.title, date: ev.date, time: ev.time, venue: ev.venue } });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'This email is already registered for the event' });
    throw e;
  }
}));

r.get('/', requireAdmin, wrap(async (req, res) => {
  const { event, q } = req.query;
  const filter = {};
  if (typeof event === 'string' && mongoose.isValidObjectId(event)) filter.event = event;
  if (typeof q === 'string' && q.trim()) filter.$or = ['name', 'email', 'college'].map((f) => ({ [f]: new RegExp(esc(q.trim()), 'i') }));
  res.json(await Registration.find(filter).populate('event', 'title date category').sort({ createdAt: -1 }).lean());
}));

r.get('/:id', requireAdmin, validId, wrap(async (req, res) => {
  const reg = await Registration.findById(req.params.id).populate('event', 'title date category').lean();
  if (!reg) return res.status(404).json({ message: 'Registration not found' });
  res.json(reg);
}));

r.delete('/:id', requireAdmin, validId, wrap(async (req, res) => {
  const reg = await Registration.findByIdAndDelete(req.params.id);
  if (!reg) return res.status(404).json({ message: 'Registration not found' });
  res.json({ message: 'Registration deleted' });
}));

export default r;
