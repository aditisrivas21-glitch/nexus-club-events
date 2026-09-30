import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, MapPin, Lightbulb, Ticket, Rocket } from 'lucide-react';
import { api } from '../api.js';
import { CAT, CATEGORIES, fmtDate, isPast, useFetch } from '../utils.jsx';
import EventCard from '../components/EventCard.jsx';
import { ErrorBox, Loading } from '../components/ui.jsx';

function TicketCard({ e }) {
  const c = CAT[e.category] || CAT.Social;
  return (
    <Link to={`/events/${e._id}`} className="block w-full max-w-sm animate-tilt rounded-3xl bg-white p-2 shadow-2xl shadow-black/40">
      <div className={`rounded-2xl bg-gradient-to-br ${c.grad} p-6 text-white`}>
        <p className="text-sm font-semibold text-white/80">Up next · {e.category}</p>
        <h3 className="mt-3 text-2xl font-bold leading-tight">{e.title}</h3>
      </div>
      <div className="relative mx-4 my-0 border-t-2 border-dashed border-ink/15" />
      <div className="space-y-2 p-5 text-sm text-ink">
        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-volt" />{fmtDate(e.date)} · {e.time}</p>
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-volt" />{e.venue}</p>
        <p className="pt-1 font-semibold text-coral">Reserve your seat</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const { data, loading, error } = useFetch(() => api('/events'), []);
  const upcoming = (data || []).filter((e) => !isPast(e.date));
  const featured = upcoming.filter((e) => e.featured).slice(0, 3);
  const next = upcoming[0];
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-volt/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-coral/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr]">
          <div className="animate-rise">
            <h1 className="text-5xl font-bold leading-[1.02] sm:text-7xl">Discover.<br />Participate.<br />Create.</h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">NEXUS is the home for every club on campus. Find hackathons, cultural nights, workshops and matches, then claim your seat in under a minute.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/events" className="btn btn-primary !px-6 !py-3">Browse events <ArrowRight className="h-4 w-4" /></Link>
              <a href="#about" className="btn border border-white/20 !px-6 !py-3 text-white hover:bg-white/10">What is NEXUS?</a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">{next ? <TicketCard e={next} /> : loading ? null : <p className="text-white/50">New events land here soon.</p>}</div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[[Lightbulb, 'Discover', 'One feed for every club, filterable by interest and date, so nothing slips past you.'], [Ticket, 'Participate', 'Register with four details. No accounts, no queues, instant confirmation.'], [Rocket, 'Create', 'Club leads publish events and track sign-ups from a dedicated organizer dashboard.']].map(([I, t, d]) => (
            <div key={t} className="card p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-volt/10 text-volt"><I className="h-5 w-5" /></span><h3 className="mt-4 text-xl font-bold">{t}</h3><p className="mt-1.5 text-sm text-ink/60">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between"><h2 className="text-3xl font-bold">Featured events</h2><Link to="/events" className="text-sm font-semibold text-volt hover:underline">See all</Link></div>
        {loading ? <Loading label="Loading events…" /> : error ? <ErrorBox message={error} onRetry={() => window.location.reload()} /> : featured.length === 0 ? <p className="text-ink/60">No featured events right now.</p> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((e) => <EventCard key={e._id} e={e} />)}</div>
        )}
      </section>

      {upcoming.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="mb-6 text-3xl font-bold">Coming up</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{upcoming.slice(0, 6).map((e) => <EventCard key={e._id} e={e} />)}</div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-3xl font-bold">Find your scene</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {CATEGORIES.map((k) => { const c = CAT[k]; const I = c.icon; return (
            <Link key={k} to={`/events?category=${k}`} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.grad} p-5 text-white transition hover:-translate-y-1 hover:shadow-xl`}>
              <I className="mb-6 h-7 w-7" /><p className="text-lg font-bold">{k}</p><p className="text-xs text-white/80">{c.blurb}</p>
            </Link>); })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl bg-volt p-8 text-white sm:p-14">
          <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">Your next favourite memory is one registration away.</h2>
          <Link to="/events" className="btn mt-6 bg-white !px-6 !py-3 text-volt hover:bg-paper">Explore all events <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
