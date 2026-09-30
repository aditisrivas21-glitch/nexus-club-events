import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Star } from 'lucide-react';
import { CAT, fmtDate, isPast } from '../utils.jsx';

export default function EventCard({ e }) {
  const c = CAT[e.category] || CAT.Social;
  const Icon = c.icon;
  const left = Math.max(0, e.capacity - (e.registrationCount || 0));
  const pct = Math.min(100, Math.round(((e.registrationCount || 0) / e.capacity) * 100));
  const past = isPast(e.date);
  return (
    <Link to={`/events/${e._id}`} className="group card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-volt/10">
      <div className={`relative flex h-28 items-start justify-between bg-gradient-to-br ${c.grad} p-4`}>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{e.category}</span>
        {e.featured && <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink"><Star className="h-3 w-3 fill-coral text-coral" />Featured</span>}
        <Icon className="absolute -bottom-4 right-2 h-20 w-20 text-white/20 transition duration-500 group-hover:rotate-12" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-sm font-medium text-volt"><CalendarDays className="h-4 w-4" />{fmtDate(e.date)} · {e.time}</p>
        <h3 className="mt-2 text-lg font-bold leading-snug">{e.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/60">{e.description}</p>
        <div className="mt-auto pt-4">
          <p className="flex items-center gap-1.5 text-sm text-ink/60"><MapPin className="h-4 w-4 shrink-0" /><span className="truncate">{e.venue}</span></p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-volt" style={{ width: `${pct}%` }} /></div>
          <p className="mt-1.5 text-xs text-ink/50">{past ? 'Event completed' : left === 0 ? 'Fully booked' : `${left} seats left`}</p>
        </div>
      </div>
    </Link>
  );
}
