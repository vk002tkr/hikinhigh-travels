
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type CruiseRequest = {
  id: string;
  booking_reference: string;
  user_id: string;
  cruise_name: string;
  destination: string;
  departure_port: string | null;
  departure_date: string;
  return_date: string | null;
  adults: number;
  children: number;
  cabin_preference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests: string | null;
  status: string;
  quoted_price: number | null;
  quoted_currency: string;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  error?: string;
  requests?: CruiseRequest[];
  request?: CruiseRequest;
  message?: string;
};

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under review" },
  { value: "quoted", label: "Quoted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const currencies = ["INR", "USD", "EUR", "GBP"];

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function statusClass(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700";
    case "quoted":
      return "bg-blue-50 text-blue-700";
    case "under_review":
      return "bg-amber-50 text-amber-700";
    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100";

const labelClass = "block text-sm font-semibold text-slate-700";

export default function AdminCruiseRequestsPage() {
  const [requests, setRequests] = useState<CruiseRequest[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [adminVerified, setAdminVerified] = useState(false);

  const [editStatus, setEditStatus] = useState("pending");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [quotedCurrency, setQuotedCurrency] = useState("INR");
  const [adminNotes, setAdminNotes] = useState("");

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId]
  );

  const loadRequests = useCallback(async (token: string) => {
    const response = await fetch("/api/cruise-booking-requests", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to load cruise requests.");
    }

    setRequests(data.requests ?? []);

    return data.requests ?? [];
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initialise() {
      setLoading(true);
      setError("");

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error("Unable to verify your login session.");
        }

        if (!session?.access_token) {
          throw new Error("Please log in to access the admin panel.");
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser(session.access_token);

        if (userError || !user) {
          throw new Error("Your login session has expired. Please log in again.");
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, is_active")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          throw new Error("Unable to verify your administrator profile.");
        }

        if (
          !profile ||
          profile.role !== "admin" ||
          profile.is_active !== true
        ) {
          throw new Error("You do not have permission to view cruise requests.");
        }

        if (!mounted) return;

        setAccessToken(session.access_token);
        setAdminVerified(true);

        await loadRequests(session.access_token);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading cruise requests."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void initialise();

    return () => {
      mounted = false;
    };
  }, [loadRequests]);

  useEffect(() => {
    if (!selectedRequest) return;

    setEditStatus(selectedRequest.status);
    setQuotedPrice(
      selectedRequest.quoted_price === null
        ? ""
        : String(selectedRequest.quoted_price)
    );
    setQuotedCurrency(selectedRequest.quoted_currency || "INR");
    setAdminNotes(selectedRequest.admin_notes || "");
  }, [selectedRequest]);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      const searchable = [
        request.booking_reference,
        request.customer_name,
        request.customer_email,
        request.customer_phone,
        request.cruise_name,
        request.destination,
        request.departure_port ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [requests, search, statusFilter]);

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((item) => item.status === "pending").length,
      review: requests.filter((item) => item.status === "under_review").length,
      quoted: requests.filter((item) => item.status === "quoted").length,
      confirmed: requests.filter((item) => item.status === "confirmed").length,
    }),
    [requests]
  );

  async function refreshRequests() {
    if (!accessToken) return;

    setError("");
    setNotice("");

    try {
      await loadRequests(accessToken);
      setNotice("Cruise requests refreshed.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to refresh requests."
      );
    }
  }

  async function saveChanges() {
    if (!selectedRequest || !accessToken) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      let parsedPrice: number | null = null;

      if (quotedPrice.trim() !== "") {
        parsedPrice = Number(quotedPrice);

        if (
          !Number.isFinite(parsedPrice) ||
          parsedPrice < 0 ||
          parsedPrice > 9999999999
        ) {
          throw new Error("Enter a valid quoted price.");
        }
      }

      if (editStatus === "quoted" && parsedPrice === null) {
        throw new Error("Enter a price before changing the status to Quoted.");
      }

      if (!currencies.includes(quotedCurrency)) {
        throw new Error("Select a valid currency.");
      }

      const response = await fetch("/api/cruise-booking-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: selectedRequest.id,
          status: editStatus,
          quoted_price: parsedPrice,
          quoted_currency: quotedCurrency,
          admin_notes: adminNotes,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save changes.");
      }

      await loadRequests(accessToken);
      setNotice(
        data.message || "Cruise request updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Loading cruise requests...
        </p>
      </div>
    );
  }

  if (!adminVerified) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">
          Unable to open cruise requests
        </h1>
        <p className="mt-3 text-sm leading-6 text-red-700">
          {error || "Administrator access is required."}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Please confirm that you are signed in with an active administrator
          account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
            Booking management
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Cruise Requests
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review customer enquiries and manage their quotation status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refreshRequests()}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Refresh requests
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {notice}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { label: "Total requests", value: counts.total },
          { label: "Pending", value: counts.pending },
          { label: "Under review", value: counts.review },
          { label: "Quoted", value: counts.quoted },
          { label: "Confirmed", value: counts.confirmed },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(350px,0.8fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-3 border-b border-slate-100 p-4 sm:p-5">
            <h2 className="font-bold text-slate-900">
              Customer enquiries
            </h2>

            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-600"
              placeholder="Search reference, customer, cruise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-slate-800">
                No cruise requests found
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                New customer enquiries will appear here after they are
                submitted successfully.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRequests.map((request) => (
                <button
                  type="button"
                  key={request.id}
                  onClick={() => {
                    setSelectedId(request.id);
                    setError("");
                    setNotice("");
                  }}
                  className={`block w-full p-4 text-left transition hover:bg-slate-50 sm:p-5 ${
                    selectedId === request.id
                      ? "bg-sky-50 ring-1 ring-inset ring-sky-200"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-all text-sm font-bold text-sky-800">
                        {request.booking_reference}
                      </p>
                      <h3 className="mt-2 break-words font-bold text-slate-900">
                        {request.cruise_name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {request.destination}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass(
                        request.status
                      )}`}
                    >
                      {formatStatus(request.status)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                    <span>{request.customer_name}</span>
                    <span>{formatDate(request.departure_date)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {!selectedRequest ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl">
                ≋
              </div>
              <h2 className="mt-4 font-bold text-slate-900">
                Select a cruise request
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose a customer enquiry from the list to view its details
                and update its status.
              </p>
            </div>
          ) : (
            <div className="space-y-6 p-5">
              <div className="border-b border-slate-100 pb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-700">
                  Request details
                </p>
                <h2 className="mt-2 break-all text-xl font-bold text-slate-900">
                  {selectedRequest.booking_reference}
                </h2>
                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass(
                    selectedRequest.status
                  )}`}
                >
                  {formatStatus(selectedRequest.status)}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedRequest.customer_name}
                  </p>
                  <p className="mt-1 break-all text-slate-600">
                    {selectedRequest.customer_email}
                  </p>
                  <p className="mt-1 text-slate-600">
                    {selectedRequest.customer_phone}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Destination
                    </p>
                    <p className="mt-1 break-words font-medium text-slate-900">
                      {selectedRequest.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Cruise
                    </p>
                    <p className="mt-1 break-words font-medium text-slate-900">
                      {selectedRequest.cruise_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Departure
                    </p>
                    <p className="mt-1 text-slate-900">
                      {formatDate(selectedRequest.departure_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Return
                    </p>
                    <p className="mt-1 text-slate-900">
                      {formatDate(selectedRequest.return_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Departure port
                    </p>
                    <p className="mt-1 text-slate-900">
                      {selectedRequest.departure_port || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Passengers
                    </p>
                    <p className="mt-1 text-slate-900">
                      {selectedRequest.adults} adults, {selectedRequest.children}{" "}
                      children
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cabin preference
                  </p>
                  <p className="mt-1 text-slate-900">
                    {selectedRequest.cabin_preference}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer notes
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-slate-700">
                    {selectedRequest.special_requests || "No special requests"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Submitted
                  </p>
                  <p className="mt-1 text-slate-700">
                    {formatDateTime(selectedRequest.created_at)}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="font-bold text-slate-900">
                  Update request
                </h3>

                <div className="mt-4 space-y-4">
                  <label className={labelClass}>
                    Status
                    <select
                      className={inputClass}
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-3">
                    <label className={labelClass}>
                      Quoted price
                      <input
                        type="number"
                        min="0"
                        max="9999999999"
                        step="0.01"
                        className={inputClass}
                        value={quotedPrice}
                        onChange={(e) => setQuotedPrice(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </label>

                    <label className={labelClass}>
                      Currency
                      <select
                        className={inputClass}
                        value={quotedCurrency}
                        onChange={(e) => setQuotedCurrency(e.target.value)}
                      >
                        {currencies.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className={labelClass}>
                    Internal admin notes
                    <textarea
                      className={inputClass}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      maxLength={4000}
                      placeholder="Supplier response, follow-up notes, or internal observations..."
                    />
                  </label>

                  <p className="text-xs leading-5 text-slate-500">
                    Internal notes are intended for the admin team. Saving
                    updates the request in Supabase.
                  </p>

                  <button
                    type="button"
                    onClick={() => void saveChanges()}
                    disabled={saving}
                    className="w-full rounded-xl bg-sky-700 px-5 py-3 font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving changes..." : "Save changes"}
                  </button>

                  {selectedRequest.reviewed_at && (
                    <p className="text-xs text-slate-500">
                      Last reviewed: {formatDateTime(selectedRequest.reviewed_at)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
