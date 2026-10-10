
"use client";

import { useMemo, useState, type FormEvent } from "react";

type HotelStatus = "Active" | "Inactive";
type HotelCategory = "Budget" | "Standard" | "Deluxe" | "Luxury" | "Resort";

type Hotel = {
  id: string;
  name: string;
  destination: string;
  address: string;
  category: HotelCategory;
  rating: number;
  pricePerNight: number;
  rooms: number;
  status: HotelStatus;
  amenities: string[];
  description: string;
};

const initialHotels: Hotel[] = [
  {
    id: "HTL-001",
    name: "The Himalayan Retreat",
    destination: "Manali, Himachal Pradesh",
    address: "Hadimba Road, Manali",
    category: "Luxury",
    rating: 4.8,
    pricePerNight: 8500,
    rooms: 42,
    status: "Active",
    amenities: ["Free Wi-Fi", "Restaurant", "Mountain View", "Parking"],
    description: "A luxury mountain retreat with scenic Himalayan views.",
  },
  {
    id: "HTL-002",
    name: "Dal Lake Residency",
    destination: "Srinagar, Kashmir",
    address: "Boulevard Road, Srinagar",
    category: "Deluxe",
    rating: 4.6,
    pricePerNight: 6200,
    rooms: 30,
    status: "Active",
    amenities: ["Free Wi-Fi", "Lake View", "Restaurant", "Room Service"],
    description: "Comfortable accommodation near the beautiful Dal Lake.",
  },
  {
    id: "HTL-003",
    name: "Bali Sunset Resort",
    destination: "Bali, Indonesia",
    address: "Seminyak Beach Road, Bali",
    category: "Resort",
    rating: 4.9,
    pricePerNight: 12500,
    rooms: 65,
    status: "Active",
    amenities: ["Swimming Pool", "Spa", "Beach Access", "Restaurant"],
    description: "A tropical resort offering relaxing stays near the beach.",
  },
  {
    id: "HTL-004",
    name: "Rishikesh Riverside Camp",
    destination: "Rishikesh, Uttarakhand",
    address: "Shivpuri, Rishikesh",
    category: "Budget",
    rating: 4.3,
    pricePerNight: 2500,
    rooms: 20,
    status: "Active",
    amenities: ["River View", "Campfire", "Meals", "Adventure Activities"],
    description: "A riverside stay designed for outdoor and adventure travellers.",
  },
  {
    id: "HTL-005",
    name: "Dubai Grand Suites",
    destination: "Dubai, UAE",
    address: "Downtown Dubai",
    category: "Luxury",
    rating: 4.7,
    pricePerNight: 18000,
    rooms: 90,
    status: "Inactive",
    amenities: ["Swimming Pool", "Gym", "Restaurant", "Airport Transfer"],
    description: "Premium accommodation close to major Dubai attractions.",
  },
  {
    id: "HTL-006",
    name: "Mountain View Inn",
    destination: "Shimla, Himachal Pradesh",
    address: "Mall Road, Shimla",
    category: "Standard",
    rating: 4.1,
    pricePerNight: 3800,
    rooms: 25,
    status: "Active",
    amenities: ["Free Wi-Fi", "Restaurant", "Room Service"],
    description: "A comfortable hotel for exploring Shimla and its surroundings.",
  },
];

const categories: HotelCategory[] = [
  "Budget",
  "Standard",
  "Deluxe",
  "Luxury",
  "Resort",
];

