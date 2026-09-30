import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Logo = ({ dark }) => (
  <span className={`flex items-center gap-2 font-display text-xl font-bold ${dark ? 'text-white' : 'text-ink'}`}>
    <svg viewBox="0 0 100 100" className="h-8 w-8"><rect width="100" height="100" rx="26" fill="#6446F0" /><path d="M28 74V26l44 48V26" stroke="#fff" strokeWidth="11" fill="none" strokeLinejoin="round" /></svg>
    NEXUS
  </span>
);

const links = [['/', 'Home'], ['/events', 'Events']];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const cls = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-volt/10 text-volt' : 'text-ink/70 hover:text-ink'}`;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" aria-label="NEXUS home"><Logo /></Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}
            <Link to="/events" className="btn btn-primary ml-3 !py-2">Find an event</Link>
          </nav>
          <button className="rounded-lg p-2 sm:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-ink/10 px-4 pb-4 pt-2 sm:hidden" onClick={() => setOpen(false)}>
            {links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}
            <Link to="/events" className="btn btn-primary mt-2">Find an event</Link>
          </nav>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-ink text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center">
          <div><Logo dark /><p className="mt-2 text-sm">Discover. Participate. Create.</p></div>
          <div className="flex gap-5 text-sm"><Link to="/events" className="hover:text-white">Events</Link><Link to="/admin" className="hover:text-white">Organizer login</Link></div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} NEXUS College Clubs</p>
      </footer>
    </div>
  );
}
