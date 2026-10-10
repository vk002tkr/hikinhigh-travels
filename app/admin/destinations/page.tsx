
"use client";

import { useMemo, useState } from "react";

type DestinationStatus = "Active" | "Draft";

type Destination = {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  price: number;
  bookings: number;
  status: DestinationStatus;
  image: string;
};

const initialDestinations: Destination[] = [
  {
    id: "DST-001",
    name: "Kashmir",
    country: "India",
    region: "North India",
    description: "Discover snow-capped mountains, lakes and scenic valleys.",
    price: 24999,
    bookings: 124,
    status: "Active",
    image: "🏔️",
  },
  {
    id: "DST-002",
    name: "Manali",
    country: "India",
    region: "North India",
    description: "Mountain escapes, pine forests and beautiful landscapes.",
    price: 15999,
    bookings: 98,
    status: "Active",
    image: "🌲",
  },
  {
    id: "DST-003",
    name: "Goa",
    country: "India",
    region: "West India",
    description: "Relax on golden beaches and explore coastal experiences.",
    price: 12999,
    bookings: 76,
    status: "Active",
    image: "🏖️",
  },
  {
    id: "DST-004",
    name: "Kerala",
    country: "India",
    region: "South India",
    description: "Experience backwaters, green hills and peaceful retreats.",
    price: 21999,
    bookings: 53,
    status: "Active",
    image: "🌴",
  },
  {
    id: "DST-005",
    name: "Jaipur",
    country: "India",
    region: "West India",
    description: "Explore royal palaces, forts and colourful local culture.",
    price: 9999,
    bookings: 42,
    status: "Draft",
    image: "🏰",
  },
  {
    id: "DST-006",
    name: "Bali",
    country: "Indonesia",
    region: "Southeast Asia",
    description: "Discover tropical beaches, temples and island adventures.",
    price: 45999,
    bookings: 37,
    status: "Active",
    image: "🌊",
  },
];

const statusStyles: Record<DestinationStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Draft: "bg-amber-50 text-amber-700",
};

