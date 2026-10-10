
"use client";

import { useMemo, useState } from "react";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

type Booking = {
  id: string;
  customer: string;
  email: string;
  destination: string;
  travelDate: string;
  guests: number;
  amount: number;
  status: BookingStatus;
};

const initialBookings: Booking[] = [
  {
    id: "HKH-1048",
    customer: "Aarav Sharma",
    email: "aarav@example.com",
    destination: "Kashmir",
    travelDate: "18 Oct 2026",
    guests: 2,
    amount: 24500,
    status: "Confirmed",
  },
  {
    id: "HKH-1047",
    customer: "Priya Verma",
    email: "priya@example.com",
    destination: "Manali",
    travelDate: "20 Oct 2026",
    guests: 4,
    amount: 38200,
    status: "Pending",
  },
  {
    id: "HKH-1046",
    customer: "Rahul Mehta",
    email: "rahul@example.com",
    destination: "Goa",
    travelDate: "22 Oct 2026",
    guests: 2,
    amount: 18600,
    status: "Confirmed",
  },
  {
    id: "HKH-1045",
    customer: "Neha Gupta",
    email: "neha@example.com",
    destination: "Jaipur",
    travelDate: "24 Oct 2026",
    guests: 3,
    amount: 21900,
    status: "Cancelled",
  },
  {
    id: "HKH-1044",
    customer: "Karan Singh",
    email: "karan@example.com",
    destination: "Kerala",
    travelDate: "26 Oct 2026",
    guests: 5,
    amount: 56400,
    status: "Pending",
  },
];

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

export default function AdminBookingsPage() {
  const [bookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [destinationFilter, setDestinationFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const destinations = Array.from(
    new Set(bookings.map((booking) => booking.destination))
  );

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.trim().toLowerCase();

      const matchesSearch = [
        booking.id,
        booking.customer,
        booking.email,
        booking.destination,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      const matchesDestination =
        destinationFilter === "All" ||
        booking.destination === destinationFilter;

      return matchesSearch && matchesStatus && matchesDestination;
    });
  }, [bookings, search, statusFilter, destinationFilter]);

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const bookingValue = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((total, booking) => total + booking.amount, 0);

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-6 text-slate-800 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs text-slate-400">
              Hikinhigh Travels / Admin / Bookings
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Bookings Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Search, review and monitor travel reservations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setDestinationFilter("All");
            }}
            className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Reset filters
          </button>
        </div>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Bookings",
              value: bookings.length.toString(),
              note: "Sample reservations",
            },
            {
              label: "Confirmed",
              value: confirmedCount.toString(),
              note: "Confirmed sample bookings",
            },
            {
              label: "Pending",
              value: pendingCount.toString(),
              note: "Awaiting review",
            },
            {
              label: "Booking Value",
              value: `₹${bookingValue.toLocaleString("en-IN")}`,
              note: "Excluding cancellations",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-3 break-words text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-3 text-xs text-slate-400">{stat.note}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">All Bookings</h2>
            <p className="mt-1 text-xs text-slate-400">
              These are demonstration records, not live customer bookings.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ID, customer or destination..."
                className="min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="All">All statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={destinationFilter}
                onChange={(event) =>
                  setDestinationFilter(event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="All">All destinations</option>
                {destinations.map((destination) => (
                  <option key={destination} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Booking / Customer</th>
                  <th className="px-4 py-4">Destination</th>
                  <th className="px-4 py-4">Travel Date</th>
                  <th className="px-4 py-4">Guests</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-emerald-800">
                        {booking.id}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {booking.customer}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {booking.email}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {booking.destination}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-500">
                      {booking.travelDate}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {booking.guests}
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold">
                      ₹{booking.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-emerald-600 hover:text-emerald-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredBookings.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-slate-400"
                    >
                      No bookings match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400">
            Showing {filteredBookings.length} of {bookings.length} sample bookings
          </div>
        </section>

        {selectedBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-dialog-title"
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Booking details
                  </p>
                  <h2
                    id="booking-dialog-title"
                    className="mt-2 text-xl font-bold text-slate-900"
                  >
                    {selectedBooking.id}
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Close details"
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-lg px-3 py-2 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-400">Customer</p>
                  <p className="mt-1 text-sm font-semibold">
                    {selectedBooking.customer}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedBooking.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Destination</p>
                    <p className="mt-1 text-sm font-semibold">
                      {selectedBooking.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Travel date</p>
                    <p className="mt-1 text-sm font-semibold">
                      {selectedBooking.travelDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Guests</p>
                    <p className="mt-1 text-sm font-semibold">
                      {selectedBooking.guests}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Amount</p>
                    <p className="mt-1 text-sm font-semibold">
                      ₹{selectedBooking.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs text-slate-400">Status</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedBooking.status]}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-400">
                This is sample data. No real booking or customer record is changed.
              </p>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="mt-5 w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Close details
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
