"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

type CustomerStatus = "Active" | "Inactive";
type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string | null;
  bookings: number;
  spent: number;
  status: CustomerStatus;
};
type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
  is_active: boolean | null;
  created_at: string | null;
};
type BookingRow = {
  customer_id: string | null;
  total_amount: number | string | null;
  booking_status: string | null;
};

const statusStyles: Record<CustomerStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
};

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "C";
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function StatCard({ title, value, description, icon, iconClass }: { title: string; value: string; description: string; icon: string; iconClass: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-500">{title}</p><h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{value}</h3></div><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${iconClass}`}>{icon}</div></div>
      <p className="mt-5 text-xs text-slate-400">{description}</p>
    </div>
  );
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, phone, role, is_active, created_at")
        .order("created_at", { ascending: false });
      if (profilesError) throw profilesError;

      const profileRows = (profilesData ?? []) as ProfileRow[];
      // Customer view must not count admin/staff profiles as customers.
      const customerProfiles = profileRows.filter((profile) => {
        const role = String(profile.role ?? "customer").toLowerCase();
        return role !== "admin" && role !== "staff";
      });

      const customerIds = customerProfiles.map((profile) => profile.id);
      let bookingRows: BookingRow[] = [];
      if (customerIds.length) {
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("customer_id, total_amount, booking_status")
          .in("customer_id", customerIds);
        if (bookingsError) throw bookingsError;
        bookingRows = (bookingsData ?? []) as BookingRow[];
      }

      const bookingSummary = new Map<string, { count: number; spent: number }>();
      for (const booking of bookingRows) {
        if (!booking.customer_id) continue;
        const current = bookingSummary.get(booking.customer_id) ?? { count: 0, spent: 0 };
        current.count += 1;
        // Sum recorded booking amounts; this is booking value, not necessarily collected revenue.
        current.spent += Number(booking.total_amount ?? 0) || 0;
        bookingSummary.set(booking.customer_id, current);
      }

      setCustomers(customerProfiles.map((profile) => {
        const summary = bookingSummary.get(profile.id) ?? { count: 0, spent: 0 };
        return {
          id: profile.id,
          name: profile.full_name?.trim() || "Unnamed customer",
          // Email is not stored in the profiles columns available to this page.
          email: "",
          phone: profile.phone?.trim() || "—",
          joined: profile.created_at,
          bookings: summary.count,
          spent: summary.spent,
          status: profile.is_active === false ? "Inactive" : "Active",
        };
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load customers from Supabase.");
      setCustomers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadCustomers(); }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesSearch = [customer.id, customer.name, customer.email, customer.phone].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = statusFilter === "All" || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const activeCount = customers.filter((customer) => customer.status === "Active").length;
  const totalBookings = customers.reduce((total, customer) => total + customer.bookings, 0);
  const totalSpent = customers.reduce((total, customer) => total + customer.spent, 0);

  function resetFilters() { setSearch(""); setStatusFilter("All"); }

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="text-sm text-slate-500">Manage customer profiles and monitor their travel activity.</p><p className="mt-2 text-xs text-slate-400">Customer relationship management · Live Supabase data</p></div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void loadCustomers(true)} disabled={loading || refreshing} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">{refreshing ? "Refreshing…" : "Refresh data"}</button>
          <button type="button" onClick={resetFilters} className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800">Reset filters</button>
        </div>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><p className="font-bold">Could not load customer data</p><p className="mt-1 break-words">{error}</p><p className="mt-2 text-xs">Check Supabase permissions and the profiles/bookings table policies.</p></div>}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Customers" value={loading ? "—" : customers.length.toLocaleString("en-IN")} description="Customer profiles excluding admin and staff" icon="♙" iconClass="bg-blue-50 text-blue-700" />
        <StatCard title="Active Customers" value={loading ? "—" : activeCount.toLocaleString("en-IN")} description="Customer accounts marked active" icon="✓" iconClass="bg-emerald-50 text-emerald-700" />
        <StatCard title="Total Bookings" value={loading ? "—" : totalBookings.toLocaleString("en-IN")} description="Bookings linked to customer profiles" icon="▦" iconClass="bg-violet-50 text-violet-700" />
        <StatCard title="Booking Value" value={loading ? "—" : formatCurrency(totalSpent)} description="Recorded total amounts, not confirmed collected revenue" icon="₹" iconClass="bg-amber-50 text-amber-700" />
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div><h2 className="text-sm font-bold text-slate-900">All Customers</h2><p className="mt-1 text-xs text-slate-400">Live records from Supabase. No demonstration customers are used.</p></div>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
            <label className="flex h-11 min-w-0 items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-emerald-600"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="shrink-0 text-slate-400"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone or customer ID..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" aria-label="Search customers" /></label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600" aria-label="Filter customers by status"><option value="All">All statuses</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select>
          </div>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead><tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400"><th className="px-5 py-4">Customer</th><th className="px-4 py-4">Contact</th><th className="px-4 py-4">Joined</th><th className="px-4 py-4">Bookings</th><th className="px-4 py-4">Booking Value</th><th className="px-4 py-4">Status</th><th className="px-5 py-4">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">Loading customers…</td></tr> : filteredCustomers.map((customer) => <tr key={customer.id} className="transition hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">{initials(customer.name)}</div><div><p className="text-xs font-bold text-slate-800">{customer.name}</p><p className="mt-1 max-w-[220px] truncate text-[10px] text-slate-400" title={customer.id}>{customer.id}</p></div></div></td>
              <td className="px-4 py-4"><p className="text-xs font-medium text-slate-700">{customer.email || "Email not available"}</p><p className="mt-1 text-[11px] text-slate-400">{customer.phone}</p></td><td className="px-4 py-4 text-xs text-slate-500">{formatDate(customer.joined)}</td><td className="px-4 py-4 text-xs font-semibold text-slate-700">{customer.bookings}</td><td className="px-4 py-4 text-xs font-bold text-slate-800">{formatCurrency(customer.spent)}</td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[customer.status]}`}>{customer.status}</span></td><td className="px-5 py-4"><button type="button" onClick={() => setSelectedCustomer(customer)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700">View details</button></td></tr>)}
            {!loading && filteredCustomers.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">{error ? "Customer data could not be loaded." : customers.length === 0 ? "No customer profiles found." : "No customers match your search or filters."}</td></tr>}
          </tbody></table></div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6"><p className="text-[11px] text-slate-400">Showing {loading ? "—" : filteredCustomers.length} of {loading ? "—" : customers.length} customers</p><button type="button" onClick={resetFilters} className="text-xs font-semibold text-emerald-700 hover:underline">Clear filters</button></div>
      </section>

      {selectedCustomer && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setSelectedCustomer(null)}><div role="dialog" aria-modal="true" aria-labelledby="customer-dialog-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Customer profile</p><h2 id="customer-dialog-title" className="mt-2 text-xl font-bold text-slate-900">{selectedCustomer.name}</h2><p className="mt-1 break-all text-xs text-slate-400">{selectedCustomer.id}</p></div><button type="button" aria-label="Close customer details" onClick={() => setSelectedCustomer(null)} className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100">✕</button></div>
        <div className="mt-6 space-y-5"><div><p className="text-xs text-slate-400">Email address</p><p className="mt-1 break-all text-sm font-semibold text-slate-800">{selectedCustomer.email || "Not available in profiles table"}</p></div><div><p className="text-xs text-slate-400">Phone number</p><p className="mt-1 text-sm font-semibold text-slate-800">{selectedCustomer.phone}</p></div><div className="grid grid-cols-2 gap-4"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Total bookings</p><p className="mt-2 text-xl font-bold text-slate-900">{selectedCustomer.bookings}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Booking value</p><p className="mt-2 break-words text-lg font-bold text-slate-900">{formatCurrency(selectedCustomer.spent)}</p></div></div><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-slate-400">Registration date</p><p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(selectedCustomer.joined)}</p></div><div><p className="text-xs text-slate-400">Account status</p><span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[selectedCustomer.status]}`}>{selectedCustomer.status}</span></div></div></div>
        <p className="mt-6 text-xs leading-5 text-slate-400">Profile and booking information is loaded from Supabase. Email is not available in the current profiles schema.</p><button type="button" onClick={() => setSelectedCustomer(null)} className="mt-5 w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">Close profile</button></div></div>}

      <footer className="flex flex-col gap-2 py-7 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Hikinhigh Travels. Admin customer management.</p><p>Live customer data · Supabase</p></footer>
    </div>
  );
}
