
"use client";

import { useMemo, useState, type FormEvent } from "react";

type PackageStatus = "Published" | "Draft";
type PackageCategory = "Adventure" | "Family" | "Honeymoon" | "Weekend" | "Luxury";

type TravelPackage = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  category: PackageCategory;
  status: PackageStatus;
  bookings: number;
  description: string;
  highlights: string[];
};

const initialPackages: TravelPackage[] = [
  {
    id: "PKG-001",
    title: "Manali Mountain Escape",
    destination: "Manali, Himachal Pradesh",
    duration: "5 Days / 4 Nights",
    price: 14999,
    category: "Adventure",
    status: "Published",
    bookings: 28,
    description: "Explore mountain views, scenic valleys and local experiences in Manali.",
    highlights: ["Solang Valley", "Local sightseeing", "Hotel stay"],
  },
  {
    id: "PKG-002",
    title: "Kashmir Paradise",
    destination: "Srinagar, Kashmir",
    duration: "6 Days / 5 Nights",
    price: 24999,
    category: "Family",
    status: "Published",
    bookings: 42,
    description: "Discover Kashmir's lakes, gardens and breathtaking mountain scenery.",
    highlights: ["Dal Lake", "Gulmarg excursion", "Breakfast included"],
  },
  {
    id: "PKG-003",
    title: "Romantic Bali Retreat",
    destination: "Bali, Indonesia",
    duration: "6 Days / 5 Nights",
    price: 45999,
    category: "Honeymoon",
    status: "Published",
    bookings: 19,
    description: "A relaxing tropical getaway designed for couples.",
    highlights: ["Beach experience", "Private transfers", "Romantic dinner"],
  },
  {
    id: "PKG-004",
    title: "Rishikesh Weekend Adventure",
    destination: "Rishikesh, Uttarakhand",
    duration: "3 Days / 2 Nights",
    price: 7999,
    category: "Weekend",
    status: "Published",
    bookings: 35,
    description: "Enjoy riverside camping and outdoor adventures in Rishikesh.",
    highlights: ["Riverside camping", "Adventure activities", "Evening bonfire"],
  },
  {
    id: "PKG-005",
    title: "Luxury Dubai Experience",
    destination: "Dubai, UAE",
    duration: "5 Days / 4 Nights",
    price: 59999,
    category: "Luxury",
    status: "Draft",
    bookings: 0,
    description: "Experience Dubai's iconic attractions, shopping and luxury hospitality.",
    highlights: ["City tour", "Desert safari", "Premium hotel"],
  },
  {
    id: "PKG-006",
    title: "Spiti Valley Expedition",
    destination: "Spiti Valley, Himachal Pradesh",
    duration: "8 Days / 7 Nights",
    price: 32999,
    category: "Adventure",
    status: "Draft",
    bookings: 0,
    description: "Explore high-altitude villages, monasteries and dramatic mountain landscapes.",
    highlights: ["Key Monastery", "Mountain road trip", "Local experiences"],
  },
];

const categories: PackageCategory[] = [
  "Adventure",
  "Family",
  "Honeymoon",
  "Weekend",
  "Luxury",
];

