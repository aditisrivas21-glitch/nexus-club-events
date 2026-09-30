import { CalendarDays, Star, Ticket, TrendingUp } from 'lucide-react';
import { api } from '../../api.js';
import { CAT, CATEGORIES, fmtDate, isPast, useFetch } from '../../utils.jsx';
import { ErrorBox, Loading } from '../../components/ui.jsx';

export default function Dashboard() {
  const { data, loading, error } = useFetch(() => Promise.all([api('/events'), api('/registrations', { auth: true })]), []);
  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={() => window.location.reload()} />;
  const [events, regs] = data;
  const upcoming = events.filter((e) => !isPast(e.date));
  const seats = events.reduce((s, e) => s + e.capacity, 0);
  const fill = seats ? Math.round((regs.length / seats) * 100) : 0;
  const stats = [[CalendarDays, 'Total events', events.length, `${upcoming.length} upcoming`], [Ticket, 'Registrations', regs.length, 'across all events'], [Star, 'Featured', events.filter((e) => e.featured).length, 'on the home page'], [TrendingUp, 'Seat fill rate', `${fill}%`, `${regs.length} of ${seats} seats`]];
  const byCat = CATEGORIES.map((c) => ({ c, n: regs.filter((r) => r.event?.category === c).length }));
  const max = Math.max(1, ...byCat.map((x) => x.n));
  const top = [...events].sort((a, b) => b.registrationCount - a.registrationCount).slice(0, 5);
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Dashboard</h1><p className="text-ink/60">A snapshot of what's happening across your clubs.</p></div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(([I, l, v, s]) => <div key={l} className="card p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-volt/10 text-volt"><I className="h-5 w-5" /></span><p className="mt-4 text-3xl font-bold">{v}</p><p className="text-sm font-medium">{l}</p><p className="text-xs text-ink/50">{s}</p></div>)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-bold">Registrations by category</h2>
          <div className="mt-4 space-y-3">{byCat.map(({ c, n }) => (
            <div key={c}><div className="mb-1 flex justify-between text-sm"><span>{c}</span><span className="text-ink/60">{n}</span></div><div className="h-2 overflow-hidden rounded-full bg-ink/10"><div className={`h-full rounded-full bg-gradient-to-r ${CAT[c].grad} transition-all duration-700`} style={{ width: `${(n / max) * 100}%` }} /></div></div>
          ))}</div>
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Most popular events</h2>
          <ul className="mt-3 divide-y divide-ink/10">{top.map((e) => <li key={e._id} className="flex items-center justify-between gap-3 py-3 text-sm"><div className="min-w-0"><p className="truncate font-medium">{e.title}</p><p className="text-xs text-ink/50">{fmtDate(e.date)}</p></div><span className="shrink-0 rounded-full bg-volt/10 px-2.5 py-1 text-xs font-semibold text-volt">{e.registrationCount}/{e.capacity}</span></li>)}</ul>
        </div>
      </div>
      <div className="card p-5">
        <h2 className="font-bold">Latest registrations</h2>
        <ul className="mt-3 divide-y divide-ink/10">{regs.slice(0, 6).map((r) => <li key={r._id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><div><p className="font-medium">{r.name}</p><p className="text-xs text-ink/50">{r.college} · {r.year}</p></div><p className="text-xs text-ink/60">{r.event?.title || 'Deleted event'}</p></li>)}{regs.length === 0 && <li className="py-6 text-center text-sm text-ink/50">No registrations yet.</li>}</ul>
      </div>
    </div>
  );
}
