"use client";

import { useMemo, useState } from "react";

type Destination = {
  name: string;
  region: string;
  description: string;
  image: string;
  category: "Mountains" | "Beach" | "Culture";
  duration: string;
  tag: string;
};

const destinations: Destination[] = [
  {
    name: "Kashmir",
    region: "Jammu & Kashmir, India",
    description: "Glide across quiet lakes, wander through flower-filled valleys and wake up to Himalayan views.",
    image: "/images/destination-kashmir.jpg",
    category: "Mountains",
    duration: "5–7 days",
    tag: "Traveller favourite",
  },
  {
    name: "Manali",
    region: "Himachal Pradesh, India",
    description: "Pine forests, winding mountain roads and fresh-air escapes at the edge of the Himalayas.",
    image: "/images/destination-manali.jpg",
    category: "Mountains",
    duration: "4–6 days",
    tag: "Mountain escape",
  },
  {
    name: "Goa",
    region: "India",
    description: "Unhurried beach days, colourful neighbourhoods and sunsets along the Arabian Sea.",
    image: "/images/destination-goa.jpg",
    category: "Beach",
    duration: "3–5 days",
    tag: "Coastal favourite",
  },
  {
    name: "Rajasthan",
    region: "India",
    description: "Discover grand forts, old-city lanes, desert landscapes and the warmth of royal heritage.",
    image: "/images/destination-rajasthan.jpg",
    category: "Culture",
    duration: "6–8 days",
    tag: "Culture & heritage",
  },
  {
    name: "Ladakh",
    region: "India",
    description: "Take the scenic route through high mountain passes, dramatic valleys and clear blue skies.",
    image: "/images/hero-ladakh.jpg",
    category: "Mountains",
    duration: "6–8 days",
    tag: "For the adventurous",
  },
  {
    name: "Uttarakhand",
    region: "India",
    description: "Find forest trails, riverside retreats and peaceful hill towns surrounded by nature.",
    image: "/images/hero-manali.jpg",
    category: "Mountains",
    duration: "4–6 days",
    tag: "Nature retreat",
  },
];

const filters = ["All places", "Mountains", "Beach", "Culture"] as const;
type Filter = (typeof filters)[number];

