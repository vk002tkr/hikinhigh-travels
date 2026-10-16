"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type HotelStatus = "Active" | "Inactive";
type HotelCategory = "Budget" | "Standard" | "Deluxe" | "Luxury" | "Resort";
type Destination = { id: string; name: string; country: string | null; region: string | null; is_active: boolean };
type Room = { id: string; hotel_id: string; name: string; description: string | null; max_guests: number; base_price_usd: number; gallery: unknown; amenities: unknown; is_active: boolean };
type Hotel = {
  id: string; destination_id: string | null; name: string; slug: string; description: string | null;
  address: string | null; city: string | null; country: string | null; latitude: number | null;
  longitude: number | null; star_rating: number | null; hero_image: string | null; gallery: unknown;
  amenities: unknown; check_in_time: string | null; check_out_time: string | null;
  cancellation_policy: string | null; is_featured: boolean; is_active: boolean;
  rooms: Room[];
};
type HotelForm = {
  name: string; destination_id: string; address: string; city: string; country: string;
  category: HotelCategory; rating: string; roomName: string; pricePerNightUsd: string;
  maxGuests: string; status: HotelStatus; amenities: string; description: string;
  heroImage: string; featured: boolean; checkIn: string; checkOut: string; cancellationPolicy: string;
};

const categories: HotelCategory[] = ["Budget", "Standard", "Deluxe", "Luxury", "Resort"];
const emptyForm: HotelForm = {
  name: "", destination_id: "", address: "", city: "", country: "", category: "Standard",
  rating: "4.0", roomName: "Standard Room", pricePerNightUsd: "", maxGuests: "2", status: "Active",
  amenities: "", description: "", heroImage: "", featured: false, checkIn: "", checkOut: "", cancellationPolicy: "",
};
const inputClass = "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
const labelClass = "block text-sm font-medium text-gray-700";

