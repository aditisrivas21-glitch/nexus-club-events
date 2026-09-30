import { Router } from 'express';
import { z } from 'zod';
import { Event, Registration, CATEGORIES } from '../models.js';
import { wrap, validate, validId, requireAdmin } from '../middleware/index.js';

const r = Router();
const schema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(3000),
  category: z.enum(CATEGORIES),
  date: z.coerce.date(),
  time: z.string().trim().min(1).max(20),
  venue: z.string().trim().min(2).max(120),
  organizer: z.string().trim().min(2).max(120),
  capacity: z.coerce.number().int().min(1).max(100000),
  featured: z.boolean().optional(),
});

const withCounts = async (events) => {
  const rows = await Registration.aggregate([
    { $match: { event: { $in: events.map((e) => e._id) } } },
    { $group: { _id: '$event', n: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(rows.map((x) => [String(x._id), x.n]));
  return events.map((e) => ({ ...e, registrationCount: map[String(e._id)] || 0 }));
};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

r.get('/', wrap(async (req, res) => {
  const { q, category, featured } = req.query;
  const filter = {};
  if (typeof q === 'string' && q.trim()) filter.$or = ['title', 'description', 'venue', 'organizer'].map((f) => ({ [f]: new RegExp(esc(q.trim()), 'i') }));
  if (typeof category === 'string' && CATEGORIES.includes(category)) filter.category = category;
  if (featured === 'true') filter.featured = true;
  res.json(await withCounts(await Event.find(filter).sort({ date: 1 }).lean()));
}));

r.get('/:id', validId, wrap(async (req, res) => {
  const ev = await Event.findById(req.params.id).lean();
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json((await withCounts([ev]))[0]);
}));

r.post('/', requireAdmin, validate(schema), wrap(async (req, res) => {
  res.status(201).json(await Event.create(req.body));
}));

r.put('/:id', requireAdmin, validId, validate(schema.partial()), wrap(async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json(ev);
}));

r.delete('/:id', requireAdmin, validId, wrap(async (req, res) => {
  const ev = await Event.findByIdAndDelete(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  await Registration.deleteMany({ event: ev._id });
  res.json({ message: 'Event deleted' });
}));

export default r;
