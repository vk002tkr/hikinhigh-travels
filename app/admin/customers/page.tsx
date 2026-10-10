
"use client";

import { useMemo, useState } from "react";

type CustomerStatus = "Active" | "Inactive";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  bookings: number;
  spent: number;
  status: CustomerStatus;
};

const initialCustomers: Customer[] = [
  {
    id: "CUS-1001",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "+91 98765 43210",
    joined: "02 Oct 2026",
    bookings: 4,
    spent: 98600,
    status: "Active",
  },
  {
    id: "CUS-1002",
    name: "Priya Verma",
    email: "priya@example.com",
    phone: "+91 98765 43211",
    joined: "28 Sep 2026",
    bookings: 3,
    spent: 76400,
    status: "Active",
  },
  {
    id: "CUS-1003",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    phone: "+91 98765 43212",
    joined: "21 Sep 2026",
    bookings: 2,
    spent: 42300,
    status: "Active",
  },
  {
    id: "CUS-1004",
    name: "Neha Gupta",
    email: "neha@example.com",
    phone: "+91 98765 43213",
    joined: "15 Sep 2026",
    bookings: 1,
    spent: 21900,
    status: "Inactive",
  },
  {
    id: "CUS-1005",
    name: "Karan Singh",
    email: "karan@example.com",
    phone: "+91 98765 43214",
    joined: "08 Sep 2026",
    bookings: 5,
    spent: 142500,
    status: "Active",
  },
  {
    id: "CUS-1006",
    name: "Simran Kaur",
    email: "simran@example.com",
    phone: "+91 98765 43215",
    joined: "01 Sep 2026",
    bookings: 2,
    spent: 51800,
    status: "Active",
  },
  {
    id: "CUS-1007",
    name: "Rohit Malhotra",
    email: "rohit@example.com",
    phone: "+91 98765 43216",
    joined: "25 Aug 2026",
    bookings: 0,
    spent: 0,
    status: "Inactive",
  },
  {
    id: "CUS-1008",
    name: "Ananya Kapoor",
    email: "ananya@example.com",
    phone: "+91 98765 43217",
    joined: "18 Aug 2026",
    bookings: 3,
    spent: 68700,
    status: "Active",
  },
];

const statusStyles: Record<CustomerStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconClass,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
  iconClass: string;
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
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${iconClass}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-5 text-xs text-slate-400">{description}</p>
    </div>
  );
}

export default function AdminCustomersPage() {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch = [
        customer.id,
        customer.name,
        customer.email,
        customer.phone,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const activeCount = customers.filter(
    (customer) => customer.status === "Active",
  ).length;

  const totalBookings = customers.reduce(
    (total, customer) => total + customer.bookings,
    0,
  );

  const totalSpent = customers.reduce(
    (total, customer) => total + customer.spent,
    0,
  );

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
  }

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">
            Manage customer profiles and monitor their travel activity.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Customer relationship management
          </p>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
        >
          Reset filters
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={customers.length.toLocaleString("en-IN")}
          description="Sample customer records"
          icon="♙"
          iconClass="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Active Customers"
          value={activeCount.toLocaleString("en-IN")}
          description="Customers marked active"
          icon="✓"
          iconClass="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings.toLocaleString("en-IN")}
          description="Bookings across sample customers"
          icon="▦"
          iconClass="bg-violet-50 text-violet-700"
        />
        <StatCard
          title="Customer Spend"
          value={formatCurrency(totalSpent)}
          description="Combined sample booking value"
          icon="₹"
          iconClass="bg-amber-50 text-amber-700"
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              All Customers
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              These are demonstration records, not live customer data.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
            <label className="flex h-11 min-w-0 items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-emerald-600">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
                className="shrink-0 text-slate-400"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone or ID..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                aria-label="Search customers"
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600"
              aria-label="Filter customers by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-4">Customer</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Joined</th>
                <th className="px-4 py-4">Bookings</th>
                <th className="px-4 py-4">Total Spend</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">
                        {initials(customer.name)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {customer.name}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-xs font-medium text-slate-700">
                      {customer.email}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {customer.phone}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-xs text-slate-500">
                    {customer.joined}
                  </td>

                  <td className="px-4 py-4 text-xs font-semibold text-slate-700">
                    {customer.bookings}
                  </td>

                  <td className="px-4 py-4 text-xs font-bold text-slate-800">
                    {formatCurrency(customer.spent)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[customer.status]}`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(customer)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    No customers match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6">
          <p className="text-[11px] text-slate-400">
            Showing {filteredCustomers.length} of {customers.length} sample
            customers
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Clear filters
          </button>
        </div>
      </section>

      {selectedCustomer && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Customer profile
                </p>
                <h2
                  id="customer-dialog-title"
                  className="mt-2 text-xl font-bold text-slate-900"
                >
                  {selectedCustomer.name}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {selectedCustomer.id}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close customer details"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs text-slate-400">Email address</p>
                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {selectedCustomer.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Phone number</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedCustomer.phone}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Total bookings</p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {selectedCustomer.bookings}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Total spend</p>
                  <p className="mt-2 break-words text-lg font-bold text-slate-900">
                    {formatCurrency(selectedCustomer.spent)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Registration date</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedCustomer.joined}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Account status</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[selectedCustomer.status]}`}
                  >
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs leading-5 text-slate-400">
              This profile uses sample data. No real customer information is
              loaded or changed.
            </p>

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="mt-5 w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Close profile
            </button>
          </div>
        </div>
      )}

      <footer className="flex flex-col gap-2 py-7 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Hikinhigh Travels. Admin dashboard preview.</p>
        <p>Frontend demo · Sample customer data only</p>
      </footer>
    </div>
  );
}
