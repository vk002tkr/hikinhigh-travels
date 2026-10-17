"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Status = "Confirmed" | "Pending" | "Cancelled" | "Other";
type Booking = {
  id: string; reference: string; customer: string; contact: string;
  destination: string; travelDate: string | null; guests: number;
  amount: number; currency: string; status: Status; rawStatus: string;
  bookingType: string; paymentStatus: string; createdAt: string | null;
};
type Profile = { id: string; full_name: string | null; phone: string | null };
type Destination = { id: string; name: string | null };

const statusStyles: Record<Status, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Cancelled: "bg-rose-50 text-rose-700",
  Other: "bg-slate-100 text-slate-700",
};

function normalizeStatus(value: string | null): Status {
  const status = (value ?? "").trim().toLowerCase();
  if (["confirmed", "confirm", "booked", "complete", "completed"].includes(status)) return "Confirmed";
  if (["pending", "requested", "under_review", "under review", "awaiting_confirmation"].includes(status)) return "Pending";
  if (["cancelled", "canceled", "rejected", "failed"].includes(status)) return "Cancelled";
  return "Other";
}
function label(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, c => c.toUpperCase());
}
function formatDate(value: string | null) {
  if (!value) return "Not specified";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
function money(amount: number, currency: string) {
  const code = (currency || "INR").toUpperCase();
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency: code, maximumFractionDigits: 2 }).format(amount); }
  catch { return `${code} ${amount.toLocaleString("en-IN")}`; }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [destinationFilter, setDestinationFilter] = useState("All");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const { data: rows, error: bookingError } = await supabase
        .from("bookings")
        .select("id, booking_reference, customer_id, booking_type, destination_id, check_in_date, check_out_date, travel_date, adults, children, infants, total_amount, currency, payment_status, booking_status, created_at")
        .order("created_at", { ascending: false });
      if (bookingError) throw new Error(`Bookings: ${bookingError.message}`);
      const list = rows ?? [];
      const customerIds = [...new Set(list.map((r: any) => r.customer_id).filter(Boolean))] as string[];
      const destinationIds = [...new Set(list.map((r: any) => r.destination_id).filter(Boolean))] as string[];
      const [profilesResult, destinationsResult] = await Promise.all([
        customerIds.length ? supabase.from("profiles").select("id, full_name, phone").in("id", customerIds) : Promise.resolve({ data: [], error: null } as any),
        destinationIds.length ? supabase.from("destinations").select("id, name").in("id", destinationIds) : Promise.resolve({ data: [], error: null } as any),
      ]);
      if (profilesResult.error) throw new Error(`Customer profiles: ${profilesResult.error.message}`);
      if (destinationsResult.error) throw new Error(`Destinations: ${destinationsResult.error.message}`);
      const profiles = new Map<string, Profile>((((profilesResult.data ?? []) as Profile[]).map(p => [p.id, p])));
      const destinations = new Map<string, Destination>((((destinationsResult.data ?? []) as Destination[]).map(d => [d.id, d])));
      setBookings(list.map((r: any) => {
        const profile = r.customer_id ? profiles.get(r.customer_id) : undefined;
        const destination = r.destination_id ? destinations.get(r.destination_id) : undefined;
        const rawStatus = String(r.booking_status ?? "unknown");
        return {
          id: String(r.id),
          reference: String(r.booking_reference || `BK-${String(r.id).slice(0, 8).toUpperCase()}`),
          customer: profile?.full_name?.trim() || "Customer name unavailable",
          contact: profile?.phone?.trim() || "Contact details unavailable",
          destination: destination?.name?.trim() || label(String(r.booking_type || "Travel booking")),
          travelDate: r.travel_date || r.check_in_date || null,
          guests: Number(r.adults ?? 0) + Number(r.children ?? 0) + Number(r.infants ?? 0),
          amount: Number(r.total_amount ?? 0), currency: String(r.currency || "INR"),
          status: normalizeStatus(rawStatus), rawStatus,
          bookingType: label(String(r.booking_type || "Booking")),
          paymentStatus: String(r.payment_status || "unknown"), createdAt: r.created_at ?? null,
        };
      }));
    } catch (e) {
      setBookings([]);
      setError(e instanceof Error ? e.message : "Unable to load bookings from Supabase.");
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { void loadBookings(); }, [loadBookings]);
  const destinations = useMemo(() => [...new Set(bookings.map(b => b.destination).filter(Boolean))].sort(), [bookings]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter(b => {
      const matchesSearch = [b.reference, b.customer, b.contact, b.destination, b.bookingType].some(v => v.toLowerCase().includes(query));
      const matchesStatus = statusFilter === "All" || (statusFilter === "Other" ? b.status === "Other" : b.status === statusFilter);
      return matchesSearch && matchesStatus && (destinationFilter === "All" || b.destination === destinationFilter);
    });
  }, [bookings, search, statusFilter, destinationFilter]);
  const confirmed = bookings.filter(b => b.status === "Confirmed").length;
  const pending = bookings.filter(b => b.status === "Pending").length;
  const bookingValue = bookings.filter(b => b.status !== "Cancelled").reduce((sum, b) => sum + b.amount, 0);
  const currency = bookings[0]?.currency || "INR";

  return <main className="min-h-screen bg-[#f6f8fb] px-4 py-6 text-slate-800 sm:px-7 lg:px-9">
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="text-xs text-slate-400">Hikinhigh Travels / Admin / Bookings</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Bookings Management</h1><p className="mt-2 text-sm text-slate-500">Live reservations from your Hikinhigh database.</p></div>
        <button type="button" disabled={loading || refreshing} onClick={() => void loadBookings(true)} className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">{refreshing ? "Refreshing..." : "Refresh bookings"}</button>
      </div>
      {error && <div role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800"><p className="font-semibold">Bookings could not be loaded</p><p className="mt-2 break-words text-sm">{error}</p><p className="mt-2 text-sm">Check Supabase table permissions and RLS policies. No booking records were changed.</p><button type="button" onClick={() => void loadBookings(true)} className="mt-4 rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white">Try again</button></div>}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[{ label: "Total Bookings", value: loading ? "…" : bookings.length.toLocaleString("en-IN"), note: "Live database records" }, { label: "Confirmed", value: loading ? "…" : confirmed.toLocaleString("en-IN"), note: "Confirmed bookings" }, { label: "Pending", value: loading ? "…" : pending.toLocaleString("en-IN"), note: "Awaiting review" }, { label: "Booking Value", value: loading ? "…" : money(bookingValue, currency), note: "Excluding cancelled bookings" }].map(s => <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{s.label}</p><p className="mt-3 break-words text-2xl font-bold text-slate-900">{s.value}</p><p className="mt-3 text-xs text-slate-400">{s.note}</p></div>)}
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">All Bookings</h2><p className="mt-1 text-xs text-slate-400">Live Supabase records. This page does not create, update, or delete bookings.</p>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, customer or destination..." aria-label="Search bookings" className="min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label="Filter by status" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600"><option value="All">All statuses</option><option value="Confirmed">Confirmed</option><option value="Pending">Pending</option><option value="Cancelled">Cancelled</option><option value="Other">Other statuses</option></select>
            <select value={destinationFilter} onChange={e => setDestinationFilter(e.target.value)} aria-label="Filter by destination" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600"><option value="All">All destinations</option>{destinations.map(d => <option key={d} value={d}>{d}</option>)}</select>
          </div><button type="button" onClick={() => { setSearch(""); setStatusFilter("All"); setDestinationFilter("All"); }} className="mt-3 text-sm font-medium text-emerald-700 hover:text-emerald-900">Reset filters</button>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Booking / Customer</th><th className="px-4 py-4">Destination</th><th className="px-4 py-4">Travel Date</th><th className="px-4 py-4">Guests</th><th className="px-4 py-4">Amount</th><th className="px-4 py-4">Status</th><th className="px-5 py-4">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">Loading bookings from Supabase…</td></tr> : filtered.map(b => <tr key={b.id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="text-xs font-bold text-emerald-800">{b.reference}</p><p className="mt-1 text-sm font-semibold">{b.customer}</p><p className="mt-1 text-xs text-slate-400">{b.contact}</p></td><td className="px-4 py-4 text-sm"><p>{b.destination}</p><p className="mt-1 text-xs text-slate-400">{b.bookingType}</p></td><td className="px-4 py-4 text-sm text-slate-500">{formatDate(b.travelDate)}</td><td className="px-4 py-4 text-sm">{b.guests}</td><td className="px-4 py-4 text-sm font-semibold">{money(b.amount, b.currency)}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}>{b.status === "Other" ? label(b.rawStatus) : b.status}</span></td><td className="px-5 py-4"><button type="button" onClick={() => setSelected(b)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-emerald-600 hover:text-emerald-700">View</button></td></tr>)}
            {!loading && !error && filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">{bookings.length === 0 ? "No bookings exist in the database yet." : "No bookings match your filters."}</td></tr>}
          </tbody></table></div>
        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400">{loading ? "Loading records…" : `Showing ${filtered.length} of ${bookings.length} live booking records`}</div>
      </section>
      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setSelected(null)}><div role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title" onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Booking details</p><h2 id="booking-dialog-title" className="mt-2 break-all text-xl font-bold text-slate-900">{selected.reference}</h2></div><button type="button" aria-label="Close details" onClick={() => setSelected(null)} className="rounded-lg px-3 py-2 hover:bg-slate-100">✕</button></div>
        <div className="mt-5 space-y-4"><div><p className="text-xs text-slate-400">Customer</p><p className="mt-1 text-sm font-semibold">{selected.customer}</p><p className="mt-1 text-xs text-slate-500">{selected.contact}</p></div><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-slate-400">Destination / Type</p><p className="mt-1 text-sm font-semibold">{selected.destination}</p><p className="mt-1 text-xs text-slate-500">{selected.bookingType}</p></div><div><p className="text-xs text-slate-400">Travel date</p><p className="mt-1 text-sm font-semibold">{formatDate(selected.travelDate)}</p></div><div><p className="text-xs text-slate-400">Guests</p><p className="mt-1 text-sm font-semibold">{selected.guests}</p></div><div><p className="text-xs text-slate-400">Amount</p><p className="mt-1 text-sm font-semibold">{money(selected.amount, selected.currency)}</p></div><div><p className="text-xs text-slate-400">Booking status</p><p className="mt-1 text-sm font-semibold">{label(selected.rawStatus)}</p></div><div><p className="text-xs text-slate-400">Payment status</p><p className="mt-1 text-sm font-semibold">{label(selected.paymentStatus)}</p></div><div className="col-span-2"><p className="text-xs text-slate-400">Created at</p><p className="mt-1 text-sm font-semibold">{selected.createdAt ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(selected.createdAt)) : "Not available"}</p></div></div></div><p className="mt-5 text-xs leading-5 text-slate-400">This is a live database record. Viewing details does not modify the booking.</p><button type="button" onClick={() => setSelected(null)} className="mt-5 w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Close details</button></div></div>}
    </div>
  </main>;
}
