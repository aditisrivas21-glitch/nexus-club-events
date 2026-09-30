import bcrypt from 'bcryptjs';
import { Event, Registration, User } from './models.js';

const day = (n) => { const d = new Date(); d.setUTCHours(0, 0, 0, 0); d.setUTCDate(d.getUTCDate() + n); return d; };

const events = [
  { title: 'HackNexus 2026: 24-Hour Hackathon', category: 'Technical', d: 12, time: '9:00 AM', venue: 'Innovation Lab, Block C', organizer: 'Code Circle', capacity: 150, featured: true, description: 'Build something real in 24 hours. Form a team of up to four, pick a problem track (campus life, sustainability, or open), and ship a working prototype. Mentors from local startups, meals, and prizes worth ₹1,00,000.' },
  { title: 'Rangotsav Annual Cultural Night', category: 'Cultural', d: 25, time: '6:00 PM', venue: 'Open Air Amphitheatre', organizer: 'Kalakriti Society', capacity: 600, featured: true, description: 'An evening of dance, live music, theatre and stand-up from student performers across all departments. Food stalls open from 5 PM. Bring your friends and your loudest cheers.' },
  { title: 'Inter-College Football League: Semi-Finals', category: 'Sports', d: 8, time: '4:00 PM', venue: 'Main Football Ground', organizer: 'Sports Council', capacity: 400, featured: true, description: 'Four teams remain. Come support the home side in the semi-finals of the inter-college league. Free entry with registration, reserved seating for early sign-ups.' },
  { title: 'Intro to Machine Learning: Hands-on Workshop', category: 'Workshop', d: 5, time: '2:00 PM', venue: 'Seminar Hall 2', organizer: 'AI & Data Club', capacity: 60, featured: false, description: 'Train your first model in Python in under three hours. We cover data cleaning, a simple classifier and evaluation. Bring a laptop with Python 3.10+ installed.' },
  { title: 'Resume Clinic & Mock Interview Day', category: 'Career', d: 15, time: '10:00 AM', venue: 'Placement Cell, Admin Block', organizer: 'Career Development Cell', capacity: 80, featured: false, description: 'Get one-on-one resume feedback from alumni working in product, consulting and engineering, followed by a 20-minute mock interview tailored to your target role.' },
  { title: 'Freshers Mixer: Games & Games Night', category: 'Social', d: 3, time: '7:00 PM', venue: 'Student Activity Centre', organizer: 'Student Union', capacity: 200, featured: false, description: 'Board games, video game tournaments and a quiz. A relaxed way for first-years to meet clubs and seniors. Snacks provided.' },
  { title: 'UI/UX Design Sprint', category: 'Workshop', d: 19, time: '11:00 AM', venue: 'Design Studio, Block B', organizer: 'Pixel Guild', capacity: 45, featured: false, description: 'Solve a real design brief in one day: research, wireframes, prototype and a five-minute pitch. Figma basics recommended but not required.' },
  { title: 'Open Mic & Poetry Slam', category: 'Cultural', d: 30, time: '5:30 PM', venue: 'Library Courtyard', organizer: 'Literary Society', capacity: 120, featured: false, description: 'Read, sing or perform. Sign up for a slot at the door or simply come and listen. Original work in any language is welcome.' },
  { title: 'Cloud & DevOps Bootcamp (Completed)', category: 'Technical', d: -14, time: '10:00 AM', venue: 'Computer Lab 4', organizer: 'Code Circle', capacity: 50, featured: false, description: 'A two-day bootcamp on containers, CI/CD and deploying to the cloud. Recordings and slides were shared with all attendees.' },
];

const people = [
  ['Aarav Sharma', 'IIT Delhi', '3rd Year'], ['Diya Patel', 'NSUT', '2nd Year'], ['Rohan Mehta', 'DTU', '4th Year'],
  ['Ananya Iyer', 'BITS Pilani', '1st Year'], ['Kabir Singh', 'IIIT Delhi', '3rd Year'], ['Meera Nair', 'NSUT', '2nd Year'],
  ['Vihaan Gupta', 'DTU', '1st Year'], ['Isha Reddy', 'IIT Delhi', '4th Year'], ['Arjun Verma', 'BITS Pilani', '2nd Year'],
  ['Saanvi Joshi', 'IIIT Delhi', '3rd Year'], ['Neel Kapoor', 'NSUT', '1st Year'], ['Tara Bose', 'DTU', '2nd Year'],
];

export async function ensureAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  const email = ADMIN_EMAIL.toLowerCase();
  if (await User.exists({ email })) return;
  await User.create({ email, password: await bcrypt.hash(ADMIN_PASSWORD, 12) });
  console.log(`Admin user created: ${email}`);
}

export async function seedEvents({ force = false } = {}) {
  if (force) await Promise.all([Event.deleteMany({}), Registration.deleteMany({})]);
  else if (await Event.estimatedDocumentCount()) return;
  const created = await Event.insertMany(events.map(({ d, ...e }) => ({ ...e, date: day(d) })));
  const regs = [];
  created.forEach((ev, i) => {
    const n = Math.min(people.length, 4 + ((i * 3) % 8));
    people.slice(0, n).forEach(([name, college, year], j) =>
      regs.push({ event: ev._id, name, college, year, email: `${name.split(' ')[0].toLowerCase()}${j}@student.edu`, phone: `+91 98${String(10000000 + i * 137 + j * 911).slice(0, 8)}` })
    );
  });
  await Registration.insertMany(regs);
  console.log(`Seeded ${created.length} events and ${regs.length} registrations`);
}
