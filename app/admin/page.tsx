
"use client";

import { useState } from "react";
import Link from "next/link";

const bookings = [
  { id: "HKH-1048", customer: "Aarav Sharma", destination: "Kashmir", date: "18 Oct 2026", amount: 24500, status: "Confirmed" },
  { id: "HKH-1047", customer: "Priya Verma", destination: "Manali", date: "20 Oct 2026", amount: 38200, status: "Pending" },
  { id: "HKH-1046", customer: "Rahul Mehta", destination: "Goa", date: "22 Oct 2026", amount: 18600, status: "Confirmed" },
  { id: "HKH-1045", customer: "Neha Gupta", destination: "Jaipur", date: "24 Oct 2026", amount: 21900, status: "Cancelled" },
  { id: "HKH-1044", customer: "Karan Singh", destination: "Kerala", date: "26 Oct 2026", amount: 56400, status: "Pending" },
];

const destinations = [
  { name: "Kashmir", country: "India", bookings: 124, width: "88%", icon: "🏔️" },
  { name: "Manali", country: "India", bookings: 98, width: "70%", icon: "🌲" },
  { name: "Goa", country: "India", bookings: 76, width: "54%", icon: "🏖️" },
  { name: "Kerala", country: "India", bookings: 53, width: "38%", icon: "🌴" },
];

const chartValues = [35, 48, 40, 65, 53, 76, 60, 85, 68, 92, 73, 100];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function StatCard({
  title,
  value,
  change,
  icon,
  tone,
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </h3>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs">
        <span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
          {change}
        </span>
        <span className="text-slate-400">vs last month</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This year");
  const [statusFilter, setStatusFilter] = useState("All bookings");

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      `${booking.id} ${booking.customer} ${booking.destination}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All bookings" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your travel business today.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Travel operations overview
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatusFilter("All bookings");
            setPeriod("This year");
          }}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 sm:self-auto"
        >
          ↻ Reset dashboard
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Bookings" value="1,284" change="+12.8%" icon="▦" tone="bg-blue-50 text-blue-700" />
        <StatCard title="Total Revenue" value="₹24.8L" change="+8.4%" icon="₹" tone="bg-emerald-50 text-emerald-700" />
        <StatCard title="Total Customers" value="3,642" change="+16.2%" icon="♙" tone="bg-violet-50 text-violet-700" />
        <StatCard title="Pending Bookings" value="28" change="Needs review" icon="◷" tone="bg-amber-50 text-amber-700" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Revenue Overview</h2>
              <p className="mt-1 text-xs text-slate-400">Monthly revenue performance</p>
            </div>
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-emerald-500"
            >
              <option>This year</option>
              <option>Last 6 months</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">₹24,80,500</span>
            <span className="text-xs font-semibold text-emerald-700">↑ 8.4%</span>
          </div>

          <div className="mt-5 flex h-[210px] w-full items-end gap-2 sm:gap-4">
            {chartValues.map((value, index) => {
              const shown =
                period === "Last 30 days"
                  ? index >= 9
                  : period === "Last 6 months"
                    ? index >= 6
                    : true;

              return (
                <div
                  key={months[index]}
                  className={`flex h-full flex-1 flex-col items-center justify-end gap-2 ${!shown ? "opacity-20" : ""}`}
                >
                  <div className="flex h-full w-full items-end">
                    <div
                      title={`${months[index]}: ${value}%`}
                      className={`w-full rounded-t-md transition-all hover:opacity-75 ${index === 9 ? "bg-emerald-700" : "bg-emerald-100"}`}
                      style={{ height: `${value}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-medium text-slate-400 sm:text-[10px]">
                    {months[index]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-sm bg-emerald-700" /> Current month
            <span className="ml-3 h-2 w-2 rounded-sm bg-emerald-100" /> Other months
            <span className="ml-auto">{period}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Popular Destinations</h2>
            <p className="mt-1 text-xs text-slate-400">Top booked destinations</p>
          </div>

          <div className="mt-6 space-y-6">
            {destinations.map((destination) => (
              <div key={destination.name}>
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-lg">
                    {destination.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800">{destination.name}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{destination.country}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{destination.bookings}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-600" style={{ width: destination.width }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-emerald-50 p-3">
            <p className="text-xs font-bold text-emerald-900">Destination insights</p>
            <p className="mt-1 text-[11px] leading-5 text-emerald-800">
              Kashmir leads this sample dataset in bookings.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Bookings</h2>
            <p className="mt-1 text-xs text-slate-400">A quick look at recent customer reservations</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search bookings..."
              className="h-9 min-w-0 rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-emerald-500"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none focus:border-emerald-500"
            >
              <option>All bookings</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            <Link
              href="/admin/bookings"
              className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Destination</th>
                <th className="px-4 py-4">Travel Date</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-4 text-xs font-bold text-emerald-800">{booking.id}</td>
                  <td className="px-4 py-4 text-xs font-semibold text-slate-700">{booking.customer}</td>
                  <td className="px-4 py-4 text-xs text-slate-600">{booking.destination}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{booking.date}</td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-800">₹{booking.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      booking.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : booking.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    No bookings match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6">
          <p className="text-[11px] text-slate-400">
            Showing {filteredBookings.length} of {bookings.length} sample bookings
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All bookings");
            }}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Clear filters
          </button>
        </div>
      </section>

      <footer className="flex flex-col gap-2 py-7 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Hikinhigh Travels. Admin dashboard preview.</p>
        <p>Frontend demo · Sample data only</p>
      </footer>
    </div>
  );
}
