import { useEffect, useState } from 'react';
import { Download, Search, Ticket, Trash2 } from 'lucide-react';
import { api } from '../../api.js';
import { fmtDate, useFetch } from '../../utils.jsx';
import { Empty, ErrorBox, Loading } from '../../components/ui.jsx';

export default function Registrations() {
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const [event, setEvent] = useState('');
  const [n, setN] = useState(0);
  const [msg, setMsg] = useState('');
  useEffect(() => { const t = setTimeout(() => setDq(q), 300); return () => clearTimeout(t); }, [q]);
  const events = useFetch(() => api('/events'), []);
  const { data, loading, error } = useFetch(() => api(`/registrations?${new URLSearchParams({ ...(dq && { q: dq }), ...(event && { event }) })}`, { auth: true }), [dq, event, n]);

  const del = async (r) => {
    if (!window.confirm(`Remove ${r.name}'s registration?`)) return;
    try { await api(`/registrations/${r._id}`, { method: 'DELETE', auth: true }); setMsg('Registration deleted'); setN(n + 1); } catch (x) { setMsg(x.message); }
  };
  const exportCsv = () => {
    const rows = [['Name', 'Email', 'Phone', 'College', 'Year', 'Event', 'Registered'], ...data.map((r) => [r.name, r.email, r.phone, r.college, r.year, r.event?.title || '', new Date(r.createdAt).toISOString()])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'nexus-registrations.csv' });
    a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Registrations</h1><p className="text-ink/60">{data ? `${data.length} result${data.length !== 1 ? 's' : ''}` : 'Everyone who signed up.'}</p></div>
        <button className="btn btn-ghost" onClick={exportCsv} disabled={!data?.length}><Download className="h-4 w-4" />Export CSV</button>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" /><input className="input !pl-10" placeholder="Search name, email or college" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search registrations" /></div>
        <select className="input sm:w-64" value={event} onChange={(e) => setEvent(e.target.value)} aria-label="Filter by event"><option value="">All events</option>{(events.data || []).map((e) => <option key={e._id} value={e._id}>{e.title}</option>)}</select>
      </div>
      {msg && <p className="mb-4 rounded-xl bg-volt/10 p-3 text-sm text-volt" role="status">{msg}</p>}
      {loading && !data ? <Loading /> : error ? <ErrorBox message={error} onRetry={() => setN(n + 1)} /> : data.length === 0 ? <div className="card"><Empty icon={Ticket} title="No registrations found" text="Try a different search or event." /></div> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs text-ink/50"><tr>{['Student', 'Contact', 'College', 'Event', 'Registered', ''].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-ink/10">{data.map((r) => (
              <tr key={r._id} className="hover:bg-paper/60">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3"><p>{r.email}</p><p className="text-xs text-ink/50">{r.phone}</p></td>
                <td className="px-4 py-3">{r.college}<p className="text-xs text-ink/50">{r.year}</p></td>
                <td className="px-4 py-3">{r.event?.title || <span className="text-ink/40">Deleted event</span>}</td>
                <td className="px-4 py-3 text-ink/60">{fmtDate(r.createdAt, { day: 'numeric', month: 'short' })}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => del(r)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete registration of ${r.name}`}><Trash2 className="h-4 w-4" /></button></td>
              </tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
