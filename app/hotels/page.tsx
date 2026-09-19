"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Hotel = {
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
  featured?: boolean;
};

const hotels: Hotel[] = [
  {
    name: "Lemontree Hotel",
    location: "Srinagar, Kashmir",
    region: "Kashmir",
    type: "Boutique Stay",
    description:
      "A peaceful valley retreat surrounded by gardens, mountain views and the quiet beauty of Kashmir.",
    image: "/images/hotel-kashmir.jpg",
    price: "₹8,500",
    rating: "4.8",
    reviews: "124 reviews",
    tags: ["Mountain View", "Breakfast", "Wi-Fi"],
    featured: true,
  },
  {
    name: "Himalayan Retreat",
    location: "Manali, Himachal Pradesh",
    region: "Manali",
    type: "Mountain Resort",
    description:
      "A refined mountain escape designed for slow mornings, crisp air and unforgettable Himalayan views.",
    image: "/images/hotel-manali.jpg",
    price: "₹7,200",
    rating: "4.7",
    reviews: "96 reviews",
    tags: ["Valley View", "Restaurant", "Parking"],
  },
  {
    name: "Casa Sol",
    location: "North Goa, Goa",
    region: "Goa",
    type: "Beach Resort",
    description:
      "A relaxed coastal stay close to Goa's beaches, cafés and the easy rhythm of island life.",
    image: "/images/hotel-goa.jpg",
    price: "₹6,900",
    rating: "4.6",
    reviews: "158 reviews",
    tags: ["Pool", "Beach Access", "Breakfast"],
  },
  {
    name: "The Royal Haveli",
    location: "Jaipur, Rajasthan",
    region: "Rajasthan",
    type: "Heritage Hotel",
    description:
      "A character-filled heritage stay bringing together traditional architecture and modern comfort.",
    image: "/images/hotel-rajasthan.jpg",
    price: "₹9,800",
    rating: "4.9",
    reviews: "87 reviews",
    tags: ["Heritage", "Restaurant", "Pool"],
  },
  {
    name: "Snowline Lodge",
    location: "Leh, Ladakh",
    region: "Ladakh",
    type: "Mountain Lodge",
    description:
      "A warm and comfortable base for exploring the dramatic landscapes of Ladakh.",
    image: "/images/hotel-ladakh.jpg",
    price: "₹5,900",
    rating: "4.7",
    reviews: "72 reviews",
    tags: ["Mountain View", "Heating", "Restaurant"],
  },
  {
    name: "The Valley Manor",
    location: "Pahalgam, Kashmir",
    region: "Kashmir",
    type: "Luxury Stay",
    description:
      "An intimate property surrounded by pine forests, open landscapes and the sound of the valley.",
    image: "/images/hotel-pahalgam.jpg",
    price: "₹10,500",
    rating: "4.9",
    reviews: "61 reviews",
    tags: ["River View", "Breakfast", "Spa"],
  },
];

const regions = [
  "All destinations",
  "Kashmir",
  "Manali",
  "Goa",
  "Rajasthan",
  "Ladakh",
];

const propertyTypes = [
  "All property types",
  "Boutique Stay",
  "Mountain Resort",
  "Beach Resort",
  "Heritage Hotel",
  "Mountain Lodge",
  "Luxury Stay",
];

export default function HotelsPage() {
  const [selectedRegion, setSelectedRegion] =
    useState("All destinations");

  const [selectedType, setSelectedType] =
    useState("All property types");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const regionMatch =
        selectedRegion === "All destinations" ||
        hotel.region === selectedRegion;

      const typeMatch =
        selectedType === "All property types" ||
        hotel.type === selectedType;

      return regionMatch && typeMatch;
    });
  }, [selectedRegion, selectedType]);

  const featuredHotel =
    hotels.find((hotel) => hotel.featured) ?? hotels[0];

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

      <section className="hotels-featured">
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
                href="/hotels/the-orchard-house"
                className="hotels-primary-button"
              >
                View property
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
              Browse our growing collection of
              handpicked stays across some of
              India's most loved destinations.
            </p>
          </div>

          {filteredHotels.length > 0 ? (
            <div className="hotels-grid">
              {filteredHotels.map((hotel) => (
                <article
                  key={hotel.name}
                  className="hotel-card"
                >
                  <Link
                    href="/hotels"
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
                        href="/hotels"
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