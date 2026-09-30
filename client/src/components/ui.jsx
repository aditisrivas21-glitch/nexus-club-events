import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';

export function Loading({ label = 'Loading…' }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSlow(true), 4000); return () => clearTimeout(t); }, []);
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-24 text-ink/60" role="status">
      <Loader2 className="h-6 w-6 animate-spin text-volt" />
      <p className="text-sm">{label}</p>
      {slow && <p className="max-w-xs text-center text-xs">The server is waking up after a quiet spell. This can take up to 30 seconds.</p>}
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="mx-auto my-10 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700" role="alert">
      <AlertCircle className="h-6 w-6" />
      <p>{message}</p>
      {onRetry && <button onClick={onRetry} className="btn btn-ghost">Try again</button>}
    </div>
  );
}

export function Empty({ icon: Icon, title, text, children }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
      {Icon && <span className="grid h-12 w-12 place-items-center rounded-2xl bg-volt/10 text-volt"><Icon className="h-6 w-6" /></span>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {text && <p className="max-w-sm text-sm text-ink/60">{text}</p>}
      {children}
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="animate-pop max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 hover:bg-ink/5"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
