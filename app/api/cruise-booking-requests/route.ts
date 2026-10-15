
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ALLOWED_STATUSES = [
  "pending",
  "under_review",
  "quoted",
  "confirmed",
  "rejected",
  "cancelled",
] as const;

const ALLOWED_CABINS = [
  "No preference",
  "Interior",
  "Ocean View",
  "Balcony",
  "Suite",
] as const;

const ALLOWED_CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;

type JsonObject = Record<string, unknown>;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function getSupabase(token: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment configuration is missing.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

function getToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim() || null;
}

async function getAuthenticatedUser(request: NextRequest) {
  const token = getToken(request);

  if (!token) {
    return {
      error: "Please log in to continue.",
      status: 401,
    } as const;
  }

  const supabase = getSupabase(token);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      error: "Your session has expired. Please log in again.",
      status: 401,
    } as const;
  }

  return { supabase, user } as const;
}

async function verifyAdmin(request: NextRequest) {
  const auth = await getAuthenticatedUser(request);

  if ("error" in auth) {
    return auth;
  }

  const { data: profile, error } = await auth.supabase
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (error) {
    console.error("Cruise admin profile verification failed:", error.message);

    return {
      error: "Unable to verify administrator access.",
      status: 500,
    } as const;
  }

  if (
    !profile ||
    profile.role !== "admin" ||
    profile.is_active !== true
  ) {
    return {
      error: "Administrator access required.",
      status: 403,
    } as const;
  }

  return {
    ...auth,
    profile,
  } as const;
}

function isObject(value: unknown): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * POST
 * Creates a cruise request for the authenticated customer.
 * The user ID is always derived from the verified Supabase session.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);

    if ("error" in auth) {
      return json({ error: auth.error }, auth.status);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON request body." }, 400);
    }

    if (!isObject(body)) {
      return json({ error: "Invalid request data." }, 400);
    }

    const cruiseName = getString(body.cruise_name);
    const destination = getString(body.destination);
    const departurePort = getString(body.departure_port);
    const departureDate = getString(body.departure_date);
    const returnDate = getString(body.return_date);

    const customerName = getString(body.customer_name);
    const customerEmail = getString(body.customer_email).toLowerCase();
    const customerPhone = getString(body.customer_phone);
    const specialRequests = getString(body.special_requests);

    const cabinPreference =
      getString(body.cabin_preference) || "No preference";

    const adults = body.adults;
    const children = body.children === undefined ? 0 : body.children;

    if (
      !cruiseName ||
      !destination ||
      !departureDate ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return json(
        { error: "Please complete all required fields." },
        400
      );
    }

    if (
      cruiseName.length > 150 ||
      destination.length > 150 ||
      departurePort.length > 150 ||
      customerName.length > 150 ||
      customerEmail.length > 254 ||
      customerPhone.length > 30 ||
      specialRequests.length > 2000
    ) {
      return json(
        { error: "One or more fields exceed the allowed length." },
        400
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return json({ error: "Enter a valid email address." }, 400);
    }

    if (!/^[0-9+().\-\s]{7,30}$/.test(customerPhone)) {
      return json({ error: "Enter a valid phone number." }, 400);
    }

    if (
      typeof adults !== "number" ||
      !Number.isInteger(adults) ||
      adults < 1 ||
      adults > 20 ||
      typeof children !== "number" ||
      !Number.isInteger(children) ||
      children < 0 ||
      children > 20 ||
      adults + children > 20
    ) {
      return json(
        { error: "Passenger count must be between 1 and 20." },
        400
      );
    }

    if (
      !ALLOWED_CABINS.includes(
        cabinPreference as (typeof ALLOWED_CABINS)[number]
      )
    ) {
      return json({ error: "Invalid cabin preference." }, 400);
    }

    if (!isValidDate(departureDate)) {
      return json({ error: "Enter a valid departure date." }, 400);
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const departure = new Date(`${departureDate}T00:00:00.000Z`);

    if (departure < today) {
      return json(
        { error: "Departure date cannot be in the past." },
        400
      );
    }

    if (returnDate) {
      if (!isValidDate(returnDate)) {
        return json({ error: "Enter a valid return date." }, 400);
      }

      if (returnDate < departureDate) {
        return json(
          { error: "Return date must be on or after departure." },
          400
        );
      }
    }

    const { data, error } = await auth.supabase
      .from("cruise_booking_requests")
      .insert({
        user_id: auth.user.id,
        cruise_name: cruiseName,
        destination,
        departure_port: departurePort || null,
        departure_date: departureDate,
        return_date: returnDate || null,
        adults,
        children,
        cabin_preference: cabinPreference,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        special_requests: specialRequests || null,
      })
      .select("id, booking_reference, status, created_at")
      .single();

    if (error) {
      console.error("Cruise request insert failed:", error.message);

      return json(
        { error: "Unable to submit your cruise request. Please try again." },
        500
      );
    }

    return json(
      {
        message: "Your cruise booking request has been submitted.",
        request: data,
      },
      201
    );
  } catch (error) {
    console.error("Cruise request POST error:", error);

    return json(
      { error: "An unexpected server error occurred." },
      500
    );
  }
}