const emptyForm = {
  title: "",
  destination: "",
  duration: "",
  price: "",
  category: "Adventure" as PackageCategory,
  status: "Draft" as PackageStatus,
  description: "",
  highlights: "",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function PackagesPage() {
  const [packages, setPackages] = useState<TravelPackage[]>(initialPackages);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredPackages = useMemo(() => {
    const term = search.toLowerCase().trim();

    return packages.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(term) ||
        item.destination.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term);

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [packages, search, categoryFilter, statusFilter]);

  const publishedCount = packages.filter(
    (item) => item.status === "Published"
  ).length;

  const totalBookings = packages.reduce(
    (total, item) => total + item.bookings,
    0
  );

  const averagePrice = packages.length
    ? Math.round(
        packages.reduce((total, item) => total + item.price, 0) /
          packages.length
      )
    : 0;

  function openAddModal() {
    setForm(emptyForm);
    setSelectedPackage(null);
    setError("");
    setModal("add");
  }

  function openEditModal(item: TravelPackage) {
    setSelectedPackage(item);
    setForm({
      title: item.title,
      destination: item.destination,
      duration: item.duration,
      price: String(item.price),
      category: item.category,
      status: item.status,
      description: item.description,
      highlights: item.highlights.join(", "),
    });
    setError("");
    setModal("edit");
  }

  function savePackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const price = Number(form.price);

    if (!form.title.trim() || !form.destination.trim() || !form.duration.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid package price.");
      return;
    }

    const highlights = form.highlights
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (modal === "edit" && selectedPackage) {
      setPackages((current) =>
        current.map((item) =>
          item.id === selectedPackage.id
            ? {
                ...item,
                title: form.title.trim(),
                destination: form.destination.trim(),
                duration: form.duration.trim(),
                price,
                category: form.category,
                status: form.status,
                description: form.description.trim(),
                highlights,
              }
            : item
        )
      );
    } else {
      const newPackage: TravelPackage = {
        id: `PKG-${String(Date.now()).slice(-6)}`,
        title: form.title.trim(),
        destination: form.destination.trim(),
        duration: form.duration.trim(),
        price,
        category: form.category,
        status: form.status,
        bookings: 0,
        description: form.description.trim(),
        highlights,
      };

      setPackages((current) => [newPackage, ...current]);
    }

    setModal(null);
  }

  function deletePackage(item: TravelPackage) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (confirmed) {
      setPackages((current) =>
        current.filter((pkg) => pkg.id !== item.id)
      );

      if (selectedPackage?.id === item.id) {
        setSelectedPackage(null);
        setModal(null);
      }
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-[#f7f9f8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-700">
              Management / Packages
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Packages Management
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Create and manage your travel packages.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <span className="text-lg leading-none">+</span>
            Add New Package
          </button>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Packages"
            value={packages.length}
            icon="▣"
            color="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Published Packages"
            value={publishedCount}
            icon="✓"
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            label="Total Bookings"
            value={totalBookings}
            icon="♧"
            color="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Average Package Price"
            value={formatPrice(averagePrice)}
            icon="₹"
            color="bg-purple-50 text-purple-700"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                All Packages
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Showing {filteredPackages.length} of {packages.length} packages
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[650px]">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  ⌕
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search packages..."
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-gray-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">Package</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4">Price / Person</th>
                  <th className="px-5 py-4">Bookings</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPackages.map((item) => (
                  <tr key={item.id} className="transition hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                          {item.category === "Adventure"
                            ? "🏔️"
                            : item.category === "Family"
                              ? "👨‍👩‍👧"
                              : item.category === "Honeymoon"
                                ? "💑"
                                : item.category === "Weekend"
                                  ? "🏕️"
                                  : "✨"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {item.id} · {item.destination}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.duration}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.bookings}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                          item.status === "Published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.status === "Published"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedPackage(item);
                            setModal("view");
                          }}
                          title="View package"
                          className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit package"
                          className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePackage(item)}
                          title="Delete package"
                          className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPackages.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="text-3xl">📦</div>
                      <p className="mt-3 font-semibold text-gray-800">
                        No packages found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Try changing the search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {modal === "add"
                    ? "Add New Package"
                    : modal === "edit"
                      ? "Edit Package"
                      : "Package Details"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {modal === "view"
                    ? selectedPackage?.id
                    : "Manage travel package information"}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 hover:bg-gray-200"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {modal === "view" && selectedPackage ? (
              <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-2xl bg-emerald-50 p-5">
                  <p className="text-sm font-medium text-emerald-700">
                    {selectedPackage.category} Package
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900">
                    {selectedPackage.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedPackage.destination}
                  </p>
                  <p className="mt-4 text-2xl font-bold text-emerald-800">
                    {formatPrice(selectedPackage.price)}
                    <span className="text-sm font-normal text-gray-500">
                      {" "}/ person
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Detail label="Package ID" value={selectedPackage.id} />
                  <Detail label="Duration" value={selectedPackage.duration} />
                  <Detail label="Bookings" value={String(selectedPackage.bookings)} />
                  <Detail label="Status" value={selectedPackage.status} />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {selectedPackage.description || "No description added."}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Highlights</h4>
                  {selectedPackage.highlights.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedPackage.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      No highlights added.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => openEditModal(selectedPackage)}
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Edit Package
                  </button>
                  <button
                    onClick={() => setModal(null)}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={savePackage} className="space-y-5 p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    Package Name *
                    <input
                      required
                      value={form.title}
                      onChange={(event) =>
                        setForm({ ...form, title: event.target.value })
                      }
                      className={inputClass}
                      placeholder="e.g. Manali Mountain Escape"
                    />
                  </label>

                  <label className={labelClass}>
                    Destination *
                    <input
                      required
                      value={form.destination}
                      onChange={(event) =>
                        setForm({ ...form, destination: event.target.value })
                      }
                      className={inputClass}
                      placeholder="e.g. Manali, Himachal Pradesh"
                    />
                  </label>

                  <label className={labelClass}>
                    Duration *
                    <input
                      required
                      value={form.duration}
                      onChange={(event) =>
                        setForm({ ...form, duration: event.target.value })
                      }
                      className={inputClass}
                      placeholder="e.g. 5 Days / 4 Nights"
                    />
                  </label>

                  <label className={labelClass}>
                    Price per Person (₹) *
                    <input
                      required
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={(event) =>
                        setForm({ ...form, price: event.target.value })
                      }
                      className={inputClass}
                      placeholder="14999"
                    />
                  </label>

                  <label className={labelClass}>
                    Category
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          category: event.target.value as PackageCategory,
                        })
                      }
                      className={inputClass}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Publication Status
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          status: event.target.value as PackageStatus,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </label>
                </div>

                <label className={labelClass}>
                  Description
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    className={inputClass}
                    placeholder="Describe the travel experience..."
                  />
                </label>

                <label className={labelClass}>
                  Package Highlights
                  <textarea
                    rows={2}
                    value={form.highlights}
                    onChange={(event) =>
                      setForm({ ...form, highlights: event.target.value })
                    }
                    className={inputClass}
                    placeholder="Hotel stay, sightseeing, transfers (comma-separated)"
                  />
                  <span className="mt-1.5 block text-xs font-normal text-gray-500">
                    Separate each highlight with a comma.
                  </span>
                </label>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    {modal === "edit" ? "Save Changes" : "Create Package"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
