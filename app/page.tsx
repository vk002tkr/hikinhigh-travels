"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "../components/providers/CurrencyProvider";

type HomeCruise = {
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
  cover_image_url: string | null;
  featured: boolean;
};


type HomeDestination = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  region: string | null;
  short_description: string | null;
  description: string | null;
  hero_image: string | null;
  is_featured: boolean;
};

type HomeHotel = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  country: string | null;
  description: string | null;
  hero_image: string | null;
  star_rating: number | null;
  is_featured: boolean;
};

type HomePackage = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  duration_days: number | null;
  duration_nights: number | null;
  base_price_usd: number;
  hero_image: string | null;
  is_featured: boolean;
  destination_id: string | null;
};

type HomeExperience = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  short_description: string | null;
  hero_image: string | null;
  is_featured: boolean;
};

const fallbackImage = "/images/destination-kashmir.jpg";

type HeroSlide = {
  location: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

const heroSlides: HeroSlide[] = [
  {
    location: "Ocean Voyages · Worldwide",
    title: "The world is better",
    accent: "from the sea.",
    description: "Discover extraordinary cruise holidays, breathtaking coastlines and unforgettable days at sea.",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=2200&q=85",
    primaryHref: "/cruises",
    primaryLabel: "Explore cruises",
    secondaryHref: "/cruises",
    secondaryLabel: "Discover sailings",
  },
  {
    location: "Island Hopping · Beyond Ordinary",
    title: "Wake up somewhere",
    accent: "wonderful.",
    description: "Unpack once and explore beautiful ports, sunlit islands and new horizons on every sailing.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2200&q=85",
    primaryHref: "/packages",
    primaryLabel: "Explore island escapes",
    secondaryHref: "/destinations",
    secondaryLabel: "Find your destination",
  },
  {
    location: "Life On Board · All Aboard",
    title: "Make the journey",
    accent: "the destination.",
    description: "From relaxing days on deck to memorable shore excursions, your next story starts on board.",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2200&q=85",
    primaryHref: "/cruises",
    primaryLabel: "Find your cruise",
    secondaryHref: "/adventures",
    secondaryLabel: "Explore experiences",
  },
  {
    location: "Coastal Discoveries · Worldwide",
    title: "Find your own",
    accent: "blue horizon.",
    description: "Explore beautiful beaches, coastal towns and laid-back escapes made for curious travellers.",
    image: "/images/hero-goa.jpg",
    primaryHref: "/destinations",
    primaryLabel: "Explore destinations",
    secondaryHref: "/packages",
    secondaryLabel: "Browse holidays",
  },
  {
    location: "Your Next Voyage · Hikinhigh",
    title: "Leave ordinary",
    accent: "far behind.",
    description: "Browse sailings, compare your options and let the sea lead you somewhere extraordinary.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=85",
    primaryHref: "/cruises",
    primaryLabel: "Explore cruises",
    secondaryHref: "/packages",
    secondaryLabel: "Plan a getaway",
  },
  {
    location: "Mountain Trails · Hiking & Trekking",
    title: "Take the path",
    accent: "less travelled.",
    description: "Find fresh air, dramatic mountain views and rewarding hiking and trekking adventures.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2200&q=85",
    primaryHref: "/adventures",
    primaryLabel: "Explore hiking",
    secondaryHref: "/packages",
    secondaryLabel: "Plan a mountain trip",
  },
  {
    location: "Adrenaline Rush · Bungee & More",
    title: "Feel your heart race",
    accent: "then do it again.",
    description: "Make room for big thrills, from bungee jumping and ziplining to once-in-a-lifetime outdoor challenges.",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2200&q=85",
    primaryHref: "/adventures",
    primaryLabel: "Find an adventure",
    secondaryHref: "/adventures",
    secondaryLabel: "Explore activities",
  },
  {
    location: "Explore More · Tours & Culture",
    title: "Get to know",
    accent: "somewhere new.",
    description: "Wander historic streets, discover local culture and see more with thoughtfully planned tours.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85",
    primaryHref: "/packages",
    primaryLabel: "Explore tour packages",
    secondaryHref: "/destinations",
    secondaryLabel: "Choose a destination",
  },
  {
    location: "Underwater Wonders · Ocean Adventures",
    title: "Dive into a world",
    accent: "of wonder.",
    description: "Discover vibrant reefs, clear blue water and unforgettable ocean experiences for your next escape.",
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=2200&q=85",
    primaryHref: "/adventures",
    primaryLabel: "Explore water activities",
    secondaryHref: "/packages",
    secondaryLabel: "Find a beach escape",
  },
  {
    location: "Wild Landscapes · Outdoor Escapes",
    title: "Go beyond",
    accent: "the usual.",
    description: "From scenic road trips and wildlife encounters to camping under the stars, make every day count.",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2200&q=85",
    primaryHref: "/adventures",
    primaryLabel: "Discover adventures",
    secondaryHref: "/packages",
    secondaryLabel: "Plan your journey",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] =
    useState(0);

  const [activeSearch, setActiveSearch] = useState("Cruises");
  const [searchDestination, setSearchDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [travellers, setTravellers] = useState("2");
  const [bookingError, setBookingError] = useState("");

  const [cruises, setCruises] = useState<HomeCruise[]>([]);
  const [cruisesLoading, setCruisesLoading] = useState(true);
  const [cruisesError, setCruisesError] = useState("");
  const [destinations, setDestinations] = useState<HomeDestination[]>([]);
  const [hotels, setHotels] = useState<HomeHotel[]>([]);
  const [packages, setPackages] = useState<HomePackage[]>([]);
  const [adventures, setAdventures] = useState<HomeExperience[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState("");

  const {
    formatPrice,
    currency,
  } = useCurrency();

  useEffect(() => {
    let mounted = true;

    async function loadHomepageContent() {
      setContentLoading(true);
      setContentError("");

      const [destinationResult, hotelResult, packageResult, experienceResult] = await Promise.all([
        supabase
          .from("destinations")
          .select("id, name, slug, country, region, short_description, description, hero_image, is_featured")
          .eq("is_active", true)
          .order("is_featured", { ascending: false })
          .order("sort_order", { ascending: true })
          .limit(4),
        supabase
          .from("hotels")
          .select("id, name, slug, city, country, description, hero_image, star_rating, is_featured")
          .eq("is_active", true)
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("packages")
          .select("id, name, slug, short_description, duration_days, duration_nights, base_price_usd, hero_image, is_featured, destination_id")
          .eq("is_active", true)
          .order("is_featured", { ascending: false })
          .order("sort_order", { ascending: true })
          .limit(3),
        supabase
          .from("experiences")
          .select("id, name, slug, category, short_description, hero_image, is_featured")
          .eq("is_active", true)
          .order("is_featured", { ascending: false })
          .order("sort_order", { ascending: true })
          .limit(3),
      ]);

      if (!mounted) return;

      const errors = [destinationResult.error, hotelResult.error, packageResult.error, experienceResult.error].filter(Boolean);
      if (errors.length) {
        console.error("Homepage content load warning:", errors.map((error) => error?.message));
        setContentError("Some travel collections could not be loaded. Please check the catalogue pages.");
      }

      setDestinations((destinationResult.data ?? []) as HomeDestination[]);
      setHotels((hotelResult.data ?? []) as HomeHotel[]);
      setPackages((packageResult.data ?? []) as HomePackage[]);
      setAdventures((experienceResult.data ?? []) as HomeExperience[]);
      setContentLoading(false);
    }

    void loadHomepageContent();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadPublishedCruises() {
      const { data, error } = await supabase
        .from("cruises")
        .select(
          "id, name, slug, cruise_line, destination, departure_port, departure_date, return_date, duration_nights, price_from, currency, short_description, cover_image_url, featured"
        )
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3);

      if (!mounted) return;

      if (error) {
        console.error("Homepage cruise catalogue load failed:", error.message);
        setCruisesError("Cruises are temporarily unavailable. Please visit the cruise catalogue.");
        setCruises([]);
      } else {
        setCruises((data ?? []) as HomeCruise[]);
      }

      setCruisesLoading(false);
    }

    void loadPublishedCruises();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide(
        (current) =>
          (current + 1) %
          heroSlides.length
      );
    }, 6000);

    return () =>
      window.clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setActiveSlide(
      (current) =>
        (current - 1 + heroSlides.length) %
        heroSlides.length
    );
  };

  const nextSlide = () => {
    setActiveSlide(
      (current) =>
        (current + 1) %
        heroSlides.length
    );
  };

  const slide =
    heroSlides[activeSlide];

  return (
    <main className="site-shell">
      {contentError && <p role="status" style={{ padding: "10px 24px", textAlign: "center", color: "#64748b", fontSize: 13 }}>{contentError}</p>}
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">
        {heroSlides.map(
          (item, index) => (
            <div
              key={item.location}
              className={`hero-slide ${
                index === activeSlide
                  ? "hero-slide-active"
                  : ""
              }`}
            >
              <img
                src={item.image}
                alt={item.location}
                className="hero-image"
              />
            </div>
          )
        )}

        <div className="hero-overlay" />
        <div className="hero-bottom-gradient" />

        <div className="hero-content">
          <div
            className="hero-copy"
            key={activeSlide}
          >
            <div className="hero-location">
              <span />
              {slide.location}
            </div>

            <h1>
              {slide.title}
              <em>
                {slide.accent}
              </em>
            </h1>

            <p>
              {slide.description}
            </p>

            <div className="hero-buttons">
              <a
                href={slide.primaryHref}
                className="primary-button"
              >
                {slide.primaryLabel}
              </a>

              <a
                href={slide.secondaryHref}
                className="secondary-button"
              >
                {slide.secondaryLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="slider-controls">
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous slide"
          >
            ←
          </button>

          <div className="slide-number">
            <strong>
              {String(
                activeSlide + 1
              ).padStart(2, "0")}
            </strong>

            <span>/</span>

            <span>
              {String(
                heroSlides.length
              ).padStart(2, "0")}
            </span>
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        <div className="slide-progress">
          {heroSlides.map(
            (item, index) => (
              <button
                key={item.location}
                type="button"
                className={
                  index === activeSlide
                    ? "progress-active"
                    : ""
                }
                onClick={() =>
                  setActiveSlide(index)
                }
                aria-label={`Go to slide ${
                  index + 1
                }`}
              />
            )
          )}
        </div>



      </section>

      {/* BOOKING SEARCH: always directly below the hero */}
      {/* BOOKING SEARCH */}

        <div className="booking-wrapper home-booking-wrapper">
          <div className="booking-box">
            <div className="booking-tabs">
              {[
                "Cruises",
                "Stays",
                "Journeys",
                "Experiences",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    activeSearch === item
                      ? "tab-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveSearch(item)
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            <form
              className="booking-fields"
              onSubmit={(event) => {
                event.preventDefault();
                setBookingError("");

                if (checkInDate && checkOutDate && checkOutDate < checkInDate) {
                  setBookingError("Check-out date must be on or after check-in date.");
                  return;
                }

                const destinationPath =
                  activeSearch === "Cruises"
                    ? "/cruises"
                    : activeSearch === "Stays"
                      ? "/hotels"
                      : activeSearch === "Journeys"
                        ? "/packages"
                        : "/adventures";

                const params = new URLSearchParams();
                if (searchDestination.trim()) params.set("destination", searchDestination.trim());
                if (checkInDate) params.set("checkIn", checkInDate);
                if (checkOutDate) params.set("checkOut", checkOutDate);
                params.set("travellers", travellers);

                window.location.href = `${destinationPath}?${params.toString()}`;
              }}
            >
              <div className="booking-field booking-input-field">
                <label htmlFor="booking-destination">Destination</label>
                <input
                  id="booking-destination"
                  type="text"
                  list="booking-destination-options"
                  value={searchDestination}
                  onChange={(event) => setSearchDestination(event.target.value)}
                  placeholder="Where are you going?"
                  autoComplete="off"
                />
                <datalist id="booking-destination-options">
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.name} />
                  ))}
                  {hotels.map((hotel) => (
                    <option key={`hotel-${hotel.id}`} value={hotel.city || hotel.name} />
                  ))}
                </datalist>
              </div>

              <div className="booking-field booking-input-field">
                <label htmlFor="booking-check-in">Check in</label>
                <input
                  id="booking-check-in"
                  type="date"
                  value={checkInDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => {
                    setCheckInDate(event.target.value);
                    if (checkOutDate && event.target.value && checkOutDate < event.target.value) {
                      setCheckOutDate("");
                    }
                    setBookingError("");
                  }}
                />
              </div>

              <div className="booking-field booking-input-field">
                <label htmlFor="booking-check-out">Check out</label>
                <input
                  id="booking-check-out"
                  type="date"
                  value={checkOutDate}
                  min={checkInDate || new Date().toISOString().slice(0, 10)}
                  onChange={(event) => {
                    setCheckOutDate(event.target.value);
                    setBookingError("");
                  }}
                />
              </div>

              <div className="booking-field booking-input-field">
                <label htmlFor="booking-travellers">Travellers</label>
                <select
                  id="booking-travellers"
                  value={travellers}
                  onChange={(event) => setTravellers(event.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="7">7 Guests</option>
                  <option value="8">8 Guests</option>
                  <option value="9">9 Guests</option>
                  <option value="10">10 Guests</option>
                </select>
              </div>

              <button type="submit" className="search-button">Search</button>
              {bookingError && (
                <p className="booking-search-error" role="alert">{bookingError}</p>
              )}
            </form>
          </div>
        </div>

      {/* CRUISES */}

      <section id="cruises" className="home-cruises-section">
        <div className="content-width">
          <div className="home-cruises-heading">
            <div>
              <span className="eyebrow">Sail somewhere extraordinary</span>
              <h2>Discover your next <em>cruise.</em></h2>
              <p>
                From unforgettable ocean voyages to beautiful destinations,
                find a sailing that makes the journey part of the adventure.
              </p>
            </div>
            <Link href="/cruises" className="home-cruises-view-all">
              Explore all cruises <span>↗</span>
            </Link>
          </div>

          {cruisesLoading ? (
            <div className="home-cruises-message" aria-live="polite">
              Discovering available cruises…
            </div>
          ) : cruisesError ? (
            <div className="home-cruises-message" role="status">
              {cruisesError}
              <Link href="/cruises">View cruise catalogue →</Link>
            </div>
          ) : cruises.length === 0 ? (
            <div className="home-cruises-empty">
              <div>
                <span className="home-cruises-empty-eyebrow">THE OPEN SEA IS CALLING</span>
                <h3>Your next great journey starts here.</h3>
                <p>Explore our cruise catalogue and discover upcoming sailings.</p>
              </div>
              <Link href="/cruises" className="home-cruises-cta">
                Explore cruises <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="home-cruise-grid">
              {cruises.map((cruise, index) => (
                <Link
                  href={`/cruises#cruise-${cruise.slug}`}
                  key={cruise.id}
                  className={`home-cruise-card ${index === 0 ? "home-cruise-card-featured" : ""}`}
                >
                  <div className="home-cruise-image">
                    <img
                      src={cruise.cover_image_url || "/images/hero-goa.jpg"}
                      alt={`${cruise.name} cruise`}
                      loading="lazy"
                    />
                    <div className="home-cruise-image-overlay" />
                    {cruise.featured && (
                      <span className="home-cruise-featured-label">Featured sailing</span>
                    )}
                    <span className="home-cruise-line">{cruise.cruise_line}</span>
                  </div>
                  <div className="home-cruise-details">
                    <span className="home-cruise-destination">{cruise.destination}</span>
                    <h3>{cruise.name}</h3>
                    {cruise.short_description && (
                      <p>{cruise.short_description}</p>
                    )}
                    <div className="home-cruise-meta">
                      <span>
                        {cruise.duration_nights
                          ? `${cruise.duration_nights} nights`
                          : cruise.departure_port || "Dates on request"}
                      </span>
                      <span className="home-cruise-price">
                        <small>From</small>
                        {formatCruiseMoney(cruise.price_from, cruise.currency)}
                      </span>
                    </div>
                    <div className="home-cruise-card-link">
                      Explore cruise <span>↗</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* INTRO */}

      <section
        id="about"
        className="intro-section"
      >
        <div className="content-width intro-grid">
          <div>
            <span className="eyebrow">
              The Hikinhigh way
            </span>

            <h2>
              Travel should be about
              the
              <em> feeling.</em>
            </h2>
          </div>

          <div className="intro-text">
            <p>
              From beautiful stays
              and carefully planned
              journeys to experiences
              that take you somewhere
              new, Hikinhigh brings
              the pieces of your next
              escape together.
            </p>

            <a
              href="/about"
              className="text-link"
            >
              Discover Hikinhigh{" "}
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}

      <section
        id="destinations"
        className="section"
      >
        <div className="content-width">
          <SectionHeading
            eyebrow="Destinations"
            title="Go somewhere worth remembering."
            action="View all destinations"
            actionHref="/destinations"
          />

          <div className="destination-grid">
            {destinations.map(
              (
                destination,
                index
              ) => (
                <a
                  href="/destinations"
                  key={destination.id}
                  className={`destination-card ${
                    index % 2 === 1
                      ? "destination-offset"
                      : ""
                  }`}
                >
                  <img
                    src={destination.hero_image || fallbackImage}
                    alt={destination.name}
                  />

                  <div className="destination-overlay" />

                  <div className="destination-content">
                    <span>
                      {destination.country || destination.region || destination.short_description || "Explore destination"}
                    </span>

                    <h3>
                      {
                        destination.name
                      }
                    </h3>

                    <div className="destination-arrow">
                      ↗
                    </div>
                  </div>
                </a>
              )
            )}
            {!contentLoading && destinations.length === 0 && (
              <p style={{ gridColumn: "1 / -1", padding: "24px 0", color: "#64748b" }} className="homepage-empty-state">Destinations are being updated. Please check back soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* STAYS */}

      <section
        id="stays"
        className="dark-section"
      >
        <div className="content-width">
          <SectionHeading
            dark
            eyebrow="Everything in one place"
            title="Plan the journey. We handle the details."
          />

          <div className="service-grid">
            {hotels.map((hotel, index) => (
              <ServiceCard
                key={hotel.id}
                number={String(index + 1).padStart(2, "0")}
                title={hotel.name}
                text={[hotel.city, hotel.country].filter(Boolean).join(", ") || hotel.description || "Discover this stay with Hikinhigh Travels."}
                image={hotel.hero_image || "/images/service-hotels.jpg"}
                href="/hotels"
              />
            ))}
            {!contentLoading && hotels.length === 0 && (
              <p style={{ gridColumn: "1 / -1", padding: "24px 0", color: "#64748b" }} className="homepage-empty-state">New stays are being added. Please check back soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* JOURNEYS */}

      <section
        id="journeys"
        className="section package-section"
      >
        <div className="content-width">
          <SectionHeading
            eyebrow="Curated journeys"
            title="Trips made for the way you want to travel."
            action="View all journeys"
            actionHref="/packages"
          />

          <div className="home-package-grid">
            {packages.map(
              (pkg, index) => (
                <a
                  href="/packages"
                  key={pkg.id}
                  className={`home-package-card ${
                    index === 0
                      ? "home-package-card-featured"
                      : ""
                  }`}
                  aria-label={`View ${pkg.name}`}
                >
                  <div className="home-package-image">
                    <img
                      src={pkg.hero_image || "/images/service-packages.jpg"}
                      alt={pkg.name}
                    />

                    <span className="home-package-label">
                      {pkg.is_featured ? "Featured journey" : "Curated journey"}
                    </span>

                    <div className="home-package-image-bottom">
                      <span>
                        {destinations.find((destination) => destination.id === pkg.destination_id)?.name || "Discover the destination"}
                      </span>

                      <h3>
                        {pkg.name}
                      </h3>
                    </div>
                  </div>

                  <div className="home-package-details">
                    <div className="home-package-duration">
                      <span className="home-package-meta-label">
                        Duration
                      </span>

                      <strong>
                        {pkg.duration_days ? `${pkg.duration_days} Days` : "Flexible duration"}{pkg.duration_nights != null ? ` / ${pkg.duration_nights} Nights` : ""}
                      </strong>
                    </div>

                    <div className="home-package-price">
                      <span className="home-package-meta-label">
                        Starting from
                      </span>

                      <strong>
                        {formatPrice(Number(pkg.base_price_usd || 0))}
                      </strong>
                    </div>

                    <span className="home-package-view">
                      View journey{" "}
                      <span>↗</span>
                    </span>
                  </div>
                </a>
              )
            )}
            {!contentLoading && packages.length === 0 && (
              <p style={{ gridColumn: "1 / -1", padding: "24px 0", color: "#64748b" }} className="homepage-empty-state">New journeys are being prepared. Please check back soon.</p>
            )}
          </div>

          <div
            aria-live="polite"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
              whiteSpace: "nowrap",
            }}
          >
            Prices displayed in{" "}
            {currency}.
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}

      <section
        id="experiences"
        className="adventure-section"
      >
        <div className="content-width">
          <div className="adventure-heading">
            <div>
              <span className="eyebrow eyebrow-light">
                Experience collection
              </span>

              <h2>
                Leave room for a
                <em>
                  little wild.
                </em>
              </h2>
            </div>

            <p>
              Add something
              unforgettable to your
              itinerary with
              experiences designed
              for curious travellers.
            </p>
          </div>

          <div className="adventure-grid">
            {adventures.map(
              (adventure) => (
                <a
                  href="/adventures"
                  key={adventure.id}
                  className="adventure-card"
                >
                  <img
                    src={adventure.hero_image || "/images/service-adventure.jpg"}
                    alt={adventure.name}
                  />

                  <div className="adventure-overlay" />

                  <div className="adventure-content">
                    <span>
                      {adventure.category || "Travel experience"}
                    </span>

                    <h3>
                      {adventure.name}
                    </h3>

                    <div>
                      Explore →
                    </div>
                  </div>
                </a>
              )
            )}
            {!contentLoading && adventures.length === 0 && (
              <p style={{ gridColumn: "1 / -1", padding: "24px 0", color: "#64748b" }} className="homepage-empty-state">New experiences are coming soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* WHY HIKINHIGH */}

      <section className="section">
        <div className="content-width why-grid">
          <div>
            <span className="eyebrow">
              Why Hikinhigh
            </span>

            <h2 className="large-heading">
              Less planning.
              <em>
                More living.
              </em>
            </h2>

            <p className="why-description">
              A travel platform
              built around the things
              that actually matter:
              great places,
              straightforward booking
              and experiences worth
              talking about afterwards.
            </p>
          </div>

          <div className="benefit-grid">
            <Benefit
              number="01"
              title="Curated"
              text="Travel options selected with quality, character and experience in mind."
            />

            <Benefit
              number="02"
              title="Simple"
              text="Discover, compare and book without unnecessary complexity."
            />

            <Benefit
              number="03"
              title="Flexible"
              text="Build a trip around your dates, preferences and budget."
            />

            <Benefit
              number="04"
              title="Supported"
              text="Get assistance before and during your journey when you need it."
            />
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="cta-section">
        <div className="cta-image">
          <img
            src="/images/cta-travel.jpg"
            alt="Travel landscape"
          />
        </div>

        <div className="cta-overlay" />

        <div className="cta-content">
          <span>
            YOUR NEXT JOURNEY
          </span>

          <h2>
            Somewhere
            <em>
              is waiting.
            </em>
          </h2>

          <p>
            Create your account
            and start discovering
            stays, journeys and
            experiences around the
            world.
          </p>

          <a
            href="/register"
            className="primary-button"
          >
            Start exploring
          </a>
        </div>
      </section>

      <style jsx global>{`
        .home-cruises-section {
          position: relative;
          padding: 88px 0 96px;
          background: linear-gradient(180deg, #f5f7f4 0%, #ffffff 100%);
          color: #143d31;
        }

        .home-cruises-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 34px;
        }

        .home-cruises-heading h2 {
          max-width: 760px;
          margin: 14px 0 12px;
          font-size: clamp(36px, 4.8vw, 64px);
          line-height: 1.04;
          letter-spacing: -0.045em;
          font-weight: 700;
        }

        .home-cruises-heading h2 em {
          color: #6a9b7f;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
        }

        .home-cruises-heading p {
          max-width: 610px;
          margin: 0;
          color: #69766f;
          font-size: 15px;
          line-height: 1.8;
        }

        .home-cruises-view-all {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          flex: 0 0 auto;
          padding: 13px 0;
          border-bottom: 1px solid #b7c8bd;
          color: #143d31;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .home-cruises-view-all span,
        .home-cruise-card-link span {
          transition: transform 180ms ease;
        }

        .home-cruises-view-all:hover span,
        .home-cruise-card:hover .home-cruise-card-link span {
          transform: translate(3px, -3px);
        }

        .home-cruise-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .home-cruise-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e4e9e4;
          border-radius: 18px;
          background: #ffffff;
          color: #173d32;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(20, 61, 49, 0.04);
          transition: transform 220ms ease, box-shadow 220ms ease;
        }

        .home-cruise-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 38px rgba(20, 61, 49, 0.12);
        }

        .home-cruise-image {
          position: relative;
          height: 250px;
          overflow: hidden;
          background: #dce8e3;
        }

        .home-cruise-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 500ms ease;
        }

        .home-cruise-card:hover .home-cruise-image img {
          transform: scale(1.04);
        }

        .home-cruise-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(8, 31, 25, 0.05) 25%, rgba(8, 31, 25, 0.72) 100%);
        }

        .home-cruise-featured-label {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 8px 11px;
          border: 1px solid rgba(255, 255, 255, 0.42);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: #143d31;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .home-cruise-line {
          position: absolute;
          right: 18px;
          bottom: 17px;
          left: 18px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .home-cruise-details {
          padding: 22px 22px 20px;
        }

        .home-cruise-destination {
          color: #6a9b7f;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .home-cruise-details h3 {
          margin: 9px 0 8px;
          color: #143d31;
          font-size: 23px;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }

        .home-cruise-details > p {
          min-height: 44px;
          margin: 0 0 18px;
          color: #718078;
          font-size: 13px;
          line-height: 1.7;
        }

        .home-cruise-meta {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #edf0ed;
          color: #69766f;
          font-size: 12px;
        }

        .home-cruise-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: #143d31;
          font-size: 17px;
          font-weight: 800;
          white-space: nowrap;
        }

        .home-cruise-price small {
          margin-bottom: 3px;
          color: #7b8780;
          font-size: 10px;
          font-weight: 500;
        }

        .home-cruise-card-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 19px;
          color: #143d31;
          font-size: 12px;
          font-weight: 800;
        }

        .home-cruise-card-link span {
          display: inline-block;
          font-size: 17px;
        }

        .home-cruises-message {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          padding: 28px;
          border: 1px solid #e2e9e3;
          border-radius: 16px;
          background: #ffffff;
          color: #64736b;
          font-size: 14px;
        }

        .home-cruises-message a {
          color: #143d31;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .home-cruises-empty {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          padding: clamp(28px, 5vw, 58px);
          border-radius: 20px;
          background: #143d31;
          color: #ffffff;
        }

        .home-cruises-empty-eyebrow {
          color: #b6d8c2;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .home-cruises-empty h3 {
          margin: 12px 0 8px;
          font-size: clamp(25px, 3vw, 38px);
          letter-spacing: -0.035em;
        }

        .home-cruises-empty p {
          margin: 0;
          color: #d2dfd7;
          font-size: 14px;
          line-height: 1.7;
        }

        .home-cruises-cta {
          display: inline-flex;
          align-items: center;
          gap: 20px;
          flex: 0 0 auto;
          padding: 15px 20px;
          border-radius: 999px;
          background: #ffffff;
          color: #143d31;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .home-cruise-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .home-cruise-card-featured {
            grid-column: 1 / -1;
          }

          .home-cruise-card-featured .home-cruise-image {
            height: 320px;
          }
        }

        @media (max-width: 700px) {
          .home-cruises-section {
            padding: 68px 0;
          }

          .home-cruises-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .home-cruise-grid {
            grid-template-columns: 1fr;
          }

          .home-cruise-card-featured {
            grid-column: auto;
          }

          .home-cruise-image,
          .home-cruise-card-featured .home-cruise-image {
            height: 240px;
          }

          .home-cruises-empty {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        .home-booking-wrapper .booking-input-field {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          gap: 7px;
          min-width: 0;
          text-align: left;
          cursor: default;
        }

        .home-booking-wrapper .booking-input-field label {
          color: #78847d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.13em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .home-booking-wrapper .booking-input-field input,
        .home-booking-wrapper .booking-input-field select {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #17211b;
          font: inherit;
          font-size: 13px;
          font-weight: 650;
        }

        .home-booking-wrapper .booking-input-field input::placeholder {
          color: #17211b;
          opacity: 1;
        }

        .home-booking-wrapper .booking-input-field input[type="date"] {
          min-height: 20px;
        }

        .home-booking-wrapper .booking-search-error {
          grid-column: 1 / -1;
          margin: 0;
          color: #b91c1c;
          font-size: 12px;
        }

        .home-booking-wrapper {
          display: block !important;
          position: relative;
          inset: auto;
          width: min(1240px, calc(100% - 48px));
          margin: -48px auto 72px;
          z-index: 20;
        }

        @media (max-width: 700px) {
          .hero {
            min-height: 760px;
            padding-bottom: 0;
          }

          .hero-content {
            min-height: 760px;
            padding-top: 110px;
            padding-bottom: 100px;
            align-items: flex-start;
          }

          .slider-controls {
            right: 18px;
            bottom: 80px;
          }

          .slide-progress {
            right: 18px;
            bottom: 48px;
          }

          .home-booking-wrapper {
            width: calc(100% - 28px);
            margin: -28px auto 56px;
          }

          .home-booking-wrapper .booking-box {
            padding: 10px;
            border-radius: 14px;
          }

          .home-booking-wrapper .booking-tabs {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 2px;
            padding: 0 0 8px;
          }

          .home-booking-wrapper .booking-tabs button {
            min-width: 0;
            padding: 10px 3px;
            font-size: 10px;
            white-space: nowrap;
          }

          .home-booking-wrapper .booking-fields {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .home-booking-wrapper .booking-field {
            min-height: 58px;
            padding: 10px 8px;
          }

          .home-booking-wrapper .booking-input-field {
            min-height: 68px;
            padding: 10px 8px;
          }

          .home-booking-wrapper .booking-input-field label {
            font-size: 9px;
          }

          .home-booking-wrapper .booking-input-field input,
          .home-booking-wrapper .booking-input-field select {
            font-size: 11px;
          }

          .home-booking-wrapper .booking-field strong {
            font-size: 11px;
          }

          .home-booking-wrapper .search-button {
            grid-column: 1 / -1;
            min-height: 44px;
            margin: 8px 4px 2px;
          }
        }

        @media (max-width: 380px) {
          .home-booking-wrapper .booking-field strong {
            font-size: 10px;
          }
        }
      `}</style>
    </main>
  );
}

function formatCruiseMoney(amount: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currencyCode || "INR"} ${Number(amount).toLocaleString("en-IN")}`;
  }
}

/* ============================================================
   BOOKING FIELD
============================================================ */

function BookingField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <button
      type="button"
      className="booking-field"
    >
      <span>{label}</span>

      <strong>{value}</strong>
    </button>
  );
}

/* ============================================================
   SECTION HEADING
============================================================ */

function SectionHeading({
  eyebrow,
  title,
  action,
  actionHref,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  actionHref?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`section-heading ${
        dark
          ? "section-heading-dark"
          : ""
      }`}
    >
      <div>
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h2>{title}</h2>
      </div>

      {action &&
        actionHref && (
          <a
            href={actionHref}
            className="heading-action"
          >
            {action}{" "}
            <span>→</span>
          </a>
        )}
    </div>
  );
}

/* ============================================================
   SERVICE CARD
============================================================ */

function ServiceCard({
  number,
  title,
  text,
  image,
  href,
}: {
  number: string;
  title: string;
  text: string;
  image: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="service-card"
    >
      <img
        src={image}
        alt={title}
      />

      <div className="service-image-overlay" />

      <div className="service-top">
        <span className="service-number">
          {number}
        </span>

        <span className="service-arrow">
          ↗
        </span>
      </div>

      <div className="service-content">
        <h3>{title}</h3>

        <p>{text}</p>

        <div className="service-line" />

        <span className="service-link">
          Explore {title} →
        </span>
      </div>
    </a>
  );
}

/* ============================================================
   BENEFIT
============================================================ */

function Benefit({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="benefit">
      <span>{number}</span>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}