"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Hotel = {
  id: string;
  slug: string;
  name: string;
  location: string;
  region: string;
  type: string;
  description: string;
  image: string;
  price: string;
  rating: string;
  reviews: string;
  tags: string[];
  featured: boolean;
};

type DestinationRow = {
  id: string;
  name: string;
  country: string | null;
  region: string | null;
};

type HotelRow = {
  id: string;
  destination_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  star_rating: number | null;
  hero_image: string | null;
  amenities: string[] | null;
  is_featured: boolean;
  is_active: boolean;
};

type RoomRow = {
  id: string;
  hotel_id: string;
  name: string;
  base_price_usd: number | string;
  is_active: boolean;
};

const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("All destinations");
  const [selectedType, setSelectedType] = useState("All property types");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadHotels = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const [hotelResult, destinationResult, roomResult] = await Promise.all([
      supabase
        .from("hotels")
        .select("id,destination_id,name,slug,description,address,city,country,star_rating,hero_image,amenities,is_featured,is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("destinations")
        .select("id,name,country,region")
        .eq("is_active", true),
      supabase
        .from("hotel_rooms")
        .select("id,hotel_id,name,base_price_usd,is_active")
        .eq("is_active", true)
        .order("base_price_usd", { ascending: true }),
    ]);

    if (hotelResult.error) {
      setLoadError(`Hotels could not be loaded: ${hotelResult.error.message}`);
      setHotels([]);
      setLoading(false);
      return;
    }
    if (destinationResult.error) {
      setLoadError(`Destinations could not be loaded: ${destinationResult.error.message}`);
      setHotels([]);
      setLoading(false);
      return;
    }
    if (roomResult.error) {
      setLoadError(`Hotel room prices could not be loaded: ${roomResult.error.message}`);
      setHotels([]);
      setLoading(false);
      return;
    }

    const destinations = (destinationResult.data ?? []) as DestinationRow[];
    const destinationById = new Map(destinations.map((destination) => [destination.id, destination]));
    const rooms = (roomResult.data ?? []) as RoomRow[];
    const roomsByHotel = new Map<string, RoomRow[]>();
    for (const room of rooms) {
      const list = roomsByHotel.get(room.hotel_id) ?? [];
      list.push(room);
      roomsByHotel.set(room.hotel_id, list);
    }

    const mapped = ((hotelResult.data ?? []) as HotelRow[]).map((hotel) => {
      const destination = hotel.destination_id ? destinationById.get(hotel.destination_id) : undefined;
      const hotelRooms = roomsByHotel.get(hotel.id) ?? [];
      const lowestPrice = hotelRooms.length ? Number(hotelRooms[0].base_price_usd) : null;
      const amenities = Array.isArray(hotel.amenities) ? hotel.amenities.filter(Boolean).slice(0, 4) : [];
      const locationParts = [hotel.city, hotel.country || destination?.country].filter(Boolean);
      return {
        id: hotel.id,
        slug: hotel.slug,
        name: hotel.name,
        location: locationParts.length ? locationParts.join(", ") : destination?.name || hotel.address || "Location not specified",
        region: destination?.name || destination?.region || hotel.city || "Other",
        type: hotel.star_rating ? `${Number(hotel.star_rating)}-Star Hotel` : "Hotel",
        description: hotel.description || "Discover a comfortable stay with Hikinhigh Travels.",
        image: hotel.hero_image || "/images/hotel-kashmir.jpg",
        price: lowestPrice !== null && Number.isFinite(lowestPrice) ? formatUSD(lowestPrice) : "Price on request",
        rating: hotel.star_rating ? Number(hotel.star_rating).toFixed(1) : "—",
        reviews: "Guest rating",
        tags: amenities.length ? amenities : ["Comfortable stay"],
        featured: Boolean(hotel.is_featured),
      } satisfies Hotel;
    });
    setHotels(mapped);
    setLoading(false);
  }, []);

  useEffect(() => { void loadHotels(); }, [loadHotels]);

  const regions = useMemo(
    () => ["All destinations", ...Array.from(new Set(hotels.map((hotel) => hotel.region))).sort()],
    [hotels],
  );
  const propertyTypes = useMemo(
    () => ["All property types", ...Array.from(new Set(hotels.map((hotel) => hotel.type))).sort()],
    [hotels],
  );
  const filteredHotels = useMemo(() => hotels.filter((hotel) => {
    const regionMatch = selectedRegion === "All destinations" || hotel.region === selectedRegion;
    const typeMatch = selectedType === "All property types" || hotel.type === selectedType;
    return regionMatch && typeMatch;
  }), [hotels, selectedRegion, selectedType]);
  const featuredHotel = hotels.find((hotel) => hotel.featured) ?? hotels[0] ?? null;

  return (
    <main className="hotels-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="hotels-header">
        <div className="hotels-header-inner">
          <Link href="/" className="hotels-brand">
            <span className="hotels-brand-mark">H</span>

            <span className="hotels-brand-copy">
              <strong>hikinhigh</strong>
              <small>travels</small>
            </span>
          </Link>

          <nav className="hotels-desktop-nav">
            <Link href="/destinations">
              Destinations
            </Link>

            <Link
              href="/hotels"
              className="hotels-nav-active"
            >
              Hotels
            </Link>

            <Link href="/packages">
              Packages
            </Link>

            <Link href="/adventures">
              Adventures
            </Link>

            <Link href="/about">
              About
            </Link>
          </nav>

          <div className="hotels-header-actions">
            <Link
              href="/login"
              className="hotels-login-link"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="hotels-header-button"
            >
              Join us
            </Link>
          </div>

          <button
            type="button"
            className="hotels-mobile-button"
            onClick={() =>
              setMobileMenu((value) => !value)
            }
            aria-label="Open navigation"
          >
            {mobileMenu ? "×" : "☰"}
          </button>
        </div>

        {mobileMenu && (
          <div className="hotels-mobile-menu">
            <Link
              href="/destinations"
              onClick={() => setMobileMenu(false)}
            >
              Destinations
            </Link>

            <Link
              href="/hotels"
              onClick={() => setMobileMenu(false)}
            >
              Hotels
            </Link>

            <Link
              href="/packages"
              onClick={() => setMobileMenu(false)}
            >
              Packages
            </Link>

            <Link
              href="/adventures"
              onClick={() => setMobileMenu(false)}
            >
              Adventures
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenu(false)}
            >
              About
            </Link>

            <div className="hotels-mobile-divider" />

            <Link href="/login">
              Login
            </Link>

            <Link
              href="/register"
              className="hotels-mobile-join"
            >
              Join Hikinhigh
            </Link>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hotels-hero">
        <div className="hotels-hero-image" />
        <div className="hotels-hero-overlay" />

        <div className="hotels-hero-content">
          <span className="hotels-eyebrow">
            STAYS WORTH STAYING FOR
          </span>

          <h1>
            Find your
            <em> place to stay.</em>
          </h1>

          <p>
            From quiet mountain retreats and heritage
            properties to beachside escapes, discover
            stays selected to make your journey feel
            effortless.
          </p>
        </div>

        <div className="hotels-hero-bottom">
          <span>
            CURATED STAYS · INDIA
          </span>

          <span>
            HIKINHIGH TRAVELS
          </span>
        </div>
      </section>

      {/* =====================================================
          SEARCH / FILTER
      ===================================================== */}

      <section className="hotels-search-section">
        <div className="hotels-container">
          <div className="hotels-search-box">
            <div className="hotels-search-intro">
              <span>
                PLAN YOUR STAY
              </span>

              <h2>
                Where would you
                <em> like to stay?</em>
              </h2>
            </div>

            <div className="hotels-filters">
              <label className="hotels-filter">
                <span>
                  DESTINATION
                </span>

                <select
                  value={selectedRegion}
                  onChange={(event) =>
                    setSelectedRegion(
                      event.target.value
                    )
                  }
                >
                  {regions.map((region) => (
                    <option
                      key={region}
                      value={region}
                    >
                      {region}
                    </option>
                  ))}
                </select>
              </label>

              <label className="hotels-filter">
                <span>
                  PROPERTY TYPE
                </span>

                <select
                  value={selectedType}
                  onChange={(event) =>
                    setSelectedType(
                      event.target.value
                    )
                  }
                >
                  {propertyTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <div className="hotels-results-count">
                <span>
                  AVAILABLE STAYS
                </span>

                <strong>
                  {filteredHotels.length}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="hotels-intro">
        <div className="hotels-container hotels-intro-grid">
          <div>
            <span className="hotels-eyebrow hotels-eyebrow-dark">
              THE HIKINHIGH COLLECTION
            </span>

            <h2>
              Stay somewhere
              <em> you'll remember.</em>
            </h2>
          </div>

          <div className="hotels-intro-copy">
            <p className="hotels-intro-large">
              A great hotel is more than a room.
              It becomes part of the story of the
              journey.
            </p>

            <p>
              That's why our collection focuses on
              properties with character, comfort,
              location and the details that make
              coming back to your room feel just as
              good as heading out to explore.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED HOTEL
      ===================================================== */}

      {featuredHotel && <section className="hotels-featured">
        <div className="hotels-container">
          <div className="hotels-featured-card">
            <div className="hotels-featured-image">
              <img
                src={featuredHotel.image}
                alt={featuredHotel.name}
              />
            </div>

            <div className="hotels-featured-content">
              <span className="hotels-card-label">
                FEATURED STAY
              </span>

              <h2>
                {featuredHotel.name}
              </h2>

              <span className="hotels-featured-location">
                {featuredHotel.location}
              </span>

              <p>
                {featuredHotel.description}
              </p>

              <div className="hotels-featured-info">
                <div>
                  <span>
                    FROM
                  </span>

                  <strong>
                    {featuredHotel.price}
                  </strong>

                  <small>
                    / night
                  </small>
                </div>

                <div>
                  <span>
                    RATING
                  </span>

                  <strong>
                    {featuredHotel.rating}
                  </strong>

                  <small>
                    {featuredHotel.reviews}
                  </small>
                </div>
              </div>

              <Link
                href={`/hotels/${featuredHotel.slug}`}
                className="hotels-primary-button"
              >
                View property
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>}

      {/* =====================================================
          HOTEL COLLECTION
      ===================================================== */}

      <section className="hotels-collection">
        <div className="hotels-container">
          <div className="hotels-section-heading">
            <div>
              <span className="hotels-eyebrow hotels-eyebrow-dark">
                OUR COLLECTION
              </span>

              <h2>
                Places to
                <em> settle in.</em>
              </h2>
            </div>

            <p>
              Browse currently available properties added to the Hikinhigh collection.
            </p>
          </div>

          {loadError ? (
            <div className="hotels-empty">
              <span>UNABLE TO LOAD STAYS</span>
              <h3>We couldn't load hotels right now.</h3>
              <p>{loadError}</p>
              <button type="button" onClick={() => void loadHotels()}>Try again</button>
            </div>
          ) : loading ? (
            <div className="hotels-empty">
              <span>LOADING STAYS</span>
              <h3>Finding your next stay…</h3>
              <p>Loading currently available hotels.</p>
            </div>
          ) : filteredHotels.length > 0 ? (
            <div className="hotels-grid">
              {filteredHotels.map((hotel) => (
                <article
                  key={hotel.id}
                  className="hotel-card"
                >
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    className="hotel-card-image"
                  >
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                    />

                    <span className="hotel-card-type">
                      {hotel.type}
                    </span>
                  </Link>

                  <div className="hotel-card-content">
                    <div className="hotel-card-top">
                      <div>
                        <span className="hotel-card-location">
                          {hotel.location}
                        </span>

                        <h3>
                          {hotel.name}
                        </h3>
                      </div>

                      <div className="hotel-rating">
                        <strong>
                          {hotel.rating}
                        </strong>

                        <span>
                          ★
                        </span>
                      </div>
                    </div>

                    <p>
                      {hotel.description}
                    </p>

                    <div className="hotel-tags">
                      {hotel.tags.map(
                        (tag) => (
                          <span key={tag}>
                            {tag}
                          </span>
                        )
                      )}
                    </div>

                    <div className="hotel-card-bottom">
                      <div>
                        <span>
                          FROM
                        </span>

                        <strong>
                          {hotel.price}
                        </strong>

                        <small>
                          / night
                        </small>
                      </div>

                      <Link
                        href={`/hotels/${hotel.slug}`}
                        className="hotel-view-link"
                      >
                        View stay
                        <span>
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="hotels-empty">
              <span>
                NO STAYS FOUND
              </span>

              <h3>
                Try another destination.
              </h3>

              <p>
                We don't currently have a stay
                matching these filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelectedRegion(
                    "All destinations"
                  );
                  setSelectedType(
                    "All property types"
                  );
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          HOTEL EXPERIENCE
      ===================================================== */}

      <section className="hotels-experience">
        <div className="hotels-container">
          <div className="hotels-section-heading hotels-section-heading-light">
            <div>
              <span className="hotels-eyebrow">
                MORE THAN A ROOM
              </span>

              <h2>
                The details
                <em> matter.</em>
              </h2>
            </div>

            <p>
              We look beyond a room number. Location,
              atmosphere, comfort and thoughtful
              hospitality all shape the experience.
            </p>
          </div>

          <div className="hotels-experience-grid">
            <div className="hotels-experience-item">
              <span>01</span>

              <h3>
                Character
              </h3>

              <p>
                Properties with their own personality,
                rather than places that feel interchangeable.
              </p>
            </div>

            <div className="hotels-experience-item">
              <span>02</span>

              <h3>
                Comfort
              </h3>

              <p>
                The essentials that make a stay genuinely
                relaxing after a day of travelling.
              </p>
            </div>

            <div className="hotels-experience-item">
              <span>03</span>

              <h3>
                Location
              </h3>

              <p>
                Stays that help you experience the destination,
                not simply sleep in it.
              </p>
            </div>

            <div className="hotels-experience-item">
              <span>04</span>

              <h3>
                Hospitality
              </h3>

              <p>
                Thoughtful service and support whenever
                you need it during your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="hotels-final-cta">
        <div className="hotels-final-image" />
        <div className="hotels-final-overlay" />

        <div className="hotels-container hotels-final-content">
          <span className="hotels-eyebrow">
            YOUR NEXT STAY
          </span>

          <h2>
            Find a place
            <em> worth arriving at.</em>
          </h2>

          <p>
            Explore destinations, discover beautiful
            stays and start planning your next journey
            with Hikinhigh Travels.
          </p>

          <div className="hotels-final-buttons">
            <Link
              href="/destinations"
              className="hotels-primary-button hotels-button-light"
            >
              Explore destinations
              <span>→</span>
            </Link>

            <Link
              href="/packages"
              className="hotels-outline-button"
            >
              View packages
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="hotels-footer">
        <div className="hotels-container">
          <div className="hotels-footer-grid">
            <div className="hotels-footer-brand">
              <Link
                href="/"
                className="hotels-brand hotels-brand-footer"
              >
                <span className="hotels-brand-mark">
                  H
                </span>

                <span className="hotels-brand-copy">
                  <strong>
                    hikinhigh
                  </strong>

                  <small>
                    travels
                  </small>
                </span>
              </Link>

              <p>
                Beautiful stays, unforgettable
                journeys and experiences worth
                travelling for.
              </p>
            </div>

            <FooterColumn
              title="Explore"
              links={[
                [
                  "Destinations",
                  "/destinations",
                ],
                ["Hotels", "/hotels"],
                ["Tour Packages", "/packages"],
                [
                  "Adventures",
                  "/adventures",
                ],
              ]}
            />

            <FooterColumn
              title="Company"
              links={[
                ["About Us", "/about"],
                ["Contact", "/contact"],
                [
                  "Privacy Policy",
                  "/privacy-policy",
                ],
                [
                  "Terms & Conditions",
                  "/terms-conditions",
                ],
              ]}
            />

            <div className="hotels-footer-contact">
              <h4>
                Contact
              </h4>

              <a href="mailto:info@hikinhigh.com">
                info@hikinhigh.com
              </a>

              <a href="tel:+919990601105">
                +91 999-060-1105
              </a>

              <div className="hotels-social-links">
                <a href="#">
                  IG
                </a>

                <a href="#">
                  FB
                </a>

                <a href="#">
                  IN
                </a>
              </div>
            </div>
          </div>

          <div className="hotels-footer-bottom">
            <span>
              © {new Date().getFullYear()} Hikinhigh
              Travels
            </span>

            <span>
              Travel further. Experience more.
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div className="hotels-footer-column">
      <h4>
        {title}
      </h4>

      {links.map(([label, href]) => (
        <Link
          key={label}
          href={href}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}