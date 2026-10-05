"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Package = {
  name: string;
  slug: string;
  destination: string;
  duration: string;
  price: string;
  image: string;
  description: string;
  highlights: string[];
  category: string;
};

const packages: Package[] = [
  {
    name: "Kashmir in 6 Days",
    slug: "kashmir-in-6-days",
    destination: "Kashmir",
    duration: "6 Days / 5 Nights",
    price: "₹28,500",
    image: "/images/package-kashmir.jpg",
    description:
      "A carefully paced journey through Srinagar, Gulmarg, Pahalgam and the quiet beauty of Kashmir.",
    highlights: [
      "Srinagar",
      "Gulmarg",
      "Pahalgam",
      "Houseboat experience",
    ],
    category: "Kashmir",
  },
  {
    name: "Himalayan Escape",
    slug: "himalayan-escape",
    destination: "Himachal Pradesh",
    duration: "7 Days / 6 Nights",
    price: "₹31,500",
    image: "/images/package-manali.jpg",
    description:
      "Mountain roads, peaceful valleys and memorable Himalayan experiences across Manali and its surroundings.",
    highlights: [
      "Manali",
      "Solang Valley",
      "Mountain views",
      "Local experiences",
    ],
    category: "Himachal",
  },
  {
    name: "The Royal Route",
    slug: "the-royal-route",
    destination: "Rajasthan",
    duration: "7 Days / 6 Nights",
    price: "₹34,500",
    image: "/images/package-rajasthan.jpg",
    description:
      "A refined journey through Rajasthan's forts, palaces, heritage streets and timeless desert landscapes.",
    highlights: [
      "Jaipur",
      "Jodhpur",
      "Udaipur",
      "Heritage experiences",
    ],
    category: "Rajasthan",
  },
  {
    name: "Goa Getaway",
    slug: "goa-getaway",
    destination: "Goa",
    duration: "5 Days / 4 Nights",
    price: "₹24,500",
    image: "/images/package-goa.jpg",
    description:
      "A relaxed coastal escape combining beautiful beaches, local food, slow mornings and Goa's distinctive character.",
    highlights: [
      "North Goa",
      "South Goa",
      "Beach experiences",
      "Local cuisine",
    ],
    category: "Goa",
  },
  {
    name: "Ladakh Expedition",
    slug: "ladakh-expedition",
    destination: "Ladakh",
    duration: "8 Days / 7 Nights",
    price: "₹42,500",
    image: "/images/package-ladakh.jpg",
    description:
      "A high-altitude Himalayan journey through dramatic landscapes, mountain passes and ancient monasteries.",
    highlights: [
      "Leh",
      "Nubra Valley",
      "Pangong Lake",
      "Khardung La",
    ],
    category: "Ladakh",
  },
  {
    name: "Valley & Lakes",
    slug: "valley-and-lakes",
    destination: "Kashmir",
    duration: "5 Days / 4 Nights",
    price: "₹23,500",
    image: "/images/package-kashmir-valley.jpg",
    description:
      "A shorter Kashmir escape focused on Srinagar, lakes, gardens and the peaceful landscapes of the valley.",
    highlights: [
      "Srinagar",
      "Dal Lake",
      "Mughal Gardens",
      "Shikara ride",
    ],
    category: "Kashmir",
  },
];

const filters = [
  "All Journeys",
  "Kashmir",
  "Himachal",
  "Rajasthan",
  "Goa",
  "Ladakh",
];

