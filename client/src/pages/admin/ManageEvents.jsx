import { useState } from 'react';
import { CalendarX, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { api } from '../../api.js';
import { CATEGORIES, fmtDate, useFetch } from '../../utils.jsx';
import { Empty, ErrorBox, Field, Loading, Modal } from '../../components/ui.jsx';

const blank = { title: '', description: '', category: 'Technical', date: '', time: '', venue: '', organizer: '', capacity: 100, featured: false };

function EventForm({ initial, onDone, onClose }) {
  const [f, setF] = useState(initial ? { ...initial, date: initial.date.slice(0, 10) } : blank);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    const { _id, createdAt, updatedAt, __v, registrationCount, ...body } = f;
    body.capacity = Number(body.capacity);
    try { await api(initial ? `/events/${initial._id}` : '/events', { method: initial ? 'PUT' : 'POST', body, auth: true }); onDone(); }
    catch (x) { setErr(x.message); setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Title"><input className="input" required minLength={3} value={f.title} onChange={on('title')} /></Field>
      <Field label="Description"><textarea className="input min-h-[110px]" required minLength={10} value={f.description} onChange={on('description')} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category"><select className="input" value={f.category} onChange={on('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Capacity"><input className="input" type="number" min={1} required value={f.capacity} onChange={on('capacity')} /></Field>
        <Field label="Date"><input className="input" type="date" required value={f.date} onChange={on('date')} /></Field>
        <Field label="Time"><input className="input" required placeholder="6:00 PM" value={f.time} onChange={on('time')} /></Field>
        <Field label="Venue"><input className="input" required value={f.venue} onChange={on('venue')} /></Field>
        <Field label="Organizer / club"><input className="input" required value={f.organizer} onChange={on('organizer')} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" className="h-4 w-4 accent-volt" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} />Feature on the home page</label>
      {err && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <div className="flex justify-end gap-3"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-dark" disabled={busy}>{busy ? 'Saving…' : initial ? 'Save changes' : 'Create event'}</button></div>
    </form>
  );
}

export default function ManageEvents() {
  const [n, setN] = useState(0);
  const [modal, setModal] = useState(null);
  const [msg, setMsg] = useState('');
  const { data, loading, error } = useFetch(() => api('/events'), [n]);
  const reload = () => setN((x) => x + 1);
  const del = async (e) => {
    if (!window.confirm(`Delete "${e.title}" and its ${e.registrationCount} registrations? This cannot be undone.`)) return;
    try { await api(`/events/${e._id}`, { method: 'DELETE', auth: true }); setMsg('Event deleted'); reload(); } catch (x) { setMsg(x.message); }
  };
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Events</h1><p className="text-ink/60">Create, edit and remove events.</p></div>
        <button className="btn btn-primary" onClick={() => setModal({})}><Plus className="h-4 w-4" />New event</button>
      </div>
      {msg && <p className="mb-4 rounded-xl bg-volt/10 p-3 text-sm text-volt" role="status">{msg}</p>}
      {loading ? <Loading /> : error ? <ErrorBox message={error} onRetry={reload} /> : data.length === 0 ? <div className="card"><Empty icon={CalendarX} title="No events yet" text="Create your first event to get it onto the home page."><button className="btn btn-primary mt-3" onClick={() => setModal({})}>Create event</button></Empty></div> : (
        <div className="card divide-y divide-ink/10">
          {[...data].reverse().map((e) => (
            <div key={e._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold"><span className="truncate">{e.title}</span>{e.featured && <Star className="h-4 w-4 shrink-0 fill-coral text-coral" />}</p>
                <p className="text-sm text-ink/60">{fmtDate(e.date)} · {e.time} · {e.venue}</p>
                <p className="mt-1 text-xs text-ink/50">{e.category} · {e.registrationCount}/{e.capacity} registered</p>
              </div>
              <div className="flex gap-2"><button className="btn btn-ghost !py-2" onClick={() => setModal(e)}><Pencil className="h-4 w-4" />Edit</button><button className="btn btn-danger !py-2" onClick={() => del(e)} aria-label={`Delete ${e.title}`}><Trash2 className="h-4 w-4" />Delete</button></div>
            </div>
          ))}
        </div>
      )}
      {modal && <Modal title={modal._id ? 'Edit event' : 'New event'} onClose={() => setModal(null)}><EventForm initial={modal._id ? modal : null} onClose={() => setModal(null)} onDone={() => { setMsg(modal._id ? 'Event updated' : 'Event created'); setModal(null); reload(); }} /></Modal>}
    </div>
  );
}
