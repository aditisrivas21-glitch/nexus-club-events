import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Check, MapPin } from "lucide-react";
import { api } from "../api.js";
import { YEARS, fmtDate, isPast, useFetch } from "../utils.jsx";
import { ErrorBox, Field, Loading } from "../components/ui.jsx";

export default function Register() {
  const { id } = useParams();

  const {
    data: e,
    loading,
    error,
  } = useFetch(() => api(`/events/${id}`), [id]);

  const [f, setF] = useState({
    name: "",
    email: "",
    college: "",
    year: "",
    phone: "",
  });

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  const on = (key) => (ev) => {
    const value = ev.target.value;
    setF((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (ev) => {
    ev.preventDefault();

    if (busy) return;

    setErr("");
    setBusy(true);

    try {
      const result = await api("/registrations", {
        method: "POST",
        body: {
          ...f,
          eventId: id,
        },
      });

      setDone(result);
    } catch (x) {
      setErr(
        x instanceof Error
          ? x.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return <ErrorBox message={error} />;
  }

  if (!e) {
    return <ErrorBox message="Event could not be loaded." />;
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className="mx-auto grid h-20 w-20 animate-pop place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-10 w-10" strokeWidth={3} />
        </span>

        <h1 className="mt-6 text-3xl font-bold">
          You're in, {f.name.split(" ")[0]}!
        </h1>

        <p className="mt-2 text-ink/60">
          Registration confirmed for <b>{done.event.title}</b>.
        </p>

        <div className="card mt-6 space-y-2 p-5 text-left text-sm">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-volt" />
            {fmtDate(done.event.date)} · {done.event.time}
          </p>

          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-volt" />
            {done.event.venue}
          </p>

          <p className="border-t border-ink/10 pt-2 text-xs text-ink/50">
            Reference: {done.registration._id.slice(-8).toUpperCase()}.
            Screenshot this page and bring it along.
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/events" className="btn btn-primary">
            Discover more events
          </Link>

          <Link to="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const closed = isPast(e.date) || e.registrationCount >= e.capacity;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link
        to={`/events/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-volt"
      >
        <ArrowLeft className="h-4 w-4" />
        Event details
      </Link>

      <h1 className="mt-4 text-3xl font-bold">Reserve your seat</h1>

      <p className="mt-1 text-ink/60">
        {e.title} · {fmtDate(e.date)}
      </p>

      {closed ? (
        <p className="mt-8 rounded-2xl bg-ink/5 p-5 text-center">
          {isPast(e.date)
            ? "This event has ended."
            : "This event is fully booked."}
        </p>
      ) : (
        <form onSubmit={submit} className="card mt-6 space-y-4 p-5 sm:p-7">
          <Field label="Full name">
            <input
              className="input"
              required
              minLength={2}
              value={f.name}
              onChange={on("name")}
              autoComplete="name"
              placeholder="Aarav Sharma"
            />
          </Field>

          <Field label="Email">
            <input
              className="input"
              type="email"
              required
              value={f.email}
              onChange={on("email")}
              autoComplete="email"
              placeholder="you@college.edu"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="College">
              <input
                className="input"
                required
                minLength={2}
                value={f.college}
                onChange={on("college")}
                placeholder="Your college"
              />
            </Field>

            <Field label="Year">
              <select
                className="input"
                required
                value={f.year}
                onChange={on("year")}
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Phone">
            <input
              className="input"
              type="tel"
              required
              value={f.phone}
              onChange={on("phone")}
              autoComplete="tel"
              placeholder="+91 98765 43210"
            />
          </Field>

          {err && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {err}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full !py-3"
            disabled={busy}
          >
            {busy ? "Registering…" : "Confirm registration"}
          </button>
        </form>
      )}
    </div>
  );
}
