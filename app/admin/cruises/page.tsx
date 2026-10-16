"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type CruiseStatus = "draft" | "published" | "archived";

type Cruise = {
  id: string;
  name: string;
  slug: string;
  cruise_line: string;
  destination: string;
  departure_port: string | null;
  departure_date: string | null;
  return_date: string | null;
  duration_nights: number | null;
  price_from: number;
  currency: string;
  short_description: string | null;
  description: string | null;
  cover_image_url: string | null;
  gallery_image_urls: string[];
  inclusions: string[];
  cabin_types: string[];
  status: CruiseStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

type CruiseForm = {
  name: string;
  slug: string;
  cruise_line: string;
  destination: string;
  departure_port: string;
  departure_date: string;
  return_date: string;
  duration_nights: string;
  price_from: string;
  currency: string;
  short_description: string;
  description: string;
  cover_image_url: string;
  gallery_image_urls: string;
  inclusions: string;
  cabin_types: string;
  status: CruiseStatus;
  featured: boolean;
};

const emptyForm: CruiseForm = {
  name: "",
  slug: "",
  cruise_line: "",
  destination: "",
  departure_port: "",
  departure_date: "",
  return_date: "",
  duration_nights: "",
  price_from: "0",
  currency: "INR",
  short_description: "",
  description: "",
  cover_image_url: "",
  gallery_image_urls: "",
  inclusions: "",
  cabin_types: "",
  status: "draft",
  featured: false,
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
const labelClass = "block text-sm font-semibold text-slate-700";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency || "INR"} ${Number(value).toLocaleString("en-IN")}`;
  }
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
}

function toForm(cruise: Cruise): CruiseForm {
  return {
    name: cruise.name ?? "",
    slug: cruise.slug ?? "",
    cruise_line: cruise.cruise_line ?? "",
    destination: cruise.destination ?? "",
    departure_port: cruise.departure_port ?? "",
    departure_date: cruise.departure_date?.slice(0, 10) ?? "",
    return_date: cruise.return_date?.slice(0, 10) ?? "",
    duration_nights:
      cruise.duration_nights == null ? "" : String(cruise.duration_nights),
    price_from: String(cruise.price_from ?? 0),
    currency: cruise.currency ?? "INR",
    short_description: cruise.short_description ?? "",
    description: cruise.description ?? "",
    cover_image_url: cruise.cover_image_url ?? "",
    gallery_image_urls: (cruise.gallery_image_urls ?? []).join("\n"),
    inclusions: (cruise.inclusions ?? []).join("\n"),
    cabin_types: (cruise.cabin_types ?? []).join("\n"),
    status: cruise.status,
    featured: Boolean(cruise.featured),
  };
}

function statusStyle(status: CruiseStatus) {
  if (status === "published") return "bg-emerald-50 text-emerald-700";
  if (status === "archived") return "bg-slate-100 text-slate-600";
  return "bg-amber-50 text-amber-700";
}

export default function AdminCruisesPage() {
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CruiseStatus>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CruiseForm>(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCruises = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("cruises")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setCruises([]);
    } else {
      setCruises((data ?? []) as Cruise[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadCruises();
  }, [loadCruises]);

  const filteredCruises = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cruises.filter((cruise) => {
      const matchesQuery = [
        cruise.name,
        cruise.cruise_line,
        cruise.destination,
        cruise.departure_port ?? "",
        cruise.slug,
      ].some((value) => value.toLowerCase().includes(query));
      return (
        matchesQuery &&
        (statusFilter === "all" || cruise.status === statusFilter)
      );
    });
  }, [cruises, search, statusFilter]);

  const publishedCount = cruises.filter((cruise) => cruise.status === "published").length;
  const draftCount = cruises.filter((cruise) => cruise.status === "draft").length;
  const featuredCount = cruises.filter((cruise) => cruise.featured).length;

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEdit(cruise: Cruise) {
    setEditingId(cruise.id);
    setForm(toForm(cruise));
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function updateForm<K extends keyof CruiseForm>(key: K, value: CruiseForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveCruise(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const name = form.name.trim();
    const slug = slugify(form.slug || form.name);
    const cruiseLine = form.cruise_line.trim();
    const destination = form.destination.trim();
    const price = Number(form.price_from);
    const duration = form.duration_nights.trim()
      ? Number(form.duration_nights)
      : null;

    if (!name || !slug || !cruiseLine || !destination) {
      setError("Please fill in the cruise name, slug, cruise line and destination.");
      setSaving(false);
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid non-negative starting price.");
      setSaving(false);
      return;
    }
    if (duration !== null && (!Number.isInteger(duration) || duration <= 0)) {
      setError("Duration must be a positive whole number of nights.");
      setSaving(false);
      return;
    }
    if (
      form.departure_date &&
      form.return_date &&
      form.return_date < form.departure_date
    ) {
      setError("Return date cannot be earlier than departure date.");
      setSaving(false);
      return;
    }

    const payload = {
      name,
      slug,
      cruise_line: cruiseLine,
      destination,
      departure_port: form.departure_port.trim() || null,
      departure_date: form.departure_date || null,
      return_date: form.return_date || null,
      duration_nights: duration,
      price_from: price,
      currency: form.currency.trim().toUpperCase() || "INR",
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      cover_image_url: form.cover_image_url.trim() || null,
      gallery_image_urls: splitLines(form.gallery_image_urls),
      inclusions: splitLines(form.inclusions),
      cabin_types: splitLines(form.cabin_types),
      status: form.status,
      featured: form.featured,
      updated_at: new Date().toISOString(),
    };

    const result = editingId
      ? await supabase.from("cruises").update(payload).eq("id", editingId).select().single()
      : await supabase
          .from("cruises")
          .insert({ ...payload, created_by: (await supabase.auth.getUser()).data.user?.id ?? null })
          .select()
          .single();

    if (result.error) {
      setError(
        result.error.code === "23505"
          ? "This slug is already in use. Please choose a unique slug."
          : result.error.message,
      );
      setSaving(false);
      return;
    }

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setNotice(editingId ? "Cruise updated successfully." : "Cruise added successfully.");
    setSaving(false);
    await loadCruises();
  }

  async function changeStatus(cruise: Cruise, status: CruiseStatus) {
    setError("");
    setNotice("");
    const { error: updateError } = await supabase
      .from("cruises")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", cruise.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setNotice(`${cruise.name} is now ${status}.`);
    await loadCruises();
  }

  async function deleteCruise(cruise: Cruise) {
    const confirmed = window.confirm(
      `Permanently delete "${cruise.name}" from the cruise catalogue?`,
    );
    if (!confirmed) return;

    setError("");
    setNotice("");
    const { error: deleteError } = await supabase
      .from("cruises")
      .delete()
      .eq("id", cruise.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice(`${cruise.name} deleted.`);
    await loadCruises();
  }

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">
            Create and manage cruise experiences displayed in the public catalogue.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Cruise catalogue · Supabase database
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
        >
          <span className="text-lg">+</span> Add cruise
        </button>
      </div>

      {error && !modalOpen && (
        <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Total cruises", value: cruises.length, note: "All catalogue records" },
          { title: "Published", value: publishedCount, note: "Visible to website visitors" },
          { title: "Drafts", value: draftCount, note: "Not visible publicly" },
          { title: "Featured", value: featuredCount, note: "Marked as featured" },
        ].map((stat) => (
          <div key={stat.title} className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {loading ? "—" : stat.value.toLocaleString("en-IN")}
            </p>
            <p className="mt-3 text-xs text-slate-400">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">All cruises</h2>
            <p className="mt-1 text-xs text-slate-400">
              Add cruise details here. Only published cruises should appear on the public website.
            </p>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_200px_auto]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, cruise line, destination..."
              aria-label="Search cruises"
              className={inputClass.replace("mt-1.5 ", "")}
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "all" | CruiseStatus)}
              aria-label="Filter by status"
              className={inputClass.replace("mt-1.5 ", "")}
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button
              type="button"
              onClick={() => { setSearch(""); setStatusFilter("all"); }}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-slate-500">Loading cruises from Supabase…</div>
        ) : filteredCruises.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">🚢</div>
            <p className="mt-4 text-sm font-semibold text-slate-800">
              {cruises.length === 0 ? "No cruises added yet" : "No cruises match your filters"}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {cruises.length === 0 ? "Add your first cruise to start building the catalogue." : "Try another search or status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-bold">Cruise</th>
                  <th className="px-5 py-4 font-bold">Destination / Port</th>
                  <th className="px-5 py-4 font-bold">Departure</th>
                  <th className="px-5 py-4 font-bold">Starting price</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCruises.map((cruise) => (
                  <tr key={cruise.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {cruise.cover_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cruise.cover_image_url} alt="" className="h-14 w-20 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-2xl">🚢</div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{cruise.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{cruise.cruise_line}</p>
                          <p className="mt-1 text-[10px] text-slate-400">/{cruise.slug}</p>
                        </div>
                        {cruise.featured && <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">Featured</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <p>{cruise.destination}</p>
                      <p className="mt-1 text-xs text-slate-400">{cruise.departure_port || "Port not set"}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(cruise.departure_date)}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">{formatMoney(Number(cruise.price_from), cruise.currency)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(cruise.status)}`}>
                        {cruise.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => openEdit(cruise)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700">Edit</button>
                        {cruise.status !== "published" ? (
                          <button type="button" onClick={() => void changeStatus(cruise, "published")} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800">Publish</button>
                        ) : (
                          <button type="button" onClick={() => void changeStatus(cruise, "draft")} className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100">Unpublish</button>
                        )}
                        <button type="button" onClick={() => void deleteCruise(cruise)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400">
          Showing {filteredCruises.length} of {cruises.length} cruises
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="cruise-form-title" className="my-auto w-full max-w-4xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="cruise-form-title" className="text-xl font-bold text-slate-900">{editingId ? "Edit cruise" : "Add cruise"}</h2>
                <p className="mt-1 text-xs text-slate-500">Fields marked * are required.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close form" className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100">✕</button>
            </div>

            <form onSubmit={saveCruise} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className={labelClass}>Cruise name *
                  <input required value={form.name} onChange={(event) => { const value = event.target.value; setForm((current) => ({ ...current, name: value, slug: editingId ? current.slug : slugify(value) })); }} placeholder="e.g. Singapore Island Cruise" className={inputClass} />
                </label>
                <label className={labelClass}>URL slug *
                  <input required value={form.slug} onChange={(event) => updateForm("slug", slugify(event.target.value))} placeholder="singapore-island-cruise" className={inputClass} />
                </label>
                <label className={labelClass}>Cruise line *
                  <input required value={form.cruise_line} onChange={(event) => updateForm("cruise_line", event.target.value)} placeholder="Cruise operator" className={inputClass} />
                </label>
                <label className={labelClass}>Destination *
                  <input required value={form.destination} onChange={(event) => updateForm("destination", event.target.value)} placeholder="e.g. Singapore" className={inputClass} />
                </label>
                <label className={labelClass}>Departure port
                  <input value={form.departure_port} onChange={(event) => updateForm("departure_port", event.target.value)} placeholder="e.g. Marina Bay Cruise Centre" className={inputClass} />
                </label>
                <label className={labelClass}>Starting price *
                  <input required type="number" min="0" step="0.01" value={form.price_from} onChange={(event) => updateForm("price_from", event.target.value)} className={inputClass} />
                </label>
                <label className={labelClass}>Currency
                  <select value={form.currency} onChange={(event) => updateForm("currency", event.target.value)} className={inputClass}>
                    <option value="INR">INR — Indian Rupee</option><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option><option value="SGD">SGD — Singapore Dollar</option><option value="AED">AED — UAE Dirham</option>
                  </select>
                </label>
                <label className={labelClass}>Departure date
                  <input type="date" value={form.departure_date} onChange={(event) => updateForm("departure_date", event.target.value)} className={inputClass} />
                </label>
                <label className={labelClass}>Return date
                  <input type="date" min={form.departure_date || undefined} value={form.return_date} onChange={(event) => updateForm("return_date", event.target.value)} className={inputClass} />
                </label>
                <label className={labelClass}>Duration (nights)
                  <input type="number" min="1" step="1" value={form.duration_nights} onChange={(event) => updateForm("duration_nights", event.target.value)} placeholder="e.g. 4" className={inputClass} />
                </label>
                <label className={labelClass}>Publication status
                  <select value={form.status} onChange={(event) => updateForm("status", event.target.value as CruiseStatus)} className={inputClass}>
                    <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                  </select>
                </label>
                <label className={labelClass}>Cover image URL
                  <input type="url" value={form.cover_image_url} onChange={(event) => updateForm("cover_image_url", event.target.value)} placeholder="https://..." className={inputClass} />
                </label>
              </div>

              <label className={labelClass}>Short description
                <textarea rows={2} value={form.short_description} onChange={(event) => updateForm("short_description", event.target.value)} placeholder="A short summary for cruise cards..." className={inputClass} />
              </label>
              <label className={labelClass}>Full description
                <textarea rows={4} value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Describe the itinerary, experience and highlights..." className={inputClass} />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className={labelClass}>Gallery image URLs
                  <textarea rows={4} value={form.gallery_image_urls} onChange={(event) => updateForm("gallery_image_urls", event.target.value)} placeholder="One URL per line" className={inputClass} />
                </label>
                <label className={labelClass}>Inclusions
                  <textarea rows={4} value={form.inclusions} onChange={(event) => updateForm("inclusions", event.target.value)} placeholder="One inclusion per line" className={inputClass} />
                </label>
                <label className={labelClass}>Cabin types
                  <textarea rows={4} value={form.cabin_types} onChange={(event) => updateForm("cabin_types", event.target.value)} placeholder="Interior cabin&#10;Ocean view&#10;Balcony" className={inputClass} />
                </label>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={form.featured} onChange={(event) => updateForm("featured", event.target.checked)} className="h-4 w-4 accent-emerald-700" />
                Feature this cruise in catalogue highlights
              </label>

              {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? "Saving..." : editingId ? "Save changes" : "Add cruise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
