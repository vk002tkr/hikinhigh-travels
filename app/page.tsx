"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "../components/providers/CurrencyProvider";

type HeroSlide = {
  location: string;
  title: string;
  accent: string;
  description: string;
  image: string;
};

const heroSlides: HeroSlide[] = [
  {
    location: "Mountain Escapes · Worldwide",
    title: "Go where the world",
    accent: "feels bigger.",
    description:
      "Discover remarkable landscapes, beautiful stays and journeys designed around the way you want to travel.",
    image: "/images/hero-kashmir.jpg",
  },
  {
    location: "Coastal Retreats · Worldwide",
    title: "Slow mornings,",
    accent: "endless horizons.",
    description:
      "Find sun-soaked coastlines, island escapes and stays made for switching off and staying awhile.",
    image: "/images/hero-goa.jpg",
  },
  {
    location: "Wild Escapes · Worldwide",
    title: "Leave the ordinary,",
    accent: "find the wild.",
    description:
      "From dramatic landscapes to unforgettable outdoor experiences, make room for something different.",
    image: "/images/hero-ladakh.jpg",
  },
  {
    location: "Heritage Journeys · Worldwide",
    title: "Travel through places",
    accent: "with a story.",
    description:
      "Explore architecture, culture, food and timeless destinations through thoughtfully designed journeys.",
    image: "/images/hero-rajasthan.jpg",
  },
  {
    location: "Mountain Retreats · Worldwide",
    title: "Take the road",
    accent: "less travelled.",
    description:
      "Trade familiar routines for mountain air, quiet valleys and experiences worth remembering.",
    image: "/images/hero-manali.jpg",
  },
];

const destinations = [
  {
    name: "Mountain Escapes",
    country: "Alpine & highland journeys",
    image: "/images/destination-kashmir.jpg",
  },
  {
    name: "Coastal Retreats",
    country: "Beaches & island escapes",
    image: "/images/destination-goa.jpg",
  },
  {
    name: "Heritage Routes",
    country: "Culture, history & design",
    image: "/images/destination-rajasthan.jpg",
  },
  {
    name: "Wild Landscapes",
    country: "Nature & outdoor adventures",
    image: "/images/destination-manali.jpg",
  },
];

const services = [
  {
    number: "01",
    title: "Stays",
    text: "Discover hotels, resorts and beautiful places to stay, from city hideaways to remote retreats.",
    image: "/images/service-hotels.jpg",
    href: "/hotels",
  },
  {
    number: "02",
    title: "Journeys",
    text: "Explore thoughtfully planned trips that bring destinations, accommodation and experiences together.",
    image: "/images/service-packages.jpg",
    href: "/packages",
  },
  {
    number: "03",
    title: "Experiences",
    text: "Add something memorable to your trip with adventures, culture, nature and experiences around the world.",
    image: "/images/service-adventure.jpg",
    href: "/adventures",
  },
];

const packages = [
  {
    title: "Alpine Escape",
    location: "Mountains · Lakes · Villages",
    duration: "7 Days / 6 Nights",
    price: 899,
    image: "/images/package-kashmir.jpg",
  },
  {
    title: "Coastal Escape",
    location: "Beaches · Islands · Sunsets",
    duration: "6 Days / 5 Nights",
    price: 749,
    image: "/images/package-goa.jpg",
  },
  {
    title: "Heritage Route",
    location: "Cities · Culture · Architecture",
    duration: "8 Days / 7 Nights",
    price: 999,
    image: "/images/package-rajasthan.jpg",
  },
];

const adventures = [
  {
    title: "Trekking",
    category: "Mountain Experiences",
    image: "/images/adventure-trekking.jpg",
  },
  {
    title: "Water Adventures",
    category: "Water Experiences",
    image: "/images/adventure-rafting.jpg",
  },
  {
    title: "Camping",
    category: "Nature Experiences",
    image: "/images/adventure-camping.jpg",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] =
    useState(0);

  const [activeSearch, setActiveSearch] =
    useState("Stays");

  const {
    formatPrice,
    currency,
  } = useCurrency();

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
                href="/packages"
                className="primary-button"
              >
                Explore journeys
              </a>

              <a
                href="/adventures"
                className="secondary-button"
              >
                Discover experiences
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

        {/* BOOKING */}

        <div className="booking-wrapper">
          <div className="booking-box">
            <div className="booking-tabs">
              {[
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

            <div className="booking-fields">
              <BookingField
                label="Destination"
                value="Where are you going?"
              />

              <BookingField
                label="Check in"
                value="Add dates"
              />

              <BookingField
                label="Check out"
                value="Add dates"
              />

              <BookingField
                label="Travellers"
                value="2 Guests"
              />

              <button
                type="button"
                className="search-button"
                onClick={() => {
                  if (
                    activeSearch ===
                    "Stays"
                  ) {
                    window.location.href =
                      "/hotels";
                  } else if (
                    activeSearch ===
                    "Journeys"
                  ) {
                    window.location.href =
                      "/packages";
                  } else {
                    window.location.href =
                      "/adventures";
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>
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
                  key={
                    destination.name
                  }
                  className={`destination-card ${
                    index % 2 === 1
                      ? "destination-offset"
                      : ""
                  }`}
                >
                  <img
                    src={
                      destination.image
                    }
                    alt={
                      destination.name
                    }
                  />

                  <div className="destination-overlay" />

                  <div className="destination-content">
                    <span>
                      {
                        destination.country
                      }
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
            {services.map(
              (service) => (
                <ServiceCard
                  key={service.title}
                  number={
                    service.number
                  }
                  title={
                    service.title
                  }
                  text={service.text}
                  image={
                    service.image
                  }
                  href={service.href}
                />
              )
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
                  key={pkg.title}
                  className={`home-package-card ${
                    index === 0
                      ? "home-package-card-featured"
                      : ""
                  }`}
                  aria-label={`View ${pkg.title}`}
                >
                  <div className="home-package-image">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                    />

                    <span className="home-package-label">
                      {index === 0
                        ? "Featured journey"
                        : pkg.location.split(
                            " · "
                          )[0]}
                    </span>

                    <div className="home-package-image-bottom">
                      <span>
                        {pkg.location}
                      </span>

                      <h3>
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  <div className="home-package-details">
                    <div className="home-package-duration">
                      <span className="home-package-meta-label">
                        Duration
                      </span>

                      <strong>
                        {pkg.duration}
                      </strong>
                    </div>

                    <div className="home-package-price">
                      <span className="home-package-meta-label">
                        Starting from
                      </span>

                      <strong>
                        {formatPrice(
                          pkg.price
                        )}
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
                  key={
                    adventure.title
                  }
                  className="adventure-card"
                >
                  <img
                    src={
                      adventure.image
                    }
                    alt={
                      adventure.title
                    }
                  />

                  <div className="adventure-overlay" />

                  <div className="adventure-content">
                    <span>
                      {
                        adventure.category
                      }
                    </span>

                    <h3>
                      {
                        adventure.title
                      }
                    </h3>

                    <div>
                      Explore →
                    </div>
                  </div>
                </a>
              )
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
    </main>
  );
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