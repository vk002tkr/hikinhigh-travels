
"use client";

import { useEffect, useState, type FormEvent } from "react";
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<CruiseRequestResult | null>(null);

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

      setLoading(false);
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

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5">
        <p className="text-sm font-medium text-slate-600">
          Checking your login...
        </p>
      </main>
    );
  }

  if (!accessToken) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-5 py-16">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-3xl">
            ✈
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
            Hikinhigh Travels
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Your cruise journey starts here
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Please log in to your Hikinhigh account before submitting a cruise
            booking request. Your request will be linked to your account.
          </p>

          {authError && (
            <p className="mt-4 text-sm text-red-600">{authError}</p>
          )}

          <Link
            href="/login"
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-sky-700 px-6 py-3.5 font-semibold text-white transition hover:bg-sky-800"
          >
            Log in to continue
          </Link>

          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-slate-600 hover:text-sky-700"
          >
            Back to homepage
          </Link>
        </section>
      </main>
    );
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
      <section className="relative overflow-hidden bg-slate-950 px-5 py-16 text-white sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 via-slate-950 to-indigo-950" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300">
            Explore the seas with Hikinhigh
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Your next great journey begins on the water.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Tell us what your ideal cruise looks like. Our team will review
            your preferences and get back to you with suitable options.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/20 px-4 py-2">
              Personalised cruise enquiries
            </span>
            <span className="rounded-full border border-white/20 px-4 py-2">
              Dedicated travel assistance
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-5 max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-9">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
              Cruise enquiry
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Plan your cruise
            </h2>
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
      </section>
    </main>
  );
}
