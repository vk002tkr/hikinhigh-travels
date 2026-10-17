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
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
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
  const visibleAmenities = amenitiesExpanded ? amenities : amenities.slice(0, 8);
  const hasMoreAmenities = amenities.length > 8;
  const hotelDescription = hotel.description || "A comfortable stay, selected for your next journey with Hikinhigh Travels.";

  return <main style={styles.page}>
    <style>{`
      @media (max-width: 760px) {
        .hotel-detail-hero-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 18px !important; }
        .hotel-detail-hero-image { height: 260px !important; min-height: 260px !important; }
        .hotel-detail-hero-image img { height: 260px !important; }
        .hotel-detail-booking { grid-template-columns: minmax(0, 1fr) !important; padding: 16px !important; gap: 16px !important; }
        .hotel-detail-gallery img { height: 82px !important; }
      }
      @media (max-width: 420px) {
        .hotel-detail-form-row { grid-template-columns: minmax(0, 1fr) !important; }
      }
    `}</style>
    <div style={styles.container}>
      <Link href="/hotels" style={styles.back}>← All properties</Link>
      <div className="hotel-detail-hero-grid" style={styles.heroGrid}>
        <div>
          <div className="hotel-detail-hero-image" style={styles.imageFrame}>{photos[0] ? <img src={photos[0]} alt={hotel.name} style={styles.heroImage} /> : <div style={styles.imagePlaceholder}>HIKINHIGH STAYS</div>}</div>
          {photos.length > 1 && <div className="hotel-detail-gallery" style={styles.gallery}>{photos.slice(1, 5).map((src, i) => <img key={`${src.slice(0, 30)}-${i}`} src={src} alt={`${hotel.name} view ${i + 2}`} style={styles.galleryImage} />)}</div>}
          <section style={{ ...styles.section, padding: "24px 0", marginTop: 6 }}><p style={styles.eyebrow}>ROOM OPTIONS</p><h2 style={styles.sectionTitle}>Choose your room</h2>
        {rooms.length ? <div style={styles.roomGrid}>{rooms.map((room) => {
          const isSelected = (form.room_id ? form.room_id === room.id : selectedRoom?.id === room.id);
          return <button type="button" key={room.id} onClick={() => update("room_id", room.id)} aria-pressed={isSelected} style={{ ...styles.roomCard, borderColor: isSelected ? "#0b6bcb" : "#e4e7ec", boxShadow: isSelected ? "0 0 0 2px #d7eaff" : "none" }}>
            <span style={styles.roomName}>{room.name}</span>
            <strong style={styles.roomPrice}>{money(Number(room.base_price_usd) || 0)} <small style={styles.perNight}>/ night</small></strong>
            <span style={styles.roomCapacity}>Up to {room.max_guests} guests</span>
            {room.description && <span style={styles.roomDescription}>{room.description}</span>}
            {Array.isArray(room.amenities) && room.amenities.length > 0 && <span style={styles.roomAmenities}>{room.amenities.slice(0, 3).join(" · ")}</span>}
            <span style={isSelected ? styles.selectedRoomLabel : styles.selectRoomLabel}>{isSelected ? "✓ Selected" : "Select this room →"}</span>
          </button>;
        })}</div> : <p style={styles.muted}>No active room types have been added yet. You can still send a general booking enquiry.</p>}
          </section>
        </div>
        <div style={styles.summary}>
          <p style={styles.eyebrow}>{destination?.name || destination?.region || "THE HIKINHIGH COLLECTION"}</p>
          <h1 style={styles.title}>{hotel.name}</h1>
          <p style={styles.location}>⌖ {location}</p>
          {hotel.star_rating && <p style={styles.rating}>{"★".repeat(Math.min(5, Math.max(1, Math.round(hotel.star_rating))))} <span style={{ color: "#667085", fontWeight: 400 }}> {hotel.star_rating}-star property</span></p>}
          <p style={{ ...styles.description, ...(descriptionExpanded ? {} : styles.descriptionCollapsed) }}>{hotelDescription}</p>
          {hotelDescription.length > 180 && <button type="button" onClick={() => setDescriptionExpanded((value) => !value)} style={styles.textToggle}>{descriptionExpanded ? "Read less ↑" : "Read more ↓"}</button>}
          <div style={styles.infoGrid}><div style={styles.infoBox}><span style={styles.infoLabel}>CHECK-IN</span><strong>{hotel.check_in_time?.slice(0, 5) || "Confirm on booking"}</strong></div><div style={styles.infoBox}><span style={styles.infoLabel}>CHECK-OUT</span><strong>{hotel.check_out_time?.slice(0, 5) || "Confirm on booking"}</strong></div></div>
          <a href="#booking" style={styles.button}>Request a booking ↓</a>
        </div>
      </div>

      <section style={styles.section}><p style={styles.eyebrow}>THE PROPERTY</p><h2 style={styles.sectionTitle}>Everything you need for your stay</h2>
        {amenities.length ? <>
          <div style={styles.chips}>{visibleAmenities.map((item) => <span key={item} style={styles.chip}>{item}</span>)}</div>
          {hasMoreAmenities && <button type="button" onClick={() => setAmenitiesExpanded((value) => !value)} style={styles.textToggle}>{amenitiesExpanded ? "Show fewer amenities ↑" : `Show all ${amenities.length} amenities ↓`}</button>}
        </> : <p style={styles.muted}>Property amenities can be confirmed by our team.</p>}
        {hotel.cancellation_policy && <div style={styles.policy}><h3>Cancellation policy</h3><p>{hotel.cancellation_policy}</p></div>}
      </section>


      <section id="booking" className="hotel-detail-booking" style={styles.bookingSection}><div><p style={styles.eyebrow}>PLAN YOUR STAY</p><h2 style={styles.sectionTitle}>Request a booking</h2><p style={styles.muted}>Send your preferred dates and guest details. Our team will confirm availability and the final price before your booking is confirmed.</p>{selectedRoom && nights > 0 && <div style={styles.estimate}><span>Estimated room total*</span><strong>{money((Number(selectedRoom.base_price_usd) || 0) * nights * Number(form.rooms || 1))}</strong><small>*Indicative only; taxes, availability and final pricing will be confirmed by our team.</small></div>}</div>
        <form onSubmit={submitBooking} style={styles.form}>
          <label style={styles.label}>Full name<input required autoComplete="name" value={form.guest_name} onChange={(e) => update("guest_name", e.target.value)} style={styles.input} maxLength={120} /></label>
          <label style={styles.label}>Email address<input required type="email" autoComplete="email" value={form.guest_email} onChange={(e) => update("guest_email", e.target.value)} style={styles.input} maxLength={254} /></label>
          <label style={styles.label}>Phone number<input type="tel" autoComplete="tel" value={form.guest_phone} onChange={(e) => update("guest_phone", e.target.value)} style={styles.input} maxLength={40} /></label>
          <div className="hotel-detail-form-row" style={styles.formRow}><label style={styles.label}>Check-in<input required type="date" min={today()} value={form.check_in} onChange={(e) => update("check_in", e.target.value)} style={styles.input} /></label><label style={styles.label}>Check-out<input required type="date" min={form.check_in || today()} value={form.check_out} onChange={(e) => update("check_out", e.target.value)} style={styles.input} /></label></div>
          <div className="hotel-detail-form-row" style={styles.formRow}><label style={styles.label}>Guests<input required type="number" min="1" max="30" value={form.guests} onChange={(e) => update("guests", e.target.value)} style={styles.input} /></label><label style={styles.label}>Rooms<input required type="number" min="1" max="10" value={form.rooms} onChange={(e) => update("rooms", e.target.value)} style={styles.input} /></label></div>
          {rooms.length > 0 && <label style={styles.label}>Room type<select value={selectedRoom?.id ?? ""} onChange={(e) => update("room_id", e.target.value)} style={styles.input}>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name} — {money(Number(room.base_price_usd) || 0)}/night</option>)}</select></label>}
          <label style={styles.label}>Special requests (optional)<textarea value={form.message} onChange={(e) => update("message", e.target.value)} style={{ ...styles.input, minHeight: 95, resize: "vertical" }} maxLength={2000} /></label>
          {error && <p role="alert" style={styles.error}>{error}</p>}{success && <p role="status" style={styles.success}>{success}</p>}
          <button type="submit" disabled={submitting} style={{ ...styles.button, width: "100%", opacity: submitting ? 0.7 : 1 }}>{submitting ? "Sending request…" : "Submit booking request →"}</button>
          <p style={styles.finePrint}>This submits a request only. Your stay is not confirmed and no payment is collected at this stage.</p>
        </form>
      </section>
    </div>
  </main>;
}