function slugify(value: string) {
  return value.normalize("NFKD").toLowerCase().trim().replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function listValue(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
function messageOf(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String((error as { message: unknown }).message);
  return "Something went wrong. Please try again.";
}
function categoryOf(rating: number | null): HotelCategory {
  if (rating === null) return "Standard";
  if (rating >= 4.7) return "Luxury";
  if (rating >= 4.4) return "Deluxe";
  if (rating >= 4) return "Standard";
  return "Budget";
}
function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}
function hotelRoomPrice(hotel: Hotel) {
  const activeRooms = hotel.rooms.filter((room) => room.is_active);
  if (!activeRooms.length) return 0;
  return Math.min(...activeRooms.map((room) => Number(room.base_price_usd) || 0));
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [form, setForm] = useState<HotelForm>(emptyForm);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setPageError("");
    const [hotelResult, destinationResult, roomResult] = await Promise.all([
      supabase.from("hotels").select("id,destination_id,name,slug,description,address,city,country,latitude,longitude,star_rating,hero_image,gallery,amenities,check_in_time,check_out_time,cancellation_policy,is_featured,is_active").order("name", { ascending: true }),
      supabase.from("destinations").select("id,name,country,region,is_active").eq("is_active", true).order("sort_order", { ascending: true }),
      supabase.from("hotel_rooms").select("id,hotel_id,name,description,max_guests,base_price_usd,gallery,amenities,is_active").order("base_price_usd", { ascending: true }),
    ]);
    if (hotelResult.error) {
      setPageError(`${hotelResult.error.message}. Confirm that you are signed in as an administrator and that the hotels table permissions and RLS policies allow access.`);
      setHotels([]);
    } else if (roomResult.error) {
      setPageError(`Hotels loaded, but room pricing could not be loaded: ${roomResult.error.message}`);
      setHotels((hotelResult.data ?? []).map((hotel) => ({ ...hotel, rooms: [] })) as Hotel[]);
    } else {
      const roomsByHotel = new Map<string, Room[]>();
      for (const room of (roomResult.data ?? []) as Room[]) {
        const current = roomsByHotel.get(room.hotel_id) ?? [];
        current.push(room);
        roomsByHotel.set(room.hotel_id, current);
      }
      setHotels(((hotelResult.data ?? []) as Omit<Hotel, "rooms">[]).map((hotel) => ({ ...hotel, rooms: roomsByHotel.get(hotel.id) ?? [] })));
    }
    if (destinationResult.error) {
      setPageError((current) => [current, `Destinations could not be loaded: ${destinationResult.error!.message}`].filter(Boolean).join(" "));
      setDestinations([]);
    } else {
      setDestinations((destinationResult.data ?? []) as Destination[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const filteredHotels = useMemo(() => {
    const term = search.trim().toLowerCase();
    return hotels.filter((hotel) => {
      const destination = destinations.find((item) => item.id === hotel.destination_id);
      const matchesSearch = [hotel.name, hotel.city, hotel.country, hotel.address, hotel.slug, destination?.name]
        .some((value) => (value ?? "").toLowerCase().includes(term));
      const matchesCategory = categoryFilter === "All" || categoryOf(hotel.star_rating) === categoryFilter;
      const matchesStatus = statusFilter === "All" || (hotel.is_active ? "Active" : "Inactive") === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [hotels, destinations, search, categoryFilter, statusFilter]);

  const activeCount = hotels.filter((hotel) => hotel.is_active).length;
  const ratedHotels = hotels.filter((hotel) => hotel.star_rating !== null);
  const averageRating = ratedHotels.length ? (ratedHotels.reduce((sum, hotel) => sum + Number(hotel.star_rating), 0) / ratedHotels.length).toFixed(1) : "—";
  const pricedHotels = hotels.filter((hotel) => hotel.rooms.some((room) => room.is_active));
  const averagePrice = pricedHotels.length ? pricedHotels.reduce((sum, hotel) => sum + hotelRoomPrice(hotel), 0) / pricedHotels.length : 0;

  function openAddModal() {
    setSelectedHotel(null);
    setForm({ ...emptyForm, destination_id: destinations[0]?.id ?? "" });
    setError(""); setNotice(""); setModal("add");
  }
  function openEditModal(hotel: Hotel) {
    const room = hotel.rooms.find((item) => item.is_active) ?? hotel.rooms[0];
    setSelectedHotel(hotel);
    setForm({
      name: hotel.name, destination_id: hotel.destination_id ?? "", address: hotel.address ?? "",
      city: hotel.city ?? "", country: hotel.country ?? "", category: categoryOf(hotel.star_rating),
      rating: hotel.star_rating === null ? "" : String(hotel.star_rating), roomName: room?.name ?? "Standard Room",
      pricePerNightUsd: room ? String(room.base_price_usd) : "", maxGuests: room ? String(room.max_guests) : "2",
      status: hotel.is_active ? "Active" : "Inactive", amenities: listValue(hotel.amenities).join(", "),
      description: hotel.description ?? "", heroImage: hotel.hero_image ?? "", featured: hotel.is_featured,
      checkIn: hotel.check_in_time?.slice(0, 5) ?? "", checkOut: hotel.check_out_time?.slice(0, 5) ?? "",
      cancellationPolicy: hotel.cancellation_policy ?? "",
    });
    setError(""); setNotice(""); setModal("edit");
  }

  async function saveHotel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    const name = form.name.trim();
    const price = Number(form.pricePerNightUsd);
    const maxGuests = Number(form.maxGuests);
    const rating = form.rating.trim() === "" ? null : Number(form.rating);
    if (!name || !form.destination_id) { setError("Hotel name and destination are required."); return; }
    if (!Number.isFinite(price) || price < 0) { setError("Enter a valid room price in USD."); return; }
    if (!Number.isInteger(maxGuests) || maxGuests < 1) { setError("Maximum guests must be a whole number of at least 1."); return; }
    if (rating !== null && (!Number.isFinite(rating) || rating < 0 || rating > 5)) { setError("Rating must be between 0 and 5."); return; }
    const destination = destinations.find((item) => item.id === form.destination_id);
    if (!destination) { setError("Choose a valid active destination."); return; }
    if (saving) return;
    setSaving(true);
    const amenities = form.amenities.split(",").map((item) => item.trim()).filter(Boolean);
    const hotelPayload = {
      destination_id: destination.id, name, slug: slugify(name), description: form.description.trim() || null,
      address: form.address.trim() || null, city: form.city.trim() || destination.name,
      country: form.country.trim() || destination.country || null, star_rating: rating,
      hero_image: form.heroImage.trim() || null, amenities, is_featured: form.featured,
      is_active: form.status === "Active", check_in_time: form.checkIn || null,
      check_out_time: form.checkOut || null, cancellation_policy: form.cancellationPolicy.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const roomPayload = {
      name: form.roomName.trim() || "Standard Room", description: null, max_guests: maxGuests,
      base_price_usd: price, gallery: [], amenities, is_active: form.status === "Active",
      updated_at: new Date().toISOString(),
    };
    try {
      let hotelId = selectedHotel?.id;
      if (modal === "edit" && hotelId) {
        const { data, error: updateError } = await supabase.from("hotels").update(hotelPayload).eq("id", hotelId).select("id").maybeSingle();
        if (updateError) throw updateError;
        if (!data) throw new Error("No hotel was updated. Check your administrator login and hotels UPDATE policy.");
      } else {
        const { data, error: insertError } = await supabase.from("hotels").insert({ ...hotelPayload, gallery: [] }).select("id").single();
        if (insertError) throw insertError;
        hotelId = data.id;
      }
      if (!hotelId) throw new Error("Hotel was saved but its ID was not returned.");
      const existingRoom = selectedHotel?.rooms.find((item) => item.is_active) ?? selectedHotel?.rooms[0];
      if (existingRoom) {
        const { data, error: roomUpdateError } = await supabase.from("hotel_rooms").update(roomPayload).eq("id", existingRoom.id).eq("hotel_id", hotelId).select("id").maybeSingle();
        if (roomUpdateError) throw new Error(`Hotel details saved, but room pricing failed: ${roomUpdateError.message}`);
        if (!data) throw new Error("Hotel details saved, but the room record was not updated. Check hotel_rooms permissions and RLS.");
      } else {
        const { error: roomInsertError } = await supabase.from("hotel_rooms").insert({ ...roomPayload, hotel_id: hotelId });
        if (roomInsertError) throw new Error(`Hotel details saved, but room pricing failed: ${roomInsertError.message}`);
      }
      setModal(null); setSelectedHotel(null); setForm(emptyForm);
      setNotice(modal === "edit" ? "Hotel and room pricing updated successfully." : "Hotel and its first room type were created successfully.");
      await loadData();
    } catch (saveError) {
      setError(messageOf(saveError));
      await loadData();
    } finally { setSaving(false); }
  }

  async function deleteHotel(hotel: Hotel) {
    if (!window.confirm(`Delete "${hotel.name}" and its room records? This cannot be undone.`)) return;
    setDeletingId(hotel.id); setPageError(""); setNotice("");
    try {
      // Delete child room records first because hotel_rooms.hotel_id is required.
      const { error: roomsError } = await supabase.from("hotel_rooms").delete().eq("hotel_id", hotel.id);
      if (roomsError) throw roomsError;
      const { data, error: hotelError } = await supabase.from("hotels").delete().eq("id", hotel.id).select("id").maybeSingle();
      if (hotelError) throw hotelError;
      if (!data) throw new Error("No hotel was deleted. Check administrator login and hotels DELETE policy.");
      if (selectedHotel?.id === hotel.id) { setSelectedHotel(null); setModal(null); }
      setNotice(`${hotel.name} and its room records were deleted.`);
      await loadData();
    } catch (deleteError) { setPageError(messageOf(deleteError)); }
    finally { setDeletingId(null); }
  }

  const activeRooms = (hotel: Hotel) => hotel.rooms.filter((room) => room.is_active);

  return (
    <div className="min-h-screen bg-[#f7f9f8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="mb-1 text-sm font-medium text-emerald-700">Management / Hotels</p><h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Hotels Management</h1><p className="mt-1.5 text-sm text-gray-500">Manage hotel listings, room types and USD pricing.</p></div>
          <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"><span className="text-lg leading-none">+</span>Add New Hotel</button>
        </div>
        {pageError && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{pageError}<button onClick={() => void loadData()} className="ml-3 font-semibold underline">Retry</button></div>}
        {notice && <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div>}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Hotels" value={hotels.length} icon="▦" color="bg-emerald-50 text-emerald-700" />
          <StatCard label="Active Hotels" value={activeCount} icon="✓" color="bg-blue-50 text-blue-700" />
          <StatCard label="Average Rating" value={averageRating === "—" ? averageRating : `★ ${averageRating}`} icon="★" color="bg-amber-50 text-amber-700" />
          <StatCard label="Average Starting Price / Night" value={formatUsd(averagePrice)} icon="$" color="bg-purple-50 text-purple-700" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between"><div><h2 className="text-lg font-bold text-gray-900">All Hotels</h2><p className="mt-1 text-sm text-gray-500">Showing {filteredHotels.length} of {hotels.length} hotels · Prices shown in USD</p></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[650px]"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search hotels..." aria-label="Search hotels" className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500" />
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category" className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"><option value="All">All Categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status" className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"><option value="All">All Statuses</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select>
            </div>
          </div>
          {loading ? <div className="px-5 py-16 text-center text-sm text-gray-500">Loading hotels from Supabase…</div> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left"><thead className="bg-gray-50/80"><tr className="text-xs font-semibold uppercase tracking-wider text-gray-500"><th className="px-5 py-4">Hotel</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Rating</th><th className="px-5 py-4">Starting price / night</th><th className="px-5 py-4">Room types</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{filteredHotels.map((hotel) => <tr key={hotel.id} className="transition hover:bg-gray-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-xl">{hotel.hero_image ? <img src={hotel.hero_image} alt="" className="h-full w-full object-cover" /> : "🏨"}</div><div><p className="font-semibold text-gray-900">{hotel.name}</p><p className="mt-1 text-xs text-gray-500">{hotel.city || ""}{hotel.country ? `, ${hotel.country}` : ""}</p></div></div></td>
              <td className="px-5 py-4"><span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700">{categoryOf(hotel.star_rating)}</span></td><td className="px-5 py-4"><span className="font-semibold text-amber-600">{hotel.star_rating === null ? "—" : `★ ${Number(hotel.star_rating).toFixed(1)}`}</span></td><td className="px-5 py-4 text-sm font-semibold text-gray-900">{activeRooms(hotel).length ? formatUsd(hotelRoomPrice(hotel)) : "Not priced"}</td><td className="px-5 py-4 text-sm text-gray-600">{hotel.rooms.length}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${hotel.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}><span className={`h-1.5 w-1.5 rounded-full ${hotel.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />{hotel.is_active ? "Active" : "Inactive"}</span></td>
              <td className="px-5 py-4"><div className="flex items-center justify-end gap-1"><button onClick={() => { setSelectedHotel(hotel); setModal("view"); }} className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-blue-50 hover:text-blue-700">View</button><button onClick={() => openEditModal(hotel)} className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-emerald-50 hover:text-emerald-700">Edit</button><button disabled={deletingId === hotel.id} onClick={() => void deleteHotel(hotel)} className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">{deletingId === hotel.id ? "Deleting…" : "Delete"}</button></div></td></tr>)}
              {filteredHotels.length === 0 && <tr><td colSpan={7} className="px-5 py-16 text-center"><div className="text-3xl">🏨</div><p className="mt-3 font-semibold text-gray-800">{hotels.length ? "No hotels match your filters" : "No hotels in Supabase yet"}</p><p className="mt-1 text-sm text-gray-500">{hotels.length ? "Try changing the search or filters." : "Use Add New Hotel to create your first listing."}</p></td></tr>}</tbody></table></div>}
        </div>
      </div>

      {modal && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setModal(null); }}><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6"><div><h2 className="text-lg font-bold text-gray-900">{modal === "add" ? "Add New Hotel" : modal === "edit" ? "Edit Hotel" : "Hotel Details"}</h2><p className="mt-1 text-sm text-gray-500">{modal === "view" ? selectedHotel?.id : "Hotel details and first room type"}</p></div><button disabled={saving} onClick={() => setModal(null)} aria-label="Close modal" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 hover:bg-gray-200 disabled:opacity-50">×</button></div>
        {modal === "view" && selectedHotel ? <div className="space-y-5 p-5 sm:p-6"><div className="rounded-2xl bg-emerald-50 p-5"><p className="text-sm font-medium text-emerald-700">{categoryOf(selectedHotel.star_rating)} Accommodation</p><h3 className="mt-2 text-2xl font-bold text-gray-900">{selectedHotel.name}</h3><p className="mt-2 text-sm text-gray-600">{[selectedHotel.city, selectedHotel.country].filter(Boolean).join(", ")}</p><p className="mt-1 text-sm text-gray-600">{selectedHotel.address || "No address added"}</p><div className="mt-4 flex flex-wrap items-center gap-4"><p className="text-2xl font-bold text-emerald-800">{selectedHotel.rooms.some((room) => room.is_active) ? formatUsd(hotelRoomPrice(selectedHotel)) : "Not priced"}<span className="text-sm font-normal text-gray-500"> / night starting</span></p><span className="font-semibold text-amber-600">{selectedHotel.star_rating === null ? "No rating" : `★ ${Number(selectedHotel.star_rating).toFixed(1)}`}</span></div></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Detail label="Hotel ID" value={selectedHotel.id} /><Detail label="Room types" value={String(selectedHotel.rooms.length)} /><Detail label="Status" value={selectedHotel.is_active ? "Active" : "Inactive"} /><Detail label="Featured" value={selectedHotel.is_featured ? "Yes" : "No"} /><Detail label="Check-in" value={selectedHotel.check_in_time || "Not set"} /><Detail label="Check-out" value={selectedHotel.check_out_time || "Not set"} /></div><div><h4 className="font-semibold text-gray-900">Description</h4><p className="mt-2 text-sm leading-6 text-gray-600">{selectedHotel.description || "No description added."}</p></div><div><h4 className="font-semibold text-gray-900">Room types and prices</h4>{selectedHotel.rooms.length ? <div className="mt-3 space-y-2">{selectedHotel.rooms.map((room) => <div key={room.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3"><div><p className="font-medium text-gray-800">{room.name}</p><p className="text-xs text-gray-500">Up to {room.max_guests} guests · {room.is_active ? "Active" : "Inactive"}</p></div><p className="font-semibold text-gray-900">{formatUsd(Number(room.base_price_usd))}</p></div>)}</div> : <p className="mt-2 text-sm text-gray-500">No room types added.</p>}</div><div><h4 className="font-semibold text-gray-900">Amenities</h4><div className="mt-3 flex flex-wrap gap-2">{listValue(selectedHotel.amenities).length ? listValue(selectedHotel.amenities).map((amenity) => <span key={amenity} className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">{amenity}</span>) : <p className="text-sm text-gray-500">No amenities added.</p>}</div></div><div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><button onClick={() => openEditModal(selectedHotel)} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Edit Hotel</button><button onClick={() => setModal(null)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Close</button></div></div>
        : <form onSubmit={saveHotel} className="space-y-5 p-5 sm:p-6"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>Hotel Name *<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} placeholder="Enter hotel name" /></label>
          <label className={labelClass}>Destination *<select required value={form.destination_id} onChange={(event) => { const d = destinations.find((item) => item.id === event.target.value); setForm({ ...form, destination_id: event.target.value, city: d?.name ?? form.city, country: d?.country ?? form.country }); }} className={inputClass}><option value="">Choose destination</option>{destinations.map((destination) => <option key={destination.id} value={destination.id}>{destination.name}{destination.country ? `, ${destination.country}` : ""}</option>)}</select>{destinations.length === 0 && <span className="mt-1 block text-xs text-amber-700">No active destinations found. Activate a destination first.</span>}</label>
          <label className={labelClass}>City<input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className={inputClass} placeholder="City" /></label>
          <label className={labelClass}>Country<input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} className={inputClass} placeholder="Country" /></label>
          <label className={labelClass}>Hotel Address<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className={inputClass} placeholder="Street address" /></label>
          <label className={labelClass}>Hero image URL<input type="url" value={form.heroImage} onChange={(event) => setForm({ ...form, heroImage: event.target.value })} className={inputClass} placeholder="https://…" /></label>
          <label className={labelClass}>Category (display only)<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as HotelCategory })} className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select><span className="mt-1 block text-xs font-normal text-gray-500">Category is inferred from the rating; it is not a database field.</span></label>
          <label className={labelClass}>Rating (0–5)<input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} className={inputClass} placeholder="4.5" /></label>
          <label className={labelClass}>First Room Type Name *<input required value={form.roomName} onChange={(event) => setForm({ ...form, roomName: event.target.value })} className={inputClass} placeholder="Deluxe Double Room" /></label>
          <label className={labelClass}>Room Price Per Night (USD) *<input required type="number" min="0" step="0.01" value={form.pricePerNightUsd} onChange={(event) => setForm({ ...form, pricePerNightUsd: event.target.value })} className={inputClass} placeholder="120.00" /></label>
          <label className={labelClass}>Maximum Guests *<input required type="number" min="1" step="1" value={form.maxGuests} onChange={(event) => setForm({ ...form, maxGuests: event.target.value })} className={inputClass} placeholder="2" /></label>
          <label className={labelClass}>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as HotelStatus })} className={inputClass}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
          <label className={labelClass}>Check-in Time<input type="time" value={form.checkIn} onChange={(event) => setForm({ ...form, checkIn: event.target.value })} className={inputClass} /></label>
          <label className={labelClass}>Check-out Time<input type="time" value={form.checkOut} onChange={(event) => setForm({ ...form, checkOut: event.target.value })} className={inputClass} /></label>
        </div><label className={labelClass}>Amenities<textarea rows={2} value={form.amenities} onChange={(event) => setForm({ ...form, amenities: event.target.value })} className={inputClass} placeholder="Free Wi-Fi, Restaurant, Parking" /><span className="mt-1.5 block text-xs font-normal text-gray-500">Separate amenities with commas.</span></label>
          <label className={labelClass}>Description<textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={inputClass} placeholder="Write a short hotel description…" /></label>
          <label className={labelClass}>Cancellation Policy<textarea rows={2} value={form.cancellationPolicy} onChange={(event) => setForm({ ...form, cancellationPolicy: event.target.value })} className={inputClass} placeholder="Describe cancellation terms…" /></label>
          <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} className="h-4 w-4 accent-emerald-700" /><span className="text-sm font-semibold text-gray-700">Feature on the website</span></label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5"><button type="button" disabled={saving} onClick={() => setModal(null)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button><button type="submit" disabled={saving || destinations.length === 0} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">{saving ? "Saving…" : modal === "edit" ? "Save Changes" : "Create Hotel"}</button></div>
        </form>}
      </div></div>}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-gray-500">{label}</p><p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{value}</p></div><div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${color}`}>{icon}</div></div></div>;
}
function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-gray-100 p-4"><p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p><p className="mt-2 break-words text-sm font-semibold text-gray-900">{value}</p></div>;
}
