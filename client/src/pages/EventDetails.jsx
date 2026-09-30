import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Building2 } from 'lucide-react';
import { api } from '../api.js';
import { CAT, fmtDate, isPast, useFetch } from '../utils.jsx';
import { ErrorBox, Loading } from '../components/ui.jsx';

export default function EventDetails() {
  const { id } = useParams();
  const { data: e, loading, error } = useFetch(() => api(`/events/${id}`), [id]);
  if (loading) return <Loading />;
  if (error) return <div className="px-4"><ErrorBox message={error === 'Event not found' || error === 'Not found' ? "We couldn't find that event." : error} /><p className="text-center"><Link to="/events" className="btn btn-ghost">Back to events</Link></p></div>;
  const c = CAT[e.category] || CAT.Social, Icon = c.icon;
  const left = Math.max(0, e.capacity - e.registrationCount), past = isPast(e.date);
  const rows = [[CalendarDays, 'Date', fmtDate(e.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })], [Clock, 'Time', e.time], [MapPin, 'Venue', e.venue], [Building2, 'Hosted by', e.organizer], [Users, 'Seats', `${e.registrationCount} of ${e.capacity} taken`]];
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-volt"><ArrowLeft className="h-4 w-4" />All events</Link>
      <div className={`relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br ${c.grad} p-8 text-white sm:p-12`}>
        <Icon className="absolute -right-6 -top-6 h-52 w-52 text-white/15" />
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">{e.category}</span>
        <h1 className="relative mt-4 max-w-3xl text-3xl font-bold sm:text-5xl">{e.title}</h1>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div><h2 className="text-xl font-bold">About this event</h2><p className="mt-3 whitespace-pre-line leading-relaxed text-ink/75">{e.description}</p></div>
        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <ul className="space-y-4">{rows.map(([I, l, v]) => <li key={l} className="flex gap-3"><I className="mt-0.5 h-5 w-5 shrink-0 text-volt" /><div><p className="text-xs text-ink/50">{l}</p><p className="text-sm font-semibold">{v}</p></div></li>)}</ul>
          {past ? <p className="mt-6 rounded-xl bg-ink/5 p-3 text-center text-sm">This event has ended.</p>
            : left === 0 ? <p className="mt-6 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">This event is fully booked.</p>
            : <Link to={`/events/${e._id}/register`} className="btn btn-primary mt-6 w-full !py-3">Register now</Link>}
          {!past && left > 0 && left <= 20 && <p className="mt-2 text-center text-xs text-coral-dark">Only {left} seats left</p>}
        </aside>
      </div>
    </div>
  );
}
