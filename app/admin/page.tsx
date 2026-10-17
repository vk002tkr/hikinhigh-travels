"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type BookingRow = {
  id: string;
  booking_reference: string | null;
  customer_id: string | null;
  booking_type: string | null;
  destination_id: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  travel_date: string | null;
  total_amount: number | string | null;
  currency: string | null;
  payment_status: string | null;
  booking_status: string | null;
  created_at: string | null;
};

type ProfileRow = { id: string; full_name: string | null };
type DestinationRow = { id: string; name: string | null };

type DashboardBooking = {
  id: string;
  reference: string;
  customer: string;
  destination: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string | null;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const money = (amount: number, currency = "INR") => {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR", maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
};
const prettyStatus = (value: string | null | undefined) => {
  if (!value) return "Unknown";
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};
const statusClass = (status: string) => {
  const normalized = status.toLowerCase();
  if (["confirmed", "completed", "approved", "success", "successful"].includes(normalized)) return "bg-emerald-50 text-emerald-700";
  if (["pending", "requested", "processing", "awaiting payment", "awaiting_payment"].includes(normalized)) return "bg-amber-50 text-amber-700";
  if (["cancelled", "canceled", "rejected", "failed"].includes(normalized)) return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-600";
};
const isPaid = (status: string | null) => ["paid", "completed", "succeeded", "success", "successful", "captured"].includes((status ?? "").trim().toLowerCase());

function StatCard({ title, value, icon, tone, detail }: { title: string; value: string; icon: string; tone: string; detail: string }) {
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-md sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-500">{title}</p><h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{value}</h3></div><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}><span className="text-xl">{icon}</span></div></div><p className="mt-5 text-xs text-slate-400">{detail}</p></div>;
}

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This year");
  const [statusFilter, setStatusFilter] = useState("All bookings");
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [destinationCounts, setDestinationCounts] = useState<{ name: string; count: number }[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>(Array(12).fill(0));
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [revenueCurrency, setRevenueCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data: bookingRows, error: bookingsError, count }, { count: profilesCount, error: profilesError }] = await Promise.all([
        supabase.from("bookings").select("id, booking_reference, customer_id, booking_type, destination_id, check_in_date, check_out_date, travel_date, total_amount, currency, payment_status, booking_status, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(5000),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      if (bookingsError) throw new Error(`Bookings: ${bookingsError.message}`);
      if (profilesError) throw new Error(`Profiles: ${profilesError.message}`);

      const rows = (bookingRows ?? []) as BookingRow[];
      const customerIds = [...new Set(rows.map((row) => row.customer_id).filter((id): id is string => Boolean(id)))];
      const destinationIds = [...new Set(rows.map((row) => row.destination_id).filter((id): id is string => Boolean(id)))];
      const [profilesResult, destinationsResult] = await Promise.all([
        customerIds.length ? supabase.from("profiles").select("id, full_name").in("id", customerIds) : Promise.resolve({ data: [], error: null }),
        destinationIds.length ? supabase.from("destinations").select("id, name").in("id", destinationIds) : Promise.resolve({ data: [], error: null }),
      ]);
      if (profilesResult.error) throw new Error(`Customer names: ${profilesResult.error.message}`);
      if (destinationsResult.error) throw new Error(`Destinations: ${destinationsResult.error.message}`);

      const profileMap = new Map(((profilesResult.data ?? []) as ProfileRow[]).map((profile) => [profile.id, profile.full_name?.trim() || "Customer"]));
      const destinationMap = new Map(((destinationsResult.data ?? []) as DestinationRow[]).map((destination) => [destination.id, destination.name?.trim() || "Destination"]));
      const mapped: DashboardBooking[] = rows.map((row) => ({
        id: row.id,
        reference: row.booking_reference?.trim() || `BK-${row.id.slice(0, 8).toUpperCase()}`,
        customer: row.customer_id ? (profileMap.get(row.customer_id) || "Customer") : "Guest customer",
        destination: row.destination_id ? (destinationMap.get(row.destination_id) || prettyStatus(row.booking_type)) : prettyStatus(row.booking_type || "Travel booking"),
        date: row.travel_date || row.check_in_date || row.check_out_date || row.created_at || "—",
        amount: Number(row.total_amount ?? 0),
        currency: row.currency?.trim() || "INR",
        status: prettyStatus(row.booking_status),
        paymentStatus: row.payment_status ?? "",
        createdAt: row.created_at,
      }));
      setBookings(mapped);
      setBookingCount(count ?? rows.length);
      setCustomerCount(profilesCount ?? 0);
      setPendingCount(rows.filter((row) => ["pending", "requested", "processing", "awaiting_payment"].includes((row.booking_status ?? "").toLowerCase())).length);

      const destinationTally = new Map<string, number>();
      rows.forEach((row) => {
        const name = row.destination_id ? (destinationMap.get(row.destination_id) || "Other destinations") : prettyStatus(row.booking_type || "Other bookings");
        destinationTally.set(name, (destinationTally.get(name) ?? 0) + 1);
      });
      setDestinationCounts([...destinationTally.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 4));

      const currentYear = new Date().getFullYear();
      const revenueByMonth = Array(12).fill(0) as number[];
      let total = 0;
      let chosenCurrency = "INR";
      rows.forEach((row) => {
        if (!isPaid(row.payment_status)) return;
        const amount = Number(row.total_amount ?? 0);
        const currency = row.currency?.trim() || "INR";
        if (currency !== chosenCurrency && total === 0) chosenCurrency = currency;
        total += amount;
        if (row.created_at) {
          const created = new Date(row.created_at);
          if (created.getFullYear() === currentYear) revenueByMonth[created.getMonth()] += amount;
        }
      });
      setRevenueTotal(total);
      setRevenueCurrency(chosenCurrency);
      setMonthlyRevenue(revenueByMonth);
    } catch (loadError) {
      console.error("Admin dashboard load error:", loadError);
      setError(loadError instanceof Error ? loadError.message : "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const matchesSearch = `${booking.reference} ${booking.customer} ${booking.destination}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All bookings" || booking.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }).slice(0, 10), [bookings, search, statusFilter]);

  const chartData = useMemo(() => {
    const now = new Date();
    if (period === "Last 30 days") {
      const cutoff = new Date(now); cutoff.setDate(now.getDate() - 30);
      const value = bookings.filter((booking) => booking.createdAt && new Date(booking.createdAt) >= cutoff && isPaid(booking.paymentStatus)).reduce((sum, booking) => sum + booking.amount, 0);
      return [{ label: "Last 30 days", value }];
    }
    if (period === "Last 6 months") {
      return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
        const value = bookings.filter((booking) => {
          if (!booking.createdAt || !isPaid(booking.paymentStatus)) return false;
          const created = new Date(booking.createdAt);
          return created.getFullYear() === date.getFullYear() && created.getMonth() === date.getMonth();
        }).reduce((sum, booking) => sum + booking.amount, 0);
        return { label: months[date.getMonth()], value };
      });
    }
    return months.map((label, index) => ({ label, value: monthlyRevenue[index] }));
  }, [bookings, monthlyRevenue, period]);
  const maxChartValue = Math.max(1, ...chartData.map((item) => item.value));
  const currentYearRevenue = chartData.reduce((sum, item) => sum + item.value, 0);
  const maxDestinationCount = Math.max(1, ...destinationCounts.map((item) => item.count));

  return <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><p className="text-sm text-slate-500">Here&apos;s what&apos;s happening with your travel business today.</p><p className="mt-2 text-xs text-slate-400">Live data from your Hikinhigh database</p></div>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setSearch(""); setStatusFilter("All bookings"); setPeriod("This year"); void loadDashboard(); }} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800">↻ Refresh dashboard</button></div>
    </div>

    {error && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><p className="font-bold">Dashboard data could not be loaded</p><p className="mt-1">{error}</p><p className="mt-2 text-xs">Check the Supabase RLS policies for bookings, profiles and destinations.</p><button type="button" onClick={() => void loadDashboard()} className="mt-3 rounded-lg bg-rose-700 px-3 py-2 text-xs font-bold text-white">Try again</button></div>}

    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Bookings" value={loading ? "…" : bookingCount.toLocaleString("en-IN")} detail="All booking records" icon="▦" tone="bg-blue-50 text-blue-700" />
      <StatCard title="Collected Revenue" value={loading ? "…" : money(revenueTotal, revenueCurrency)} detail="Bookings with a paid payment status" icon="₹" tone="bg-emerald-50 text-emerald-700" />
      <StatCard title="Customer Profiles" value={loading ? "…" : customerCount.toLocaleString("en-IN")} detail="Profiles in the database" icon="♙" tone="bg-violet-50 text-violet-700" />
      <StatCard title="Pending Bookings" value={loading ? "…" : pendingCount.toLocaleString("en-IN")} detail="Bookings awaiting review" icon="◷" tone="bg-amber-50 text-amber-700" />
    </section>

    <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 xl:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-bold text-slate-900">Revenue Overview</h2><p className="mt-1 text-xs text-slate-400">Collected revenue by booking creation date</p></div><select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-emerald-500"><option>This year</option><option>Last 6 months</option><option>Last 30 days</option></select></div>
        <div className="mt-6 flex items-baseline gap-3"><span className="text-3xl font-extrabold tracking-tight text-slate-900">{loading ? "…" : money(currentYearRevenue, revenueCurrency)}</span><span className="text-xs text-slate-400">{period}</span></div>
        <div className="mt-5 flex h-[210px] w-full items-end gap-2 sm:gap-4">{chartData.map((item, index) => <div key={`${item.label}-${index}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><div className="flex h-full w-full items-end"><div title={`${item.label}: ${money(item.value, revenueCurrency)}`} className={`w-full rounded-t-md transition-all hover:opacity-75 ${index === chartData.length - 1 ? "bg-emerald-700" : "bg-emerald-100"}`} style={{ height: `${Math.max(item.value > 0 ? 3 : 0, item.value / maxChartValue * 100)}%` }} /></div><span className="text-[9px] font-medium text-slate-400 sm:text-[10px]">{item.label}</span></div>)}</div>
        {!loading && revenueTotal === 0 && <p className="mt-3 text-xs text-slate-400">No paid bookings found yet. The chart will populate when paid bookings are available.</p>}
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-400"><span className="h-2 w-2 rounded-sm bg-emerald-700" /> Revenue from paid bookings <span className="ml-auto">{period}</span></div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6"><div><h2 className="text-sm font-bold text-slate-900">Popular Destinations</h2><p className="mt-1 text-xs text-slate-400">Based on booking records</p></div>
        <div className="mt-6 space-y-6">{destinationCounts.map((destination) => <div key={destination.name}><div className="mb-2 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-lg">{destination.name.toLowerCase().includes("kashmir") ? "🏔️" : destination.name.toLowerCase().includes("beach") || destination.name.toLowerCase().includes("goa") ? "🏖️" : "📍"}</div><div className="min-w-0 flex-1"><p className="text-xs font-bold text-slate-800">{destination.name}</p><p className="mt-0.5 text-[10px] text-slate-400">Bookings</p></div><span className="text-xs font-bold text-slate-700">{destination.count}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${destination.count / maxDestinationCount * 100}%` }} /></div></div>)}{!loading && destinationCounts.length === 0 && <p className="text-xs text-slate-400">Destination insights will appear when bookings are added.</p>}</div>
        <div className="mt-6 rounded-xl bg-emerald-50 p-3"><p className="text-xs font-bold text-emerald-900">Destination insights</p><p className="mt-1 text-[11px] leading-5 text-emerald-800">{destinationCounts.length ? `${destinationCounts[0].name} has the most records in the current booking data.` : "No destination booking data available yet."}</p></div>
      </div>
    </section>

    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white"><div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6"><div><h2 className="text-sm font-bold text-slate-900">Recent Bookings</h2><p className="mt-1 text-xs text-slate-400">Latest reservations from the database</p></div><div className="flex flex-wrap gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bookings..." className="h-9 min-w-0 rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-emerald-500" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none focus:border-emerald-500"><option>All bookings</option><option>Confirmed</option><option>Pending</option><option>Cancelled</option><option>Completed</option></select><Link href="/admin/bookings" className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">View all</Link></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-4">Booking ID</th><th className="px-4 py-4">Customer</th><th className="px-4 py-4">Destination / Type</th><th className="px-4 py-4">Travel Date</th><th className="px-4 py-4">Amount</th><th className="px-4 py-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{loading && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">Loading bookings…</td></tr>}{!loading && filteredBookings.map((booking) => <tr key={booking.id} className="transition hover:bg-slate-50/70"><td className="px-6 py-4 text-xs font-bold text-emerald-800">{booking.reference}</td><td className="px-4 py-4 text-xs font-semibold text-slate-700">{booking.customer}</td><td className="px-4 py-4 text-xs text-slate-600">{booking.destination}</td><td className="px-4 py-4 text-xs text-slate-500">{booking.date === "—" ? "—" : new Date(booking.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td><td className="px-4 py-4 text-xs font-bold text-slate-800">{money(booking.amount, booking.currency)}</td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(booking.status)}`}>{booking.status}</span></td></tr>)}{!loading && filteredBookings.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">{bookings.length ? "No bookings match your search." : "No booking records found."}</td></tr>}</tbody></table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6"><p className="text-[11px] text-slate-400">Showing {filteredBookings.length} of {bookings.length} recent records</p><button type="button" onClick={() => { setSearch(""); setStatusFilter("All bookings"); }} className="text-xs font-semibold text-emerald-700 hover:underline">Clear filters</button></div>
    </section>
    <footer className="flex flex-col gap-2 py-7 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Hikinhigh Travels.</p><p>Dashboard connected to Supabase</p></footer>
  </div>;
}
