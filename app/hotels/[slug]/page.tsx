"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import type { CSSProperties } from "react";
import { supabase } from "@/lib/supabase";

type Hotel = {
  id: string; name: string; slug: string; description: string | null; address: string | null;
  city: string | null; country: string | null; star_rating: number | null; hero_image: string | null;
  gallery: string[] | null; amenities: string[] | null; check_in_time: string | null;
  check_out_time: string | null; cancellation_policy: string | null; destination_id: string | null;
};
type Room = { id: string; name: string; description: string | null; max_guests: number; base_price_usd: number | string; gallery: string[] | null; amenities: string[] | null };
type Destination = { id: string; name: string; country: string | null; region: string | null };
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const today = () => new Date().toISOString().slice(0, 10);

export default function HotelDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ room_id: "", guest_name: "", guest_email: "", guest_phone: "", check_in: "", check_out: "", guests: "2", rooms: "1", message: "" });

  const load = useCallback(async () => {
    if (!slug) return;
    setLoading(true); setError("");
    const hotelResult = await supabase.from("hotels").select("id,name,slug,description,address,city,country,star_rating,hero_image,gallery,amenities,check_in_time,check_out_time,cancellation_policy,destination_id").eq("slug", slug).eq("is_active", true).maybeSingle();
    if (hotelResult.error || !hotelResult.data) { setError(hotelResult.error?.message || "This property could not be found or is no longer available."); setHotel(null); setLoading(false); return; }
    const h = hotelResult.data as Hotel; setHotel(h);
    const [roomResult, destinationResult] = await Promise.all([
      supabase.from("hotel_rooms").select("id,name,description,max_guests,base_price_usd,gallery,amenities").eq("hotel_id", h.id).eq("is_active", true).order("base_price_usd", { ascending: true }),
      h.destination_id ? supabase.from("destinations").select("id,name,country,region").eq("id", h.destination_id).maybeSingle() : Promise.resolve({ data: null, error: null } as any),
    ]);
    if (roomResult.error) setError(`Room details could not be loaded: ${roomResult.error.message}`);
    setRooms((roomResult.data ?? []) as Room[]);
    setDestination((destinationResult.data ?? null) as Destination | null);
    setLoading(false);
  }, [slug]);
  useEffect(() => { void load(); }, [load]);

  const selectedRoom = useMemo(() => rooms.find((room) => room.id === form.room_id) ?? rooms[0] ?? null, [rooms, form.room_id]);
  const nights = form.check_in && form.check_out ? Math.max(0, Math.round((new Date(`${form.check_out}T00:00:00`).getTime() - new Date(`${form.check_in}T00:00:00`).getTime()) / 86400000)) : 0;
  const update = (key: keyof typeof form, value: string) => setForm((old) => ({ ...old, [key]: value }));

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSuccess(""); setError("");
    if (!hotel) return;
    if (form.check_in < today()) { setError("Check-in date cannot be in the past."); return; }
    if (!nights) { setError("Please choose a check-out date after check-in."); return; }
    setSubmitting(true);
    const result = await supabase.from("hotel_booking_requests").insert({
      hotel_id: hotel.id, room_id: selectedRoom?.id ?? null, guest_name: form.guest_name.trim(),
      guest_email: form.guest_email.trim(), guest_phone: form.guest_phone.trim() || null,
      check_in: form.check_in, check_out: form.check_out, guests: Number(form.guests), rooms: Number(form.rooms),
      message: form.message.trim() || null, status: "pending", admin_notes: null,
    });
    setSubmitting(false);
    if (result.error) { setError(`Booking request could not be submitted: ${result.error.message}. Please make sure the hotel booking SQL setup has been run in Supabase.`); return; }
    setSuccess("Your booking request has been received. Our team will contact you to confirm availability and the final price. No payment has been taken.");
    setForm((old) => ({ ...old, guest_name: "", guest_email: "", guest_phone: "", message: "" }));
  }

  if (loading) return <main style={styles.page}><p style={styles.notice}>Loading property details…</p></main>;
  if (!hotel) return <main style={styles.page}><section style={styles.notice}><p style={styles.eyebrow}>HIKINHIGH STAYS</p><h1>Property unavailable</h1><p>{error || "We couldn't find this property."}</p><Link href="/hotels" style={styles.button}>Back to hotels</Link></section></main>;
  const photos = [hotel.hero_image, ...(hotel.gallery ?? [])].filter((x): x is string => Boolean(x));
  const location = [hotel.address, hotel.city, hotel.country || destination?.country].filter(Boolean).join(", ") || destination?.name || "Location details available on request";
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

  return <main style={styles.page}>
    <div style={styles.container}>
      <Link href="/hotels" style={styles.back}>← All properties</Link>
      <div style={styles.heroGrid}>
        <div>
          <div style={styles.imageFrame}>{photos[0] ? <img src={photos[0]} alt={hotel.name} style={styles.heroImage} /> : <div style={styles.imagePlaceholder}>HIKINHIGH STAYS</div>}</div>
          {photos.length > 1 && <div style={styles.gallery}>{photos.slice(1, 5).map((src, i) => <img key={`${src.slice(0, 30)}-${i}`} src={src} alt={`${hotel.name} view ${i + 2}`} style={styles.galleryImage} />)}</div>}
        </div>
        <div style={styles.summary}>
          <p style={styles.eyebrow}>{destination?.name || destination?.region || "THE HIKINHIGH COLLECTION"}</p>
          <h1 style={styles.title}>{hotel.name}</h1>
          <p style={styles.location}>⌖ {location}</p>
          {hotel.star_rating && <p style={styles.rating}>{"★".repeat(Math.min(5, Math.max(1, Math.round(hotel.star_rating))))} <span style={{ color: "#667085", fontWeight: 400 }}> {hotel.star_rating}-star property</span></p>}
          <p style={styles.description}>{hotel.description || "A comfortable stay, selected for your next journey with Hikinhigh Travels."}</p>
          <div style={styles.infoGrid}><div style={styles.infoBox}><span style={styles.infoLabel}>CHECK-IN</span><strong>{hotel.check_in_time?.slice(0, 5) || "Confirm on booking"}</strong></div><div style={styles.infoBox}><span style={styles.infoLabel}>CHECK-OUT</span><strong>{hotel.check_out_time?.slice(0, 5) || "Confirm on booking"}</strong></div></div>
          <a href="#booking" style={styles.button}>Request a booking ↓</a>
        </div>
      </div>

      <section style={styles.section}><p style={styles.eyebrow}>THE PROPERTY</p><h2 style={styles.sectionTitle}>Everything you need for your stay</h2>
        {amenities.length ? <div style={styles.chips}>{amenities.map((item) => <span key={item} style={styles.chip}>{item}</span>)}</div> : <p style={styles.muted}>Property amenities can be confirmed by our team.</p>}
        {hotel.cancellation_policy && <div style={styles.policy}><h3>Cancellation policy</h3><p>{hotel.cancellation_policy}</p></div>}
      </section>

      <section style={styles.section}><p style={styles.eyebrow}>ROOM OPTIONS</p><h2 style={styles.sectionTitle}>Choose your room</h2>
        {rooms.length ? <div style={styles.roomGrid}>{rooms.map((room) => <button type="button" key={room.id} onClick={() => update("room_id", room.id)} style={{ ...styles.roomCard, borderColor: (form.room_id ? form.room_id === room.id : selectedRoom?.id === room.id) ? "#0b6bcb" : "#e4e7ec", boxShadow: (form.room_id ? form.room_id === room.id : selectedRoom?.id === room.id) ? "0 0 0 2px #d7eaff" : "none" }}><span style={styles.roomName}>{room.name}</span><strong style={styles.roomPrice}>{money(Number(room.base_price_usd) || 0)} <small style={styles.perNight}>/ night</small></strong><span style={styles.muted}>Up to {room.max_guests} guests</span>{room.description && <span style={styles.roomDescription}>{room.description}</span>}{Array.isArray(room.amenities) && room.amenities.length > 0 && <span style={styles.muted}>{room.amenities.slice(0, 3).join(" · ")}</span>}</button>)}</div> : <p style={styles.muted}>No active room types have been added yet. You can still send a general booking enquiry.</p>}
      </section>

      <section id="booking" style={styles.bookingSection}>
        <div style={styles.bookingIntro}>
          <p style={styles.eyebrow}>PLAN YOUR STAY</p>
          <h2 style={styles.bookingTitle}>Make this your next stay.</h2>
          <p style={styles.muted}>Choose your dates and room. Send us your details and our team will confirm availability and the final price.</p>
          <div style={styles.bookingPerks}>
            <span>✓ Personal booking assistance</span>
            <span>✓ No payment required now</span>
            <span>✓ Final price confirmed by our team</span>
          </div>
          {selectedRoom && <div style={styles.estimate}>
            <span style={styles.estimateLabel}>YOUR ESTIMATED STAY</span>
            <strong style={styles.estimatePrice}>{nights > 0 ? money((Number(selectedRoom.base_price_usd) || 0) * nights * Number(form.rooms || 1)) : `${money(Number(selectedRoom.base_price_usd) || 0)} / night`}</strong>
            <small>{nights > 0 ? `${nights} night${nights === 1 ? "" : "s"} · ${form.rooms} room${Number(form.rooms) === 1 ? "" : "s"}` : "Choose your dates to calculate the stay total."}</small>
            <small>*Indicative only. Taxes, availability and final pricing will be confirmed by our team.</small>
          </div>}
        </div>
        <form onSubmit={submitBooking} style={styles.form}>
          <div style={styles.formHeading}>
            <span style={styles.formStep}>YOUR DETAILS</span>
            <h3 style={styles.formTitle}>Request a booking</h3>
            <p style={styles.formSubheading}>We’ll get back to you to confirm your stay.</p>
          </div>
          <div style={styles.formSectionTitle}>Guest information</div>
          <label style={styles.label}>Full name<input required autoComplete="name" value={form.guest_name} onChange={(e) => update("guest_name", e.target.value)} style={styles.input} maxLength={120} /></label>
          <label style={styles.label}>Email address<input required type="email" autoComplete="email" value={form.guest_email} onChange={(e) => update("guest_email", e.target.value)} style={styles.input} maxLength={254} /></label>
          <label style={styles.label}>Phone number<input type="tel" autoComplete="tel" value={form.guest_phone} onChange={(e) => update("guest_phone", e.target.value)} style={styles.input} maxLength={40} /></label>
          <div style={styles.formSectionTitle}>Your stay</div>
          <div style={styles.formRow}><label style={styles.label}>Check-in<input required type="date" min={today()} value={form.check_in} onChange={(e) => update("check_in", e.target.value)} style={styles.input} /></label><label style={styles.label}>Check-out<input required type="date" min={form.check_in || today()} value={form.check_out} onChange={(e) => update("check_out", e.target.value)} style={styles.input} /></label></div>
          <div style={styles.formRow}><label style={styles.label}>Guests<input required type="number" min="1" max="30" value={form.guests} onChange={(e) => update("guests", e.target.value)} style={styles.input} /></label><label style={styles.label}>Rooms<input required type="number" min="1" max="10" value={form.rooms} onChange={(e) => update("rooms", e.target.value)} style={styles.input} /></label></div>
          {rooms.length > 0 && <label style={styles.label}>Room type<select value={selectedRoom?.id ?? ""} onChange={(e) => update("room_id", e.target.value)} style={styles.input}>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name} — {money(Number(room.base_price_usd) || 0)}/night</option>)}</select></label>}
          <label style={styles.label}>Special requests (optional)<textarea value={form.message} onChange={(e) => update("message", e.target.value)} style={{ ...styles.input, minHeight: 95, resize: "vertical" }} maxLength={2000} /></label>
          {error && <p role="alert" style={styles.error}>{error}</p>}{success && <p role="status" style={styles.success}>{success}</p>}
          <button type="submit" disabled={submitting} style={{ ...styles.button, width: "100%", opacity: submitting ? 0.7 : 1 }}>{submitting ? "Sending request…" : "Submit booking request →"}</button>
          <p style={styles.finePrint}>This submits a request only. Your stay is not confirmed and no payment is collected at this stage.</p>
        </form>
      </section>
    </div>
    <style jsx>{`
      @media (max-width: 760px) {
        #booking {
          grid-template-columns: minmax(0, 1fr) !important;
          gap: 20px !important;
          padding: 18px !important;
          border-radius: 18px !important;
        }
        #booking form {
          min-width: 0;
        }
      }
      @media (max-width: 480px) {
        #booking form {
          padding: 16px !important;
        }
        #booking .formRow {
          grid-template-columns: minmax(0, 1fr) !important;
        }
      }
    `}</style>
  </main>;
}

