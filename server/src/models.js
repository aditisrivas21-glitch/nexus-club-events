import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Career', 'Social'];

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },
    capacity: { type: Number, default: 100, min: 1 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);
eventSchema.index({ date: 1 });

const registrationSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    college: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
registrationSchema.index({ event: 1, email: 1 }, { unique: true });

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const Event = model('Event', eventSchema);
export const Registration = model('Registration', registrationSchema);
export const User = model('User', userSchema);