const emptyForm = {
  name: "",
  country: "India",
  region: "",
  description: "",
  price: "",
  status: "Draft" as DestinationStatus,
  image: "📍",
};

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] =
    useState<Destination[]>(initialDestinations);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [viewDestination, setViewDestination] =
    useState<Destination | null>(null);

  const countries = Array.from(
    new Set(destinations.map((destination) => destination.country)),
  ).sort();

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return destinations.filter((destination) => {
      const matchesSearch = [
        destination.name,
        destination.country,
        destination.region,
        destination.description,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesCountry =
        countryFilter === "All" ||
        destination.country === countryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        destination.status === statusFilter;

      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [destinations, search, countryFilter, statusFilter]);

  const activeCount = destinations.filter(
    (destination) => destination.status === "Active",
  ).length;

  const totalBookings = destinations.reduce(
    (total, destination) => total + destination.bookings,
    0,
  );

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(destination: Destination) {
    setEditingId(destination.id);
    setForm({
      name: destination.name,
      country: destination.country,
      region: destination.region,
      description: destination.description,
      price: String(destination.price),
      status: destination.status,
      image: destination.image,
    });
    setFormError("");
    setModalOpen(true);
  }

  function saveDestination(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const country = form.country.trim();
    const region = form.region.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!name || !country || !region || !description) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setFormError("Enter a valid non-negative starting price.");
      return;
    }

    if (editingId) {
      setDestinations((current) =>
        current.map((destination) =>
          destination.id === editingId
            ? {
                ...destination,
                name,
                country,
                region,
                description,
                price,
                status: form.status,
                image: form.image.trim() || "📍",
              }
            : destination,
        ),
      );
    } else {
      const newDestination: Destination = {
        id: `DST-${Date.now().toString().slice(-6)}`,
        name,
        country,
        region,
        description,
        price,
        bookings: 0,
        status: form.status,
        image: form.image.trim() || "📍",
      };

      setDestinations((current) => [newDestination, ...current]);
    }

    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  }

  function deleteDestination(destination: Destination) {
    const confirmed = window.confirm(
      `Delete ${destination.name} from this sample dashboard?`,
    );

    if (!confirmed) return;

    setDestinations((current) =>
      current.filter((item) => item.id !== destination.id),
    );

    if (viewDestination?.id === destination.id) {
      setViewDestination(null);
    }
  }

  function resetFilters() {
    setSearch("");
    setCountryFilter("All");
    setStatusFilter("All");
  }

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">
            Manage travel destinations, regions and starting prices.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Destination management workspace
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
        >
          <span className="text-lg">+</span>
          Add destination
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Destinations",
            value: destinations.length.toLocaleString("en-IN"),
            note: "Available in this workspace",
            icon: "⌖",
            tone: "bg-blue-50 text-blue-700",
          },
          {
            title: "Active Destinations",
            value: activeCount.toLocaleString("en-IN"),
            note: "Marked active",
            icon: "✓",
            tone: "bg-emerald-50 text-emerald-700",
          },
          {
            title: "Draft Destinations",
            value: (destinations.length - activeCount).toLocaleString("en-IN"),
            note: "Not yet published",
            icon: "✎",
            tone: "bg-amber-50 text-amber-700",
          },
          {
            title: "Total Bookings",
            value: totalBookings.toLocaleString("en-IN"),
            note: "Across sample destinations",
            icon: "▦",
            tone: "bg-violet-50 text-violet-700",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-md sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${stat.tone}`}
              >
                {stat.icon}
              </div>
            </div>
            <p className="mt-5 text-xs text-slate-400">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              All Destinations
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Manage your destination catalogue. Records currently use local
              sample state.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_200px_180px_auto]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search destinations..."
              aria-label="Search destinations"
              className="h-11 min-w-0 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600"
            />

            <select
              value={countryFilter}
              onChange={(event) => setCountryFilter(event.target.value)}
              aria-label="Filter by country"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600"
            >
              <option value="All">All countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Reset filters
            </button>
          </div>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No destinations found
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3 sm:p-6">
            {filteredDestinations.map((destination) => (
              <article
                key={destination.id}
                className="overflow-hidden rounded-2xl border border-slate-200 transition hover:border-emerald-200 hover:shadow-md"
              >
                <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50">
                  <span className="text-6xl" aria-hidden="true">
                    {destination.image}
                  </span>
                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold ${statusStyles[destination.status]}`}
                  >
                    {destination.status}
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                    {destination.id}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-slate-900">
                        {destination.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {destination.region}, {destination.country}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-slate-400">Starting at</p>
                      <p className="mt-1 text-sm font-bold text-emerald-800">
                        {formatCurrency(destination.price)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 min-h-[40px] text-xs leading-5 text-slate-500">
                    {destination.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] text-slate-400">Bookings</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {destination.bookings}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setViewDestination(destination)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-600 hover:text-emerald-700"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(destination)}
                        className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDestination(destination)}
                        className="rounded-lg border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:px-6">
          Showing {filteredDestinations.length} of {destinations.length} sample
          destinations
        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-form-title"
            onClick={(event) => event.stopPropagation()}
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="destination-form-title"
                  className="text-xl font-bold text-slate-900"
                >
                  {editingId ? "Edit destination" : "Add destination"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Enter the destination details below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close form"
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveDestination} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    Destination name *
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="e.g. Kashmir"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    Country *
                  </span>
                  <input
                    required
                    value={form.country}
                    onChange={(event) =>
                      setForm({ ...form, country: event.target.value })
                    }
                    placeholder="e.g. India"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    Region *
                  </span>
                  <input
                    required
                    value={form.region}
                    onChange={(event) =>
                      setForm({ ...form, region: event.target.value })
                    }
                    placeholder="e.g. North India"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    Starting price (₹) *
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="e.g. 24999"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    Icon or emoji
                  </span>
                  <input
                    value={form.image}
                    onChange={(event) =>
                      setForm({ ...form, image: event.target.value })
                    }
                    placeholder="🏔️"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    Publication status
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as DestinationStatus,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-600">
                  Description *
                </span>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Describe this destination..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </label>

              {formError && (
                <p role="alert" className="text-xs font-medium text-rose-600">
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  {editingId ? "Save changes" : "Add destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewDestination && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setViewDestination(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-details-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                  {viewDestination.image}
                </div>
                <div>
                  <h2
                    id="destination-details-title"
                    className="text-xl font-bold text-slate-900"
                  >
                    {viewDestination.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {viewDestination.region}, {viewDestination.country}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewDestination(null)}
                aria-label="Close destination details"
                className="rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-600">
              {viewDestination.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Starting price</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatCurrency(viewDestination.price)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Bookings</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {viewDestination.bookings}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                ID: {viewDestination.id}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[viewDestination.status]}`}
              >
                {viewDestination.status}
              </span>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-400">
              Sample data only. Changes are held in the current page state and
              are not saved to a database.
            </p>

            <button
              type="button"
              onClick={() => setViewDestination(null)}
              className="mt-5 w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Close details
            </button>
          </div>
        </div>
      )}

      <footer className="flex flex-col gap-2 py-7 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Hikinhigh Travels. Admin dashboard preview.</p>
        <p>Frontend demo · Sample destination data only</p>
      </footer>
    </div>
  );
}
