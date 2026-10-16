"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type DestinationStatus = "Active" | "Draft";

type Destination = {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  description: string;
  short_description: string;
  hero_image: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  highlights: unknown;
  created_at?: string;
  updated_at?: string;
};

type DestinationForm = {
  name: string;
  country: string;
  region: string;
  short_description: string;
  description: string;
  hero_image: string;
  status: DestinationStatus;
  featured: boolean;
};

const emptyForm: DestinationForm = {
  name: "",
  country: "India",
  region: "",
  short_description: "",
  description: "",
  hero_image: "",
  status: "Draft",
  featured: false,
};

const statusStyles: Record<DestinationStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Draft: "bg-amber-50 text-amber-700",
};

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function statusOf(destination: Destination): DestinationStatus {
  return destination.is_active ? "Active" : "Draft";
}

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Something went wrong. Please try again.";
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DestinationForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [viewDestination, setViewDestination] = useState<Destination | null>(null);

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setPageError("");
    const { data, error } = await supabase
      .from("destinations")
      .select(
        "id,name,slug,country,region,short_description,description,hero_image,highlights,is_featured,is_active,sort_order,created_at,updated_at",
      )
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      setPageError(
        `${error.message}. Confirm you are signed in as an administrator and that the destinations table grants admin access.`,
      );
      setDestinations([]);
    } else {
      setDestinations((data ?? []) as Destination[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadDestinations();
  }, [loadDestinations]);

  const countries = useMemo(
    () =>
      Array.from(
        new Set(destinations.map((destination) => destination.country).filter(Boolean)),
      ).sort(),
    [destinations],
  );

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return destinations.filter((destination) => {
      const matchesSearch = [
        destination.name,
        destination.country,
        destination.region,
        destination.description,
        destination.short_description,
      ].some((value) => (value ?? "").toLowerCase().includes(query));
      const matchesCountry =
        countryFilter === "All" || destination.country === countryFilter;
      const matchesStatus =
        statusFilter === "All" || statusOf(destination) === statusFilter;
      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [destinations, search, countryFilter, statusFilter]);

  const activeCount = destinations.filter((item) => item.is_active).length;
  const featuredCount = destinations.filter((item) => item.is_featured).length;
  const draftCount = destinations.length - activeCount;

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEditModal(destination: Destination) {
    setEditingId(destination.id);
    setForm({
      name: destination.name ?? "",
      country: destination.country ?? "",
      region: destination.region ?? "",
      short_description: destination.short_description ?? "",
      description: destination.description ?? "",
      hero_image: destination.hero_image ?? "",
      status: statusOf(destination),
      featured: destination.is_featured,
    });
    setFormError("");
    setNotice("");
    setModalOpen(true);
  }

  async function saveDestination(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const name = form.name.trim();
    const country = form.country.trim();
    const region = form.region.trim();
    const shortDescription = form.short_description.trim();
    const description = form.description.trim();
    const slug = slugify(name);

    if (!name || !country || !slug) {
      setFormError("Destination name and country are required.");
      return;
    }

    if (saving) return;
    setSaving(true);

    const payload = {
      name,
      slug,
      country,
      region: region || null,
      short_description: shortDescription || null,
      description: description || null,
      hero_image: form.hero_image.trim() || null,
      is_featured: form.featured,
      is_active: form.status === "Active",
      sort_order: editingId
        ? destinations.find((item) => item.id === editingId)?.sort_order ?? 0
        : destinations.length,
      highlights: editingId
        ? destinations.find((item) => item.id === editingId)?.highlights ?? []
        : [],
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("destinations")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("destinations").insert(payload);
        if (error) throw error;
      }

      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setNotice(editingId ? "Destination updated successfully." : "Destination added successfully.");
      await loadDestinations();
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function deleteDestination(destination: Destination) {
    const confirmed = window.confirm(
      `Delete "${destination.name}" from the destinations catalogue? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setPageError("");
    setNotice("");
    const { error } = await supabase
      .from("destinations")
      .delete()
      .eq("id", destination.id);

    if (error) {
      setPageError(error.message);
      return;
    }

    if (viewDestination?.id === destination.id) setViewDestination(null);
    setNotice(`${destination.name} deleted successfully.`);
    await loadDestinations();
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
            Manage travel destinations, regions and destination details.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Destination management workspace · Connected to Supabase
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

      {pageError && (
        <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {pageError}
          <button type="button" onClick={() => void loadDestinations()} className="ml-3 font-bold underline">
            Retry
          </button>
        </div>
      )}
      {notice && (
        <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Total Destinations", value: destinations.length, note: "Records in Supabase", icon: "⌖", tone: "bg-blue-50 text-blue-700" },
          { title: "Active Destinations", value: activeCount, note: "Visible on the public site", icon: "✓", tone: "bg-emerald-50 text-emerald-700" },
          { title: "Draft Destinations", value: draftCount, note: "Not published", icon: "✎", tone: "bg-amber-50 text-amber-700" },
          { title: "Featured Destinations", value: featuredCount, note: "Highlighted in the catalogue", icon: "☆", tone: "bg-violet-50 text-violet-700" },
        ].map((stat) => (
          <div key={stat.title} className="rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-md sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{stat.value.toLocaleString("en-IN")}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${stat.tone}`}>{stat.icon}</div>
            </div>
            <p className="mt-5 text-xs text-slate-400">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">All Destinations</h2>
            <p className="mt-1 text-xs text-slate-400">
              Changes are saved directly to your Supabase destinations table.
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
            <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} aria-label="Filter by country" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600">
              <option value="All">All countries</option>
              {countries.map((country) => <option key={country} value={country}>{country}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600">
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
            <button type="button" onClick={resetFilters} className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
              Reset filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-slate-500">Loading destinations from Supabase…</div>
        ) : filteredDestinations.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-semibold text-slate-700">No destinations found</p>
            <p className="mt-2 text-xs text-slate-400">
              {destinations.length === 0 ? "Add your first destination to start populating the public website." : "Try changing your search or filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3 sm:p-6">
            {filteredDestinations.map((destination) => (
              <article key={destination.id} className="overflow-hidden rounded-2xl border border-slate-200 transition hover:border-emerald-200 hover:shadow-md">
                <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50">
                  {destination.hero_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={destination.hero_image} alt={destination.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-5xl" aria-hidden="true">🌍</span>
                  )}
                  <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold ${statusStyles[statusOf(destination)]}`}>{statusOf(destination)}</span>
                  <span className="absolute bottom-3 left-3 max-w-[85%] truncate rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{destination.slug}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-slate-900">{destination.name}</h3>
                      <p className="mt-1 text-xs text-slate-400">{[destination.region, destination.country].filter(Boolean).join(", ")}</p>
                    </div>
                    {destination.is_featured && <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">Featured</span>}
                  </div>
                  <p className="mt-4 min-h-[40px] text-xs leading-5 text-slate-500">{destination.short_description || destination.description || "No description added yet."}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[10px] text-slate-400">Sort order: {destination.sort_order}</span>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button type="button" onClick={() => setViewDestination(destination)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-600 hover:text-emerald-700">View</button>
                      <button type="button" onClick={() => openEditModal(destination)} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">Edit</button>
                      <button type="button" onClick={() => void deleteDestination(destination)} className="rounded-lg border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:px-6">
          Showing {filteredDestinations.length} of {destinations.length} destinations
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={() => !saving && setModalOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="destination-form-title" onClick={(event) => event.stopPropagation()} className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="destination-form-title" className="text-xl font-bold text-slate-900">{editingId ? "Edit destination" : "Add destination"}</h2>
                <p className="mt-1 text-xs text-slate-400">Details are saved to the Supabase destinations table.</p>
              </div>
              <button type="button" disabled={saving} onClick={() => setModalOpen(false)} aria-label="Close form" className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100">✕</button>
            </div>

            <form onSubmit={saveDestination} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">Destination name *</span>
                  <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Kashmir" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">Country *</span>
                  <input required value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} placeholder="e.g. India" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">Region</span>
                  <input value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} placeholder="e.g. North India" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">Hero image URL</span>
                  <input type="url" value={form.hero_image} onChange={(event) => setForm({ ...form, hero_image: event.target.value })} placeholder="https://…" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600" />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-600">Short description</span>
                <textarea rows={2} value={form.short_description} onChange={(event) => setForm({ ...form, short_description: event.target.value })} placeholder="A short introduction for destination cards…" className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-600">Full description</span>
                <textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe this destination…" className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600" />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">Publication status</span>
                  <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as DestinationStatus })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600">
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} className="h-4 w-4 accent-emerald-700" />
                  <span className="text-sm font-semibold text-slate-700">Feature on the website</span>
                </label>
              </div>
              {formError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700">{formError}</p>}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button type="button" disabled={saving} onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">
                  {saving ? "Saving…" : editingId ? "Save changes" : "Add destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewDestination && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setViewDestination(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="destination-details-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 text-3xl">
                  {viewDestination.hero_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={viewDestination.hero_image} alt="" className="h-full w-full object-cover" />
                  ) : "🌍"}
                </div>
                <div>
                  <h2 id="destination-details-title" className="text-xl font-bold text-slate-900">{viewDestination.name}</h2>
                  <p className="mt-1 text-xs text-slate-400">{[viewDestination.region, viewDestination.country].filter(Boolean).join(", ")}</p>
                </div>
              </div>
              <button type="button" onClick={() => setViewDestination(null)} aria-label="Close destination details" className="rounded-lg px-3 py-2 hover:bg-slate-100">✕</button>
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-600">{viewDestination.description || viewDestination.short_description || "No description added yet."}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Slug</p><p className="mt-2 break-all text-sm font-bold text-slate-900">{viewDestination.slug}</p></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Sort order</p><p className="mt-2 text-sm font-bold text-slate-900">{viewDestination.sort_order}</p></div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-slate-400">ID: {viewDestination.id}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[statusOf(viewDestination)]}`}>{statusOf(viewDestination)}</span>
            </div>
            <button type="button" onClick={() => setViewDestination(null)} className="mt-5 w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Close details</button>
          </div>
        </div>
      )}

      <footer className="flex flex-col gap-2 py-7 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Hikinhigh Travels. Admin dashboard.</p>
        <p>Destination records are managed in Supabase.</p>
      </footer>
    </div>
  );
}