export default function DestinationsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All places");
  const [search, setSearch] = useState("");

  const filteredDestinations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return destinations.filter((destination) => {
      const matchesFilter =
        activeFilter === "All places" || destination.category === activeFilter;
      const matchesSearch =
        !normalizedSearch ||
        destination.name.toLowerCase().includes(normalizedSearch) ||
        destination.region.toLowerCase().includes(normalizedSearch) ||
        destination.description.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  return (
    <main className="destinations-page">
      <section className="destinations-hero">
        <div className="destinations-hero-image" aria-hidden="true" />
        <div className="destinations-hero-shade" aria-hidden="true" />
        <div className="destinations-hero-content">
          <p className="destinations-eyebrow">FIND YOUR SOMEWHERE</p>
          <h1>
            Places that stay
            <br />
            with <em>you.</em>
          </h1>
          <p className="destinations-hero-copy">
            From quiet Himalayan mornings to sunlit coastal evenings, find the
            place that feels like your kind of escape.
          </p>
          <a className="destinations-primary-link" href="#explore-destinations">
            Explore destinations <span aria-hidden="true">↘</span>
          </a>
        </div>
        <div className="destinations-hero-note">
          <span className="destinations-note-dot" />
          Curated places. Memorable journeys.
        </div>
      </section>

      <section className="destinations-intro">
        <div>
          <p className="destinations-eyebrow destinations-eyebrow-dark">
            YOUR NEXT CHAPTER
          </p>
          <h2>
            The world is wide.
            <br />
            <em>Start somewhere.</em>
          </h2>
        </div>
        <p className="destinations-intro-copy">
          Every destination has its own rhythm. Choose a place to slow down,
          seek adventure or discover a different side of the world. We’ll help
          you make the most of every moment.
        </p>
      </section>

      <section className="destinations-explore" id="explore-destinations">
        <div className="destinations-section-heading">
          <div>
            <p className="destinations-eyebrow destinations-eyebrow-dark">
              PLACES TO GO
            </p>
            <h2>Explore destinations</h2>
          </div>
          <p className="destinations-result-count">
            {filteredDestinations.length}{" "}
            {filteredDestinations.length === 1 ? "place" : "places"} to discover
          </p>
        </div>

        <div className="destinations-controls">
          <div className="destinations-filter-list" aria-label="Filter destinations">
            {filters.map((filter) => (
              <button
                className={`destinations-filter ${
                  activeFilter === filter ? "is-active" : ""
                }`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <label className="destinations-search">
            <span className="destinations-search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search places"
              aria-label="Search destinations"
            />
          </label>
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="destinations-grid">
            {filteredDestinations.map((destination, index) => (
              <article className="destination-card" key={destination.name}>
                <a
                  className="destination-card-image"
                  href="/packages"
                  aria-label={`Explore trips to ${destination.name}`}
                >
                  <img
                    src={destination.image}
                    alt={`${destination.name}, ${destination.region}`}
                    loading={index > 1 ? "lazy" : "eager"}
                  />
                  <span className="destination-card-tag">{destination.tag}</span>
                  <span className="destination-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
                <div className="destination-card-body">
                  <div className="destination-card-location">
                    <span>{destination.region}</span>
                    <span>{destination.duration}</span>
                  </div>
                  <h3>{destination.name}</h3>
                  <p>{destination.description}</p>
                  <a className="destination-card-link" href="/packages">
                    Discover journeys <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="destinations-empty">
            <h3>No destinations found</h3>
            <p>Try another search or choose a different category.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("All places");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="destinations-cta">
        <div>
          <p className="destinations-eyebrow">NOT SURE WHERE TO BEGIN?</p>
          <h2>
            Your kind of journey
            <br />
            starts with a conversation.
          </h2>
        </div>
        <a href="/contact" className="destinations-cta-link">
          Let’s plan your trip <span aria-hidden="true">↗</span>
        </a>
      </section>

      <style jsx>{`
        .destinations-page {
          --destination-ink: #173d32;
          --destination-muted: #6b7770;
          color: #20362f;
          background: #f7f7f2;
          min-height: 100vh;
        }

        .destinations-hero {
          min-height: 590px;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #29483d;
          color: #fff;
        }

        .destinations-hero-image,
        .destinations-hero-shade {
          position: absolute;
          inset: 0;
        }

        .destinations-hero-image {
          background-image: url("/images/hero-kashmir.jpg");
          background-size: cover;
          background-position: center 48%;
          transform: scale(1.01);
        }

        .destinations-hero-shade {
          background: linear-gradient(
            90deg,
            rgba(11, 31, 25, 0.82) 0%,
            rgba(11, 31, 25, 0.58) 44%,
            rgba(11, 31, 25, 0.12) 100%
          );
        }

        .destinations-hero-content {
          position: relative;
          z-index: 1;
          width: min(1180px, calc(100% - 64px));
          margin: 0 auto;
          padding: 92px 0 110px;
        }

        .destinations-eyebrow {
          margin: 0 0 18px;
          color: #d7e5d8;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.19em;
        }

        .destinations-hero h1 {
          max-width: 760px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(48px, 7vw, 86px);
          font-weight: 400;
          letter-spacing: -0.055em;
          line-height: 0.99;
        }

        .destinations-hero h1 em,
        .destinations-intro h2 em {
          font-weight: 400;
        }

        .destinations-hero-copy {
          max-width: 470px;
          margin: 25px 0 30px;
          color: rgba(255, 255, 255, 0.88);
          font-size: 16px;
          line-height: 1.8;
        }

        .destinations-primary-link,
        .destinations-cta-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          min-height: 50px;
          padding: 0 21px;
          color: #183d32;
          background: #f4f2e9;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition: transform 180ms ease, background 180ms ease;
        }

        .destinations-primary-link:hover,
        .destinations-cta-link:hover {
          transform: translateY(-2px);
          background: #fff;
        }

        .destinations-hero-note {
          position: absolute;
          z-index: 1;
          right: max(32px, calc((100vw - 1180px) / 2));
          bottom: 30px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
        }

        .destinations-note-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #c9ddad;
        }

        .destinations-intro,
        .destinations-explore {
          width: min(1180px, calc(100% - 64px));
          margin: 0 auto;
        }

        .destinations-intro {
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          gap: 70px;
          align-items: end;
          padding: 100px 0 88px;
          border-bottom: 1px solid #e0e4dc;
        }

        .destinations-eyebrow-dark {
          color: #718276;
        }

        .destinations-intro h2,
        .destinations-section-heading h2,
        .destinations-cta h2 {
          margin: 0;
          color: var(--destination-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 4vw, 51px);
          font-weight: 400;
          letter-spacing: -0.045em;
          line-height: 1.08;
        }

        .destinations-intro-copy {
          max-width: 480px;
          margin: 0 0 5px;
          color: var(--destination-muted);
          font-size: 15px;
          line-height: 1.9;
        }

        .destinations-explore {
          padding: 85px 0 105px;
        }

        .destinations-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
        }

        .destinations-section-heading .destinations-eyebrow {
          margin-bottom: 14px;
        }

        .destinations-section-heading h2 {
          font-size: clamp(32px, 3.6vw, 44px);
        }

        .destinations-result-count {
          margin: 0 0 5px;
          color: var(--destination-muted);
          font-size: 13px;
        }

        .destinations-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin: 32px 0 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e4dc;
        }

        .destinations-filter-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .destinations-filter {
          border: 1px solid #dce2d9;
          border-radius: 999px;
          padding: 10px 16px;
          background: transparent;
          color: #596b60;
          cursor: pointer;
          font: inherit;
          font-size: 12px;
          transition: all 160ms ease;
        }

        .destinations-filter:hover,
        .destinations-filter.is-active {
          border-color: var(--destination-ink);
          background: var(--destination-ink);
          color: white;
        }

        .destinations-search {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 220px;
          min-width: 180px;
          border-bottom: 1px solid #bdc9be;
          padding: 8px 2px;
          color: #65776b;
        }

        .destinations-search-icon {
          font-size: 22px;
          line-height: 1;
        }

        .destinations-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #20362f;
          font: inherit;
          font-size: 13px;
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 34px 24px;
        }

        .destination-card {
          min-width: 0;
        }

        .destination-card-image {
          position: relative;
          display: block;
          height: 300px;
          overflow: hidden;
          background: #dce4dc;
          color: white;
        }

        .destination-card-image::after {
          position: absolute;
          inset: 0;
          content: "";
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.2) 0%,
            transparent 38%,
            rgba(0, 0, 0, 0.12) 100%
          );
          pointer-events: none;
        }

        .destination-card-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 450ms ease;
        }

        .destination-card-image:hover img {
          transform: scale(1.045);
        }

        .destination-card-tag {
          position: absolute;
          z-index: 1;
          top: 16px;
          left: 16px;
          padding: 8px 10px;
          background: rgba(247, 247, 242, 0.94);
          color: #24483b;
          font-size: 10px;
          letter-spacing: 0.025em;
        }

        .destination-card-arrow {
          position: absolute;
          z-index: 1;
          right: 15px;
          bottom: 15px;
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 50%;
          background: #f7f7f2;
          color: #173d32;
          font-size: 19px;
        }

        .destination-card-body {
          padding: 19px 2px 0;
        }

        .destination-card-location {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: #758178;
          font-size: 10px;
          letter-spacing: 0.02em;
        }

        .destination-card-body h3 {
          margin: 10px 0 9px;
          color: var(--destination-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 29px;
          font-weight: 400;
          letter-spacing: -0.025em;
        }

        .destination-card-body p {
          min-height: 72px;
          margin: 0;
          color: var(--destination-muted);
          font-size: 13px;
          line-height: 1.75;
        }

        .destination-card-link {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-top: 17px;
          color: var(--destination-ink);
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
        }

        .destination-card-link span {
          transition: transform 160ms ease;
        }

        .destination-card-link:hover span {
          transform: translateX(4px);
        }

        .destinations-empty {
          padding: 65px 20px;
          text-align: center;
          border: 1px dashed #cbd5cb;
        }

        .destinations-empty h3 {
          margin: 0 0 10px;
          color: var(--destination-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          font-weight: 400;
        }

        .destinations-empty p {
          color: var(--destination-muted);
          font-size: 14px;
        }

        .destinations-empty button {
          margin-top: 10px;
          padding: 11px 16px;
          border: 0;
          background: var(--destination-ink);
          color: white;
          cursor: pointer;
        }

        .destinations-cta {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 30px;
          padding: 70px max(32px, calc((100vw - 1180px) / 2));
          background: #173d32;
          color: white;
        }

        .destinations-cta .destinations-eyebrow {
          margin-bottom: 16px;
        }

        .destinations-cta h2 {
          color: white;
          font-size: clamp(32px, 4vw, 48px);
        }

        .destinations-cta-link {
          flex-shrink: 0;
          margin-bottom: 4px;
        }

        @media (max-width: 900px) {
          .destinations-hero {
            min-height: 540px;
          }

          .destinations-intro {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 72px 0 64px;
          }

          .destinations-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .destination-card-image {
            height: 270px;
          }

          .destinations-cta {
            align-items: start;
            flex-direction: column;
          }
        }

        @media (max-width: 600px) {
          .destinations-hero {
            min-height: 520px;
          }

          .destinations-hero-content,
          .destinations-intro,
          .destinations-explore {
            width: calc(100% - 40px);
          }

          .destinations-hero-content {
            padding: 75px 0 95px;
          }

          .destinations-hero h1 {
            font-size: clamp(47px, 13vw, 66px);
          }

          .destinations-hero-copy {
            font-size: 14px;
          }

          .destinations-hero-note {
            right: 20px;
            bottom: 22px;
            font-size: 10px;
          }

          .destinations-intro {
            padding: 62px 0 54px;
          }

          .destinations-explore {
            padding: 60px 0 70px;
          }

          .destinations-section-heading {
            align-items: start;
            flex-direction: column;
            gap: 12px;
          }

          .destinations-controls {
            align-items: stretch;
            flex-direction: column;
          }

          .destinations-search {
            width: 100%;
          }

          .destinations-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .destination-card-image {
            height: 290px;
          }

          .destination-card-body p {
            min-height: 0;
          }

          .destinations-cta {
            padding: 55px 20px;
          }
        }
      `}</style>
    </main>
  );
}