const styles: Record<string, CSSProperties> = {
  page: { background: "#fff", color: "#172033", minHeight: "70vh", padding: "36px 20px 80px" }, container: { maxWidth: 1180, margin: "0 auto" }, back: { display: "inline-block", color: "#1265a8", textDecoration: "none", fontWeight: 650, marginBottom: 24 }, heroGrid: { display: "grid", gridTemplateColumns: "minmax(0,1.25fr) minmax(320px,.9fr)", gap: 34, alignItems: "start" }, imageFrame: { overflow: "hidden", borderRadius: 20, background: "#eef3f7", minHeight: 330 }, heroImage: { display: "block", width: "100%", height: 430, objectFit: "cover" }, imagePlaceholder: { minHeight: 330, display: "grid", placeItems: "center", color: "#64748b", letterSpacing: 3 }, gallery: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, marginTop: 10 }, galleryImage: { width: "100%", height: 110, objectFit: "cover", borderRadius: 10 }, summary: { padding: "14px 0" }, eyebrow: { fontSize: 11, letterSpacing: 2.2, fontWeight: 800, color: "#1671b8", margin: "0 0 12px" }, title: { fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.08, letterSpacing: -1.5, margin: "0 0 12px" }, location: { color: "#667085", margin: "0 0 16px" }, rating: { color: "#d28b18", margin: "0 0 18px", fontWeight: 800 }, description: { lineHeight: 1.8, color: "#475467", whiteSpace: "pre-wrap" }, infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "24px 0" }, infoBox: { border: "1px solid #e4e7ec", borderRadius: 12, padding: 15, display: "grid", gap: 8 }, infoLabel: { color: "#667085", fontSize: 10, letterSpacing: 1.4 }, button: { display: "inline-block", border: 0, borderRadius: 10, background: "#1265a8", color: "white", textDecoration: "none", padding: "14px 19px", fontWeight: 750, cursor: "pointer", textAlign: "center" }, section: { padding: "48px 0", borderTop: "1px solid #eaecf0" }, sectionTitle: { fontSize: "clamp(25px,3vw,34px)", letterSpacing: -0.7, margin: "0 0 20px" }, chips: { display: "flex", flexWrap: "wrap", gap: 10 }, chip: { padding: "9px 13px", border: "1px solid #e4e7ec", borderRadius: 999, background: "#f9fafb", color: "#344054" }, policy: { marginTop: 28, padding: 20, background: "#f8fafc", borderRadius: 12 }, roomGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 15 }, roomCard: { textAlign: "left", display: "grid", gap: 11, padding: 20, border: "1px solid #e4e7ec", borderRadius: 14, background: "white", cursor: "pointer" }, roomName: { fontSize: 18, fontWeight: 750, color: "#172033" }, roomPrice: { fontSize: 24, color: "#1265a8" }, perNight: { fontSize: 12, fontWeight: 500, color: "#667085" }, roomDescription: { color: "#475467", lineHeight: 1.5 }, muted: { color: "#667085", lineHeight: 1.7 }, bookingSection: { display: "grid", gridTemplateColumns: "minmax(0,.78fr) minmax(0,1.22fr)", gap: 34, alignItems: "start", padding: "clamp(18px,3.2vw,38px)", borderRadius: 24, background: "linear-gradient(135deg,#f3f7fb 0%,#f8fafc 58%,#eef5fb 100%)", border: "1px solid #e5edf5", marginTop: 30, boxShadow: "0 18px 50px rgba(16,48,79,.07)" }, bookingIntro: { padding: "8px 0", position: "sticky", top: 24 }, bookingTitle: { fontSize: "clamp(28px,3vw,40px)", lineHeight: 1.12, letterSpacing: -1.2, margin: "0 0 15px", color: "#12243a" }, bookingPerks: { display: "grid", gap: 11, marginTop: 24, color: "#344b63", fontSize: 13 }, estimate: { marginTop: 28, padding: 22, borderRadius: 16, background: "#fff", border: "1px solid #dce7f1", display: "grid", gap: 9, boxShadow: "0 8px 24px rgba(20,61,95,.05)" }, estimateLabel: { fontSize: 10, letterSpacing: 1.6, fontWeight: 800, color: "#1671b8" }, estimatePrice: { fontSize: 30, letterSpacing: -0.8, color: "#12243a" }, form: { background: "white", padding: "clamp(18px,2.5vw,30px)", borderRadius: 20, border: "1px solid #e0e8f0", display: "grid", gap: 16, boxShadow: "0 12px 34px rgba(16,48,79,.07)" }, formHeading: { paddingBottom: 17, borderBottom: "1px solid #edf1f5" }, formStep: { fontSize: 10, letterSpacing: 1.7, color: "#1671b8", fontWeight: 800 }, formTitle: { margin: "7px 0 5px", fontSize: 23, letterSpacing: -0.5, color: "#14263a" }, formSubheading: { margin: 0, fontSize: 13, color: "#667085", lineHeight: 1.5 }, formSectionTitle: { fontSize: 12, fontWeight: 800, color: "#344b63", letterSpacing: 0.3, marginTop: 2 }, label: { display: "grid", gap: 7, fontSize: 13, color: "#344054", fontWeight: 650 }, input: { boxSizing: "border-box", width: "100%", border: "1px solid #d0d5dd", borderRadius: 9, padding: "12px 13px", color: "#172033", background: "#fff", font: "inherit", fontWeight: 400 }, formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, error: { margin: 0, color: "#b42318", background: "#fef3f2", borderRadius: 8, padding: 12, lineHeight: 1.5 }, success: { margin: 0, color: "#067647", background: "#ecfdf3", borderRadius: 8, padding: 12, lineHeight: 1.6 }, finePrint: { margin: 0, fontSize: 12, color: "#667085", lineHeight: 1.5 }, notice: { maxWidth: 800, margin: "40px auto", padding: 28, border: "1px solid #e4e7ec", borderRadius: 16, lineHeight: 1.7 },
};
