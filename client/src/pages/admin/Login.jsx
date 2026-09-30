import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/Auth.jsx';
import { Logo } from '../../components/Layout.jsx';
import { Field } from '../../components/ui.jsx';

export default function Login() {
  const { token, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (token) return <Navigate to="/admin" replace />;
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await login(email, password); nav(loc.state?.from || '/admin', { replace: true }); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo dark /></div>
        <form onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-7 shadow-2xl">
          <div><h1 className="flex items-center gap-2 text-2xl font-bold"><Lock className="h-5 w-5 text-volt" />Organizer sign in</h1><p className="mt-1 text-sm text-ink/60">Manage events and registrations.</p></div>
          <Field label="Email"><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></Field>
          <Field label="Password"><input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></Field>
          {err && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
          <button className="btn btn-dark w-full !py-3" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="mt-5 text-center text-sm text-white/60"><Link to="/" className="hover:text-white">Back to site</Link></p>
      </div>
    </div>
  );
}
