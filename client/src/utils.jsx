import { useEffect, useState } from 'react';
import { Cpu, Palette, Trophy, Wrench, Briefcase, Users } from 'lucide-react';

export const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Career', 'Social'];
export const CAT = {
  Technical: { grad: 'from-indigo-500 to-violet-700', icon: Cpu, blurb: 'Hackathons, talks and builds' },
  Cultural: { grad: 'from-pink-500 to-rose-600', icon: Palette, blurb: 'Music, dance and theatre' },
  Sports: { grad: 'from-emerald-500 to-teal-700', icon: Trophy, blurb: 'Leagues and tournaments' },
  Workshop: { grad: 'from-amber-500 to-orange-600', icon: Wrench, blurb: 'Learn by doing' },
  Career: { grad: 'from-sky-500 to-blue-700', icon: Briefcase, blurb: 'Interviews and mentoring' },
  Social: { grad: 'from-fuchsia-500 to-purple-700', icon: Users, blurb: 'Meet people, make friends' },
};
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Other'];

export const fmtDate = (d, opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(d).toLocaleDateString('en-IN', { ...opts, timeZone: 'UTC' });
export const isPast = (d) => new Date(d) < new Date(new Date().toDateString());

export function useFetch(fn, deps = []) {
  const [s, set] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    let live = true;
    set((x) => ({ ...x, loading: true, error: '' }));
    fn().then((data) => live && set({ data, loading: false, error: '' })).catch((e) => live && set({ data: null, loading: false, error: e.message }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return s;
}