function PackageCard({ item }: { item: Package }) {
  return (
    <article className="package-card">
      <div className="package-card-image-wrap">
        <img
          src={item.image}
          alt={item.name}
          className="package-card-image"
        />

        <div className="package-card-location">
          {item.destination}
        </div>

        <div className="package-card-duration">
          {item.duration}
        </div>
      </div>

      <div className="package-card-content">
        <div className="package-card-top">
          <span className="package-card-category">
            {item.category}
          </span>

          <span className="package-card-price">
            From {item.price}
          </span>
        </div>

        <h3>{item.name}</h3>

        <p>{item.description}</p>

        <div className="package-card-highlights">
          {item.highlights.slice(0, 3).map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>

        <Link
          href={`/packages/${item.slug}`}
          className="package-card-link"
        >
          <span>View journey</span>
          <span className="package-card-arrow">↗</span>
        </Link>
      </div>
    </article>
  );
}

export default function PackagesPage() {
  const [activeFilter, setActiveFilter] = useState("All Journeys");

  const filteredPackages = useMemo(() => {
    if (activeFilter === "All Journeys") {
      return packages;
    }

    return packages.filter(
      (item) => item.category === activeFilter
    );
  }, [activeFilter]);

  const featuredPackage = packages[0];

  return (
    <main className="packages-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="packages-hero">
        <div className="packages-hero-image">
          <img
            src="/images/packages-hero.jpg"
            alt="Hikinhigh travel journey"
          />
        </div>

        <div className="packages-hero-overlay" />

        <div className="packages-hero-content">
          <span className="packages-eyebrow">
            CURATED JOURNEYS
          </span>

          <h1>
            Journeys
            <br />
            <em>worth taking.</em>
          </h1>

          <p>
            Thoughtfully designed journeys that give you
            enough time to explore, enough space to slow
            down and plenty to remember.
          </p>
        </div>

        <div className="packages-hero-bottom">
          <span>HIKINHIGH TRAVELS</span>
          <span>EXPLORE / EXPERIENCE / REMEMBER</span>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="packages-intro">
        <div className="packages-intro-label">
          OUR JOURNEYS
        </div>

        <div className="packages-intro-copy">
          <h2>
            Travel should feel like
            <em> a story,</em> not a checklist.
          </h2>

          <p>
            Our packages bring together stays, experiences,
            local exploration and the freedom to actually
            enjoy where you are. Every journey is designed
            around the destination rather than simply
            filling a schedule.
          </p>
        </div>
      </section>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <section className="packages-discovery">
        <div className="packages-section-header">
          <div>
            <span className="packages-section-kicker">
              FIND YOUR JOURNEY
            </span>

            <h2>
              Where will you
              <em> go?</em>
            </h2>
          </div>

          <p>
            Choose a destination and discover a journey
            built around it.
          </p>
        </div>

        <div className="packages-filter-row">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={
                activeFilter === filter
                  ? "packages-filter active"
                  : "packages-filter"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          FEATURED PACKAGE
      ===================================================== */}

      <section className="packages-featured">
        <div className="packages-featured-image">
          <img
            src={featuredPackage.image}
            alt={featuredPackage.name}
          />

          <div className="packages-featured-image-label">
            FEATURED JOURNEY
          </div>
        </div>

        <div className="packages-featured-content">
          <span className="packages-featured-kicker">
            {featuredPackage.destination}
          </span>

          <h2>{featuredPackage.name}</h2>

          <div className="packages-featured-meta">
            <span>{featuredPackage.duration}</span>
            <span>From {featuredPackage.price}</span>
          </div>

          <p>{featuredPackage.description}</p>

          <div className="packages-featured-highlights">
            {featuredPackage.highlights.map((highlight) => (
              <span key={highlight}>
                <i />
                {highlight}
              </span>
            ))}
          </div>

          <Link
            href={`/packages/${featuredPackage.slug}`}
            className="packages-primary-button"
          >
            Explore this journey
            <span>↗</span>
          </Link>
        </div>
      </section>

      {/* =====================================================
          COLLECTION
      ===================================================== */}

      <section className="packages-collection">
        <div className="packages-collection-heading">
          <div>
            <span className="packages-section-kicker">
              THE COLLECTION
            </span>

            <h2>
              More places.
              <br />
              <em>More stories.</em>
            </h2>
          </div>

          <span className="packages-result-count">
            {filteredPackages.length
              .toString()
              .padStart(2, "0")}{" "}
            JOURNEYS
          </span>
        </div>

        <div className="packages-grid">
          {filteredPackages.map((item) => (
            <PackageCard
              key={item.slug}
              item={item}
            />
          ))}
        </div>
      </section>

      {/* =====================================================
          PHILOSOPHY
      ===================================================== */}

      <section className="packages-philosophy">
        <div className="packages-philosophy-left">
          <span className="packages-section-kicker">
            THE HIKINHIGH WAY
          </span>

          <h2>
            Less rushing.
            <br />
            More <em>living.</em>
          </h2>
        </div>

        <div className="packages-philosophy-right">
          <p className="packages-philosophy-lead">
            We believe the best journeys leave room for
            the unexpected.
          </p>

          <div className="packages-philosophy-items">
            <div>
              <span>01</span>

              <h3>Stay well</h3>

              <p>
                Comfortable stays in locations that make
                sense for the journey.
              </p>
            </div>

            <div>
              <span>02</span>

              <h3>Explore deeply</h3>

              <p>
                See the places beyond the standard
                postcard itinerary.
              </p>
            </div>

            <div>
              <span>03</span>

              <h3>Remember more</h3>

              <p>
                Experiences that become stories long after
                you return home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="packages-final-cta">
        <div className="packages-final-cta-image">
          <img
            src="/images/packages-cta.jpg"
            alt="Travel through the mountains"
          />
        </div>

        <div className="packages-final-cta-overlay" />

        <div className="packages-final-cta-content">
          <span className="packages-eyebrow">
            YOUR NEXT CHAPTER
          </span>

          <h2>
            Somewhere
            <br />
            <em>worth going.</em>
          </h2>

          <p>
            Tell us where you want to go. We'll help you
            build the journey around it.
          </p>

          <Link
            href="/contact"
            className="packages-light-button"
          >
            Start planning
            <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}