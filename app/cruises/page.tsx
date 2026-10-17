
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type CruiseForm = {
  cruise_name: string;
  destination: string;
  departure_port: string;
  departure_date: string;
  return_date: string;
  adults: number;
  children: number;
  cabin_preference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests: string;
};

type PublicCruise = {
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
  inclusions: string[] | null;
  cabin_types: string[] | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  created_at: string;
};

type CruiseRequestResult = {
  message?: string;
  error?: string;
  request?: {
    id: string;
    booking_reference: string;
    status: string;
    created_at: string;
  };
};

const initialForm: CruiseForm = {
  cruise_name: "",
  destination: "",
  departure_port: "",
  departure_date: "",
  return_date: "",
  adults: 2,
  children: 0,
  cabin_preference: "No preference",
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  special_requests: "",
};

const today = new Date().toLocaleDateString("en-CA");

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100";

const labelClass = "block text-sm font-semibold text-slate-700";

export default function CruisesPage() {
  const [form, setForm] = useState<CruiseForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<CruiseRequestResult | null>(null);
  const [cruises, setCruises] = useState<PublicCruise[]>([]);
  const [cruisesLoading, setCruisesLoading] = useState(true);
  const [cruisesError, setCruisesError] = useState("");
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    travellers: 2,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const destination = params.get("destination")?.trim() ?? "";
    const checkIn = params.get("checkIn") ?? "";
    const checkOut = params.get("checkOut") ?? "";
    const parsedTravellers = Number(params.get("travellers") ?? 2);
    const travellers = Number.isFinite(parsedTravellers)
      ? Math.min(10, Math.max(1, Math.floor(parsedTravellers)))
      : 2;

    setSearchCriteria({ destination, checkIn, checkOut, travellers });
    setForm((current) => ({
      ...current,
      destination: destination || current.destination,
      departure_date: checkIn || current.departure_date,
      return_date: checkOut || current.return_date,
      adults: travellers,
    }));
  }, []);

  const filteredCruises = useMemo(() => {
    const destination = searchCriteria.destination.toLowerCase();
    return cruises.filter((cruise) => {
      const destinationMatch = !destination || [
        cruise.destination,
        cruise.name,
        cruise.cruise_line,
        cruise.departure_port ?? "",
      ].some((value) => value.toLowerCase().includes(destination));

      const departure = cruise.departure_date?.slice(0, 10) ?? "";
      const returning = cruise.return_date?.slice(0, 10) ?? "";
      const departureMatch = !searchCriteria.checkIn || !departure || departure >= searchCriteria.checkIn;
      const returnMatch = !searchCriteria.checkOut || !returning || returning <= searchCriteria.checkOut;

      return destinationMatch && departureMatch && returnMatch;
    });
  }, [cruises, searchCriteria]);

  useEffect(() => {
    let mounted = true;

    async function loadPublishedCruises() {
      setCruisesLoading(true);
      setCruisesError("");

      const { data, error: queryError } = await supabase
        .from("cruises")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (queryError) {
        console.error("Public cruise catalogue load failed:", queryError.message);
        setCruisesError(
          "We couldn't load the cruise catalogue right now. Please try again shortly."
        );
        setCruises([]);
      } else {
        setCruises((data ?? []) as PublicCruise[]);
      }

      setCruisesLoading(false);
    }

    void loadPublishedCruises();

    return () => {
      mounted = false;
    };
  }, []);

  function formatCruisePrice(amount: number, currency: string) {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currency || "INR"} ${amount.toLocaleString("en-IN")}`;
    }
  }

  function formatCruiseDate(value: string | null) {
    if (!value) return "Dates on request";
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function enquireAboutCruise(cruise: PublicCruise) {
    setForm((current) => ({
      ...current,
      cruise_name: cruise.name,
      destination: cruise.destination,
      departure_port: cruise.departure_port ?? "",
      departure_date: cruise.departure_date ?? "",
      return_date: cruise.return_date ?? "",
    }));
    setError("");
    setResult(null);
    setIsEnquiryOpen(true);
  }

  useEffect(() => {
    if (!isEnquiryOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsEnquiryOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isEnquiryOpen]);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setAuthError("Unable to check your login. Please refresh the page.");
      } else if (session?.access_token) {
        setAccessToken(session.access_token);

        setForm((current) => ({
          ...current,
          customer_name:
            current.customer_name ||
            String(
              session.user.user_metadata?.full_name ??
                session.user.user_metadata?.name ??
                ""
            ),
          customer_email:
            current.customer_email || session.user.email || "",
        }));
      }

    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setAccessToken(session?.access_token ?? "");

      if (!session) {
        setResult(null);
      }

      if (session) {
        setForm((current) => ({
          ...current,
          customer_email:
            current.customer_email || session.user.email || "",
          customer_name:
            current.customer_name ||
            String(
              session.user.user_metadata?.full_name ??
                session.user.user_metadata?.name ??
                ""
            ),
        }));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function updateField<K extends keyof CruiseForm>(
    key: K,
    value: CruiseForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!accessToken) {
      setError("Please log in before submitting your cruise request.");
      return;
    }

    if (form.return_date && form.return_date < form.departure_date) {
      setError("Return date cannot be earlier than departure date.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/cruise-booking-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });

      const data: CruiseRequestResult = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to submit your request.");
        return;
      }

      setResult(data);
      setForm((current) => ({
        ...initialForm,
        customer_name: current.customer_name,
        customer_email: current.customer_email,
        customer_phone: current.customer_phone,
      }));
    } catch {
      setError(
        "Something went wrong while submitting your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.request) {
    return (
      <main className="min-h-[75vh] bg-slate-50 px-5 py-16">
        <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-700">
            ✓
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            Request submitted
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Thank you for choosing Hikinhigh!
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Your cruise request has been received. Our team will review your
            requirements and confirm availability and pricing separately.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Your request reference</p>
            <p className="mt-2 break-all text-2xl font-bold tracking-wide text-sky-800">
              {result.request.booking_reference}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Status:{" "}
              <span className="font-semibold capitalize">
                {result.request.status.replaceAll("_", " ")}
              </span>
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setError("");
                setIsEnquiryOpen(true);
              }}
              className="rounded-xl bg-sky-700 px-6 py-3 font-semibold text-white hover:bg-sky-800"
            >
              Submit another request
            </button>

            <Link
              href="/"
              className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to homepage
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <section className="relative isolate min-h-[540px] overflow-hidden bg-[#061b32] px-5 py-20 text-white sm:min-h-[620px] sm:py-28">
        <div className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#031323]/95 via-[#061b32]/75 to-[#061b32]/20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
        <div className="relative mx-auto flex max-w-7xl items-center">
          <div className="max-w-3xl py-5 sm:py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-amber-200 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> The world looks better from the sea
            </span>
            <h1 className="mt-7 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Find your <span className="font-serif italic text-amber-200">escape</span><br className="hidden sm:block" /> beyond the horizon.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-100/90 sm:text-lg sm:leading-8">
              Discover remarkable ships, unforgettable coastlines and journeys designed around the way you want to travel.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#cruise-collection" className="inline-flex items-center justify-center rounded-full bg-amber-300 px-7 py-4 text-sm font-extrabold text-[#08213a] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-amber-200">Explore cruises <span className="ml-3 text-lg">↘</span></a>
              <button type="button" onClick={() => { setForm((current) => ({ ...current, cruise_name: "", destination: "", departure_port: "", departure_date: "", return_date: "" })); setIsEnquiryOpen(true); }} className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20">Plan my voyage</button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-white/85 sm:text-sm">
              <span>✦ Curated cruise experiences</span><span>✦ Personal travel assistance</span><span>✦ Tailored to you</span>
            </div>
          </div>
        </div>
      </section>

      <section id="cruise-collection" className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">
              Find your voyage
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Explore our cruises
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Find your next voyage from our selected cruises. Choose a sailing to personalise your enquiry.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            {cruisesLoading ? "Discovering voyages…" : `${filteredCruises.length} ${filteredCruises.length === 1 ? "voyage" : "voyages"} available`}
          </span>
        </div>

        {cruisesError ? (
          <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            {cruisesError} If this continues, check the public read policy for the Supabase <code>cruises</code> table.
          </div>
        ) : cruisesLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="h-52 animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCruises.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-3xl">🚢</div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{cruises.length === 0 ? "New cruises are on the way" : "No cruises match your search"}</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
{cruises.length === 0 ? "Our team is preparing the catalogue. Share your preferred destination and we’ll help you explore the right sailing." : "Try another destination or adjust your travel dates to see more available sailings."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCruises.map((cruise) => (
              <article key={cruise.id} className="group overflow-hidden rounded-[1.65rem] border border-slate-200/80 bg-white shadow-[0_10px_40px_-25px_rgba(7,35,60,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_55px_-25px_rgba(7,35,60,0.4)]">
                <div className="relative h-60 overflow-hidden bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-950 sm:h-64">
                  {cruise.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cruise.cover_image_url} alt={cruise.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl text-white/90">🚢</div>
                  )}
                  {cruise.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-sky-800 shadow-sm">
                      Featured cruise
                    </span>
                  )}
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-700">{cruise.cruise_line || "Hikinhigh curated voyage"}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{cruise.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <span aria-hidden="true">📍</span>{cruise.destination}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {cruise.departure_port ? `Departs from ${cruise.departure_port}` : "Departure port on request"}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Departure</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{formatCruiseDate(cruise.departure_date)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Duration</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{cruise.duration_nights ? `${cruise.duration_nights} nights` : "To be confirmed"}</p>
                    </div>
                  </div>
                  {cruise.short_description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{cruise.short_description}</p>
                  )}
                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Starting from</p>
                      <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">{formatCruisePrice(Number(cruise.price_from), cruise.currency)}</p>
                      <p className="mt-1 text-[11px] text-slate-500">Per person / package details on enquiry</p>
                    </div>
                    <button type="button" onClick={() => enquireAboutCruise(cruise)} className="shrink-0 rounded-full bg-[#08213a] px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                      Enquire <span aria-hidden="true" className="ml-1">↗</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isEnquiryOpen && (
      <div id="cruise-enquiry" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsEnquiryOpen(false); }} className="fixed inset-0 z-[100] flex items-end justify-center bg-[#031323]/75 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <section role="dialog" aria-modal="true" aria-labelledby="cruise-enquiry-title" className="relative max-h-[94dvh] w-full max-w-4xl overflow-y-auto rounded-t-[1.75rem] bg-slate-50 shadow-2xl sm:max-h-[90dvh] sm:rounded-[1.75rem]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-sky-700">Hikinhigh cruise concierge</p>
            <h2 id="cruise-enquiry-title" className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">Let’s plan your voyage</h2>
            <p className="mt-1 text-xs text-slate-500">Tell us a little about your ideal cruise.</p>
          </div>
          <button type="button" aria-label="Close cruise enquiry" onClick={() => setIsEnquiryOpen(false)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl leading-none text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">×</button>
        </div>
        {!accessToken ? (
          <div className="m-4 rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:m-8 sm:p-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-3xl">✈</div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Hikinhigh Travels</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ready to enquire about a cruise?</h2>
            <p className="mt-4 leading-7 text-slate-600">Browse the published cruises above, then log in to submit an enquiry. Your request will be linked securely to your account.</p>
            {authError && <p className="mt-4 text-sm text-red-600">{authError}</p>}
            <Link href="/login" className="mt-7 inline-flex items-center justify-center rounded-xl bg-sky-700 px-6 py-3.5 font-semibold text-white transition hover:bg-sky-800">Log in to enquire</Link>
          </div>
        ) : (
        <div className="p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
              Cruise enquiry
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              Cruise details & preferences
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Fields marked with * are required. Submitting this form sends a
              request, not a confirmed reservation.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                1. Cruise details
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Cruise name or preferred cruise *
                  <input
                    className={fieldClass}
                    value={form.cruise_name}
                    onChange={(e) =>
                      updateField("cruise_name", e.target.value)
                    }
                    placeholder="Enter cruise name or type"
                    maxLength={150}
                    required
                  />
                </label>

                <label className={labelClass}>
                  Destination *
                  <input
                    className={fieldClass}
                    value={form.destination}
                    onChange={(e) =>
                      updateField("destination", e.target.value)
                    }
                    placeholder="e.g. Mediterranean, Caribbean"
                    maxLength={150}
                    required
                  />
                </label>

                <label className={labelClass}>
                  Departure port
                  <input
                    className={fieldClass}
                    value={form.departure_port}
                    onChange={(e) =>
                      updateField("departure_port", e.target.value)
                    }
                    placeholder="e.g. Mumbai, Singapore"
                    maxLength={150}
                  />
                </label>

                <label className={labelClass}>
                  Cabin preference
                  <select
                    className={fieldClass}
                    value={form.cabin_preference}
                    onChange={(e) =>
                      updateField("cabin_preference", e.target.value)
                    }
                  >
                    <option>No preference</option>
                    <option>Interior</option>
                    <option>Ocean View</option>
                    <option>Balcony</option>
                    <option>Suite</option>
                  </select>
                </label>

                <label className={labelClass}>
                  Departure date *
                  <input
                    type="date"
                    className={fieldClass}
                    value={form.departure_date}
                    min={today}
                    onChange={(e) =>
                      updateField("departure_date", e.target.value)
                    }
                    required
                  />
                </label>

                <label className={labelClass}>
                  Return date
                  <input
                    type="date"
                    className={fieldClass}
                    value={form.return_date}
                    min={form.departure_date || today}
                    onChange={(e) =>
                      updateField("return_date", e.target.value)
                    }
                  />
                </label>
              </div>
            </section>

            <div className="border-t border-slate-100" />

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                2. Passengers
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Adults *
                  <input
                    type="number"
                    className={fieldClass}
                    value={form.adults}
                    min={1}
                    max={20}
                    onChange={(e) =>
                      updateField("adults", Number(e.target.value))
                    }
                    required
                  />
                </label>

                <label className={labelClass}>
                  Children
                  <input
                    type="number"
                    className={fieldClass}
                    value={form.children}
                    min={0}
                    max={20}
                    onChange={(e) =>
                      updateField("children", Number(e.target.value))
                    }
                  />
                </label>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Maximum 20 passengers per request.
              </p>
            </section>

            <div className="border-t border-slate-100" />

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                3. Contact information
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Full name *
                  <input
                    className={fieldClass}
                    value={form.customer_name}
                    onChange={(e) =>
                      updateField("customer_name", e.target.value)
                    }
                    placeholder="Your full name"
                    maxLength={150}
                    autoComplete="name"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Email address *
                  <input
                    type="email"
                    className={fieldClass}
                    value={form.customer_email}
                    onChange={(e) =>
                      updateField("customer_email", e.target.value)
                    }
                    placeholder="you@example.com"
                    maxLength={254}
                    autoComplete="email"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Phone number *
                  <input
                    type="tel"
                    className={fieldClass}
                    value={form.customer_phone}
                    onChange={(e) =>
                      updateField("customer_phone", e.target.value)
                    }
                    placeholder="+91 ..."
                    maxLength={30}
                    autoComplete="tel"
                    required
                  />
                </label>
              </div>

              <label className={`${labelClass} mt-5`}>
                Special requests
                <textarea
                  className={fieldClass}
                  value={form.special_requests}
                  onChange={(e) =>
                    updateField("special_requests", e.target.value)
                  }
                  placeholder="Tell us about any preferences or requirements."
                  rows={4}
                  maxLength={2000}
                />
              </label>
            </section>

            <div className="rounded-xl bg-sky-50 p-4 text-sm leading-6 text-sky-900">
              <strong>What happens next?</strong>
              <p className="mt-1">
                Your request will be recorded against your account. Our team
                will review your requirements and contact you regarding
                availability, pricing and the next steps.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-xl bg-sky-700 px-6 py-4 font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting your request..."
                : "Submit cruise request"}
            </button>
          </form>
        </div>
        )}
      </section>
      </div>
      )}
    </main>
  );
}
