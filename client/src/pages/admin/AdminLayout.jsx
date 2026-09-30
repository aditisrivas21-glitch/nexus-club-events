import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, LogOut, Ticket } from 'lucide-react';
import { useAuth } from '../../context/Auth.jsx';
import { Logo } from '../../components/Layout.jsx';

const nav = [['/admin', 'Dashboard', LayoutDashboard, true], ['/admin/events', 'Events', CalendarDays], ['/admin/registrations', 'Registrations', Ticket]];

export default function AdminLayout() {
  const { logout } = useAuth();
  const go = useNavigate();
  const out = () => { logout(); go('/admin/login'); };
  const cls = ({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`;
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-ink p-4 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex items-center justify-between lg:mb-8 lg:px-2 lg:pt-2">
          <Link to="/"><Logo dark /></Link>
          <button onClick={out} className="rounded-lg p-2 text-white/70 hover:text-white lg:hidden" aria-label="Sign out"><LogOut className="h-5 w-5" /></button>
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto lg:mt-0 lg:flex-col">
          {nav.map(([to, l, I, end]) => <NavLink key={to} to={to} end={end} className={cls}><I className="h-4 w-4" />{l}</NavLink>)}
        </nav>
        <button onClick={out} className="mt-auto hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white lg:flex"><LogOut className="h-4 w-4" />Sign out</button>
      </aside>
      <main className="min-w-0 p-4 sm:p-8"><Outlet /></main>
    </div>
  );
}
