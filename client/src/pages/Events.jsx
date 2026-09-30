import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarX, Search } from "lucide-react";
import { api } from "../api.js";
import { CATEGORIES, isPast, useFetch } from "../utils.jsx";
import EventCard from "../components/EventCard.jsx";
import { Empty, ErrorBox, Loading } from "../components/ui.jsx";

const DATES = [
  ["upcoming", "Upcoming"],
  ["week", "This week"],
  ["month", "This month"],
  ["past", "Past"],
  ["all", "All dates"],
];

export default function Events() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "",
    category = sp.get("category") || "",
    when = sp.get("when") || "upcoming";
  const set = (k, v) => {
    const n = new URLSearchParams(sp);
    v && !(k === "when" && v === "upcoming") ? n.set(k, v) : n.delete(k);
    setSp(n, { replace: true });
  };
  const { data, loading, error } = useFetch(() => api("/events"), []);

  const list = useMemo(() => {
    const now = new Date(),
      week = new Date(now.getTime() + 7 * 864e5),
      month = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59);
    return (data || [])
      .filter((e) => {
        const d = new Date(e.date);
        if (category && e.category !== category) return false;
        if (
          q &&
          !`${e.title} ${e.description} ${e.venue} ${e.organizer}`
            .toLowerCase()
            .includes(q.toLowerCase())
        )
          return false;
        if (when === "upcoming") return !isPast(e.date);
        if (when === "week") return !isPast(e.date) && d <= week;
        if (when === "month") return !isPast(e.date) && d <= month;
        if (when === "past") return isPast(e.date);
        return true;
      })
      .sort((a, b) =>
        when === "past"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date),
      );
  }, [data, q, category, when]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold">Events</h1>
      <p className="mt-1 text-ink/60">
        Everything happening across campus clubs.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            className="input !pl-10"
            placeholder="Search by name, venue or club"
            value={q}
            onChange={(e) => set("q", e.target.value)}
            aria-label="Search events"
          />
        </div>
        <select
          className="input sm:w-44"
          value={when}
          onChange={(e) => set("when", e.target.value)}
          aria-label="Filter by date"
        >
          {DATES.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {["", ...CATEGORIES].map((c) => (
          <button
            key={c || "all"}
            onClick={() => set("category", c)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${category === c ? "border-volt bg-volt text-white" : "border-ink/15 bg-white hover:border-volt"}`}
          >
            {c || "All"}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {loading ? (
          <Loading label="Loading events…" />
        ) : error ? (
          <ErrorBox message={error} onRetry={() => window.location.reload()} />
        ) : list.length === 0 ? (
          <Empty
            icon={CalendarX}
            title="No events match"
            text="Try a different search, category or date range."
          >
            <button
              className="btn btn-ghost mt-3"
              onClick={() => setSp({}, { replace: true })}
            >
              Clear filters
            </button>
          </Empty>
        ) : (
          <>
            <p className="mb-4 text-sm text-ink/60">
              {list.length} event{list.length !== 1 && "s"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((e) => (
                <EventCard key={e._id} e={e} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