const emptyForm = {
  name: "",
  destination: "",
  address: "",
  category: "Standard" as HotelCategory,
  rating: "4.0",
  pricePerNight: "",
  rooms: "",
  status: "Active" as HotelStatus,
  amenities: "",
  description: "",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredHotels = useMemo(() => {
    const term = search.toLowerCase().trim();

    return hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(term) ||
        hotel.destination.toLowerCase().includes(term) ||
        hotel.id.toLowerCase().includes(term) ||
        hotel.address.toLowerCase().includes(term);

      const matchesCategory =
        categoryFilter === "All" || hotel.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || hotel.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [hotels, search, categoryFilter, statusFilter]);

  const activeCount = hotels.filter(
    (hotel) => hotel.status === "Active"
  ).length;

  const averageRating = hotels.length
    ? (
        hotels.reduce((sum, hotel) => sum + hotel.rating, 0) /
        hotels.length
      ).toFixed(1)
    : "0.0";

  const averagePrice = hotels.length
    ? Math.round(
        hotels.reduce((sum, hotel) => sum + hotel.pricePerNight, 0) /
          hotels.length
      )
    : 0;

  function openAddModal() {
    setForm(emptyForm);
    setSelectedHotel(null);
    setError("");
    setModal("add");
  }

  function openEditModal(hotel: Hotel) {
    setSelectedHotel(hotel);
    setForm({
      name: hotel.name,
      destination: hotel.destination,
      address: hotel.address,
      category: hotel.category,
      rating: String(hotel.rating),
      pricePerNight: String(hotel.pricePerNight),
      rooms: String(hotel.rooms),
      status: hotel.status,
      amenities: hotel.amenities.join(", "),
      description: hotel.description,
    });
    setError("");
    setModal("edit");
  }

  function saveHotel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const price = Number(form.pricePerNight);
    const rooms = Number(form.rooms);
    const rating = Number(form.rating);

    if (
      !form.name.trim() ||
      !form.destination.trim() ||
      !form.address.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid price per night.");
      return;
    }

    if (!Number.isInteger(rooms) || rooms < 1) {
      setError("Enter a valid number of rooms.");
      return;
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setError("Rating must be between 0 and 5.");
      return;
    }

    const amenities = form.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const hotelData = {
      name: form.name.trim(),
      destination: form.destination.trim(),
      address: form.address.trim(),
      category: form.category,
      rating,
      pricePerNight: price,
      rooms,
      status: form.status,
      amenities,
      description: form.description.trim(),
    };

    if (modal === "edit" && selectedHotel) {
      setHotels((current) =>
        current.map((hotel) =>
          hotel.id === selectedHotel.id
            ? { ...hotel, ...hotelData }
            : hotel
        )
      );
    } else {
      const newHotel: Hotel = {
        id: `HTL-${String(Date.now()).slice(-6)}`,
        ...hotelData,
      };

      setHotels((current) => [newHotel, ...current]);
    }

    setModal(null);
  }

  function deleteHotel(hotel: Hotel) {
    if (
      window.confirm(
        `Are you sure you want to delete "${hotel.name}"?`
      )
    ) {
      setHotels((current) =>
        current.filter((item) => item.id !== hotel.id)
      );

      if (selectedHotel?.id === hotel.id) {
        setSelectedHotel(null);
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
              Management / Hotels
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Hotels Management
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Manage hotel listings, room availability and pricing.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <span className="text-lg leading-none">+</span>
            Add New Hotel
          </button>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Hotels"
            value={hotels.length}
            icon="▦"
            color="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Active Hotels"
            value={activeCount}
            icon="✓"
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            label="Average Rating"
            value={`★ ${averageRating}`}
            icon="★"
            color="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Average Price / Night"
            value={formatPrice(averagePrice)}
            icon="₹"
            color="bg-purple-50 text-purple-700"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                All Hotels
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Showing {filteredHotels.length} of {hotels.length} hotels
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[650px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search hotels..."
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500"
              />

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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-gray-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">Hotel</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Price / Night</th>
                  <th className="px-5 py-4">Rooms</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredHotels.map((hotel) => (
                  <tr key={hotel.id} className="transition hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                          🏨
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {hotel.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {hotel.id} · {hotel.destination}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700">
                        {hotel.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-amber-600">
                        ★ {hotel.rating.toFixed(1)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatPrice(hotel.pricePerNight)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {hotel.rooms}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                          hotel.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            hotel.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-gray-400"
                          }`}
                        />
                        {hotel.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedHotel(hotel);
                            setModal("view");
                          }}
                          className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditModal(hotel)}
                          className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteHotel(hotel)}
                          className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredHotels.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="text-3xl">🏨</div>
                      <p className="mt-3 font-semibold text-gray-800">
                        No hotels found
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
                    ? "Add New Hotel"
                    : modal === "edit"
                      ? "Edit Hotel"
                      : "Hotel Details"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {modal === "view"
                    ? selectedHotel?.id
                    : "Manage hotel information"}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 hover:bg-gray-200"
              >
                ×
              </button>
            </div>

            {modal === "view" && selectedHotel ? (
              <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-2xl bg-emerald-50 p-5">
                  <p className="text-sm font-medium text-emerald-700">
                    {selectedHotel.category} Accommodation
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900">
                    {selectedHotel.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedHotel.destination}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedHotel.address}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <p className="text-2xl font-bold text-emerald-800">
                      {formatPrice(selectedHotel.pricePerNight)}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}/ night
                      </span>
                    </p>
                    <span className="font-semibold text-amber-600">
                      ★ {selectedHotel.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Detail label="Hotel ID" value={selectedHotel.id} />
                  <Detail label="Category" value={selectedHotel.category} />
                  <Detail label="Total Rooms" value={String(selectedHotel.rooms)} />
                  <Detail label="Status" value={selectedHotel.status} />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {selectedHotel.description || "No description added."}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Amenities</h4>
                  {selectedHotel.amenities.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      No amenities added.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => openEditModal(selectedHotel)}
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Edit Hotel
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
              <form onSubmit={saveHotel} className="space-y-5 p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    Hotel Name *
                    <input
                      required
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      className={inputClass}
                      placeholder="Enter hotel name"
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
                      placeholder="City, State or Country"
                    />
                  </label>

                  <label className={labelClass}>
                    Hotel Address *
                    <input
                      required
                      value={form.address}
                      onChange={(event) =>
                        setForm({ ...form, address: event.target.value })
                      }
                      className={inputClass}
                      placeholder="Enter hotel address"
                    />
                  </label>

                  <label className={labelClass}>
                    Category
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          category: event.target.value as HotelCategory,
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
                    Price Per Night (₹) *
                    <input
                      required
                      type="number"
                      min="1"
                      value={form.pricePerNight}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          pricePerNight: event.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="5000"
                    />
                  </label>

                  <label className={labelClass}>
                    Total Rooms *
                    <input
                      required
                      type="number"
                      min="1"
                      step="1"
                      value={form.rooms}
                      onChange={(event) =>
                        setForm({ ...form, rooms: event.target.value })
                      }
                      className={inputClass}
                      placeholder="25"
                    />
                  </label>

                  <label className={labelClass}>
                    Rating (0–5)
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={form.rating}
                      onChange={(event) =>
                        setForm({ ...form, rating: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Status
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          status: event.target.value as HotelStatus,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                </div>

                <label className={labelClass}>
                  Amenities
                  <textarea
                    rows={2}
                    value={form.amenities}
                    onChange={(event) =>
                      setForm({ ...form, amenities: event.target.value })
                    }
                    className={inputClass}
                    placeholder="Free Wi-Fi, Restaurant, Parking"
                  />
                  <span className="mt-1.5 block text-xs font-normal text-gray-500">
                    Separate amenities with commas.
                  </span>
                </label>

                <label className={labelClass}>
                  Description
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    className={inputClass}
                    placeholder="Write a short hotel description..."
                  />
                </label>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
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
                    {modal === "edit" ? "Save Changes" : "Create Hotel"}
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