const styles: Record<string, CSSProperties> = {
  page: { background: "#fff", color: "#172033", minHeight: "70vh", padding: "28px 20px 56px" }, container: { maxWidth: 1180, margin: "0 auto" }, back: { display: "inline-block", color: "#1265a8", textDecoration: "none", fontWeight: 650, marginBottom: 24 }, heroGrid: { display: "grid", gridTemplateColumns: "minmax(0,1.25fr) minmax(320px,.9fr)", gap: 34, alignItems: "start" }, imageFrame: { overflow: "hidden", borderRadius: 20, background: "#eef3f7", minHeight: 330 }, heroImage: { display: "block", width: "100%", height: 430, objectFit: "cover" }, imagePlaceholder: { minHeight: 330, display: "grid", placeItems: "center", color: "#64748b", letterSpacing: 3 }, gallery: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, marginTop: 10 }, galleryImage: { width: "100%", height: 110, objectFit: "cover", borderRadius: 10 }, summary: { padding: "14px 0" }, eyebrow: { fontSize: 11, letterSpacing: 2.2, fontWeight: 800, color: "#1671b8", margin: "0 0 12px" }, title: { fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.08, letterSpacing: -1.5, margin: "0 0 12px" }, location: { color: "#667085", margin: "0 0 16px" }, rating: { color: "#d28b18", margin: "0 0 18px", fontWeight: 800 }, description: { lineHeight: 1.65, color: "#475467", whiteSpace: "pre-wrap", margin: "12px 0 0", fontSize: 14 }, descriptionCollapsed: { maxHeight: 116, overflow: "hidden", position: "relative" }, infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }, infoBox: { border: "1px solid #e4e7ec", borderRadius: 12, padding: 15, display: "grid", gap: 8 }, infoLabel: { color: "#667085", fontSize: 10, letterSpacing: 1.4 }, button: { display: "inline-block", border: 0, borderRadius: 10, background: "#1265a8", color: "white", textDecoration: "none", padding: "14px 19px", fontWeight: 750, cursor: "pointer", textAlign: "center" }, section: { padding: "30px 0", borderTop: "1px solid #eaecf0" }, sectionTitle: { fontSize: "clamp(24px,3vw,32px)", letterSpacing: -0.7, margin: "0 0 15px" }, chips: { display: "flex", flexWrap: "wrap", gap: 10 }, chip: { padding: "7px 11px", border: "1px solid #e4e7ec", borderRadius: 999, background: "#f9fafb", color: "#344054", fontSize: 13 }, policy: { marginTop: 18, padding: 15, background: "#f8fafc", borderRadius: 12, fontSize: 13, lineHeight: 1.6 }, roomGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }, roomCard: { textAlign: "left", display: "grid", alignContent: "start", gap: 8, padding: 16, border: "1px solid #e4e7ec", borderRadius: 12, background: "white", cursor: "pointer", minWidth: 0 }, roomName: { fontSize: 16, fontWeight: 750, color: "#172033" }, roomPrice: { fontSize: 22, color: "#1265a8" }, perNight: { fontSize: 12, fontWeight: 500, color: "#667085" }, roomDescription: { color: "#475467", lineHeight: 1.45, fontSize: 13 }, roomCapacity: { color: "#667085", fontSize: 13 }, roomAmenities: { color: "#667085", fontSize: 12, lineHeight: 1.5 }, selectedRoomLabel: { color: "#067647", fontWeight: 750, fontSize: 12, marginTop: 3 }, selectRoomLabel: { color: "#1265a8", fontWeight: 750, fontSize: 12, marginTop: 3 }, textToggle: { border: 0, background: "transparent", color: "#1265a8", padding: "8px 0 0", fontWeight: 750, fontSize: 13, cursor: "pointer", textAlign: "left" }, muted: { color: "#667085", lineHeight: 1.7 }, bookingSection: { display: "grid", gridTemplateColumns: "minmax(0,.72fr) minmax(320px,1fr)", gap: 24, alignItems: "start", padding: 22, borderRadius: 16, background: "#f7f9fc", marginTop: 18 }, estimate: { marginTop: 25, padding: 18, borderRadius: 12, background: "white", border: "1px solid #e4e7ec", display: "grid", gap: 8 }, form: { background: "white", padding: 18, borderRadius: 14, border: "1px solid #e4e7ec", display: "grid", gap: 11 }, label: { display: "grid", gap: 7, fontSize: 13, color: "#344054", fontWeight: 650 }, input: { boxSizing: "border-box", width: "100%", border: "1px solid #d0d5dd", borderRadius: 9, padding: "10px 12px", color: "#172033", background: "#fff", font: "inherit", fontWeight: 400 }, formRow: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }, error: { margin: 0, color: "#b42318", background: "#fef3f2", borderRadius: 8, padding: 12, lineHeight: 1.5 }, success: { margin: 0, color: "#067647", background: "#ecfdf3", borderRadius: 8, padding: 12, lineHeight: 1.6 }, finePrint: { margin: 0, fontSize: 11, color: "#667085", lineHeight: 1.5 }, notice: { maxWidth: 800, margin: "40px auto", padding: 28, border: "1px solid #e4e7ec", borderRadius: 16, lineHeight: 1.7 },
};