/**
 * GET
 * Returns all cruise requests to an active administrator only.
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if ("error" in admin) {
      return json({ error: admin.error }, admin.status);
    }

    const { data, error } = await admin.supabase
      .from("cruise_booking_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Cruise requests fetch failed:", error.message);

      return json(
        { error: "Unable to load cruise requests." },
        500
      );
    }

    return json({ requests: data ?? [] });
  } catch (error) {
    console.error("Cruise requests GET error:", error);

    return json(
      { error: "An unexpected server error occurred." },
      500
    );
  }
}

/**
 * PATCH
 * Allows an active administrator to update the request status,
 * quoted price, currency, and internal notes.
 */
export async function PATCH(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if ("error" in admin) {
      return json({ error: admin.error }, admin.status);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON request body." }, 400);
    }

    if (!isObject(body)) {
      return json({ error: "Invalid update data." }, 400);
    }

    const id = getString(body.id);
    const status = getString(body.status);

    if (!id) {
      return json({ error: "Request ID is required." }, 400);
    }

    if (
      !ALLOWED_STATUSES.includes(
        status as (typeof ALLOWED_STATUSES)[number]
      )
    ) {
      return json({ error: "Invalid request status." }, 400);
    }

    const adminNotes = getString(body.admin_notes);

    if (adminNotes.length > 4000) {
      return json({ error: "Admin notes cannot exceed 4000 characters." }, 400);
    }

    const quotedCurrency =
      body.quoted_currency === undefined
        ? "INR"
        : getString(body.quoted_currency);

    if (
      !ALLOWED_CURRENCIES.includes(
        quotedCurrency as (typeof ALLOWED_CURRENCIES)[number]
      )
    ) {
      return json({ error: "Invalid quoted currency." }, 400);
    }

    let quotedPrice: number | null = null;

    if (body.quoted_price !== undefined && body.quoted_price !== null &&
        body.quoted_price !== "") {
      if (
        typeof body.quoted_price !== "number" &&
        typeof body.quoted_price !== "string"
      ) {
        return json({ error: "Enter a valid quoted price." }, 400);
      }

      const rawPrice =
        typeof body.quoted_price === "string"
          ? body.quoted_price.trim()
          : body.quoted_price;

      if (rawPrice === "") {
        quotedPrice = null;
      } else {
        quotedPrice = Number(rawPrice);

        if (
          !Number.isFinite(quotedPrice) ||
          quotedPrice < 0 ||
          quotedPrice > 9999999999
        ) {
          return json({ error: "Enter a valid quoted price." }, 400);
        }
      }
    }

    if (status === "quoted" && quotedPrice === null) {
      return json(
        { error: "A quoted price is required before setting status to Quoted." },
        400
      );
    }

    const update = {
      status,
      quoted_price: quotedPrice,
      quoted_currency: quotedCurrency,
      admin_notes: adminNotes || null,
      reviewed_by: admin.user.id,
      reviewed_at: new Date().toISOString(),
    };

    const { data, error } = await admin.supabase
      .from("cruise_booking_requests")
      .update(update)
      .eq("id", id)
      .select(
        "id, booking_reference, status, quoted_price, quoted_currency, admin_notes, reviewed_by, reviewed_at, updated_at"
      )
      .maybeSingle();

    if (error) {
      console.error("Cruise request update failed:", error.message);

      return json(
        { error: "Unable to update this cruise request." },
        500
      );
    }

    if (!data) {
      return json(
        { error: "Cruise request not found or update not permitted." },
        404
      );
    }

    return json({
      message: "Cruise request updated successfully.",
      request: data,
    });
  } catch (error) {
    console.error("Cruise requests PATCH error:", error);

    return json(
      { error: "An unexpected server error occurred." },
      500
    );
  }
}
