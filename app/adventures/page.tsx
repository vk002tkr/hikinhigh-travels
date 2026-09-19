"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Adventure = {
  name: string;
  slug: string;
  location: string;
  duration: string;
  price: string;
  image: string;
  description: string;
  category: string;
  difficulty: string;
};

const adventures: Adventure[] = [
  {
    name: "Himalayan Trekking",
    slug: "himalayan-trekking",
    location: "Himachal Pradesh",
    duration: "3–6 Days",
    price: "₹8,500",
    image: "/images/adventure-trekking.jpg",
    description:
      "Walk deeper into the mountains through pine forests, quiet villages, high trails and unforgettable Himalayan landscapes.",
    category: "Trekking",
    difficulty: "Moderate",
  },
  {
    name: "River Rafting",
    slug: "river-rafting",
    location: "Rishikesh",
    duration: "Half Day",
    price: "₹2,500",
    image: "/images/adventure-rafting.jpg",
    description:
      "Take on the rapids of the Ganga with experienced guides, mountain scenery and an experience built around the river.",
    category: "Water",
    difficulty: "Moderate",
  },
  {
    name: "Mountain Camping",
    slug: "mountain-camping",
    location: "Manali",
    duration: "2 Days / 1 Night",
    price: "₹4,500",
    image: "/images/adventure-camping.jpg",
    description:
      "Leave the city behind for a night beneath the mountains, with open skies, campfire evenings and fresh mountain air.",
    category: "Camping",
    difficulty: "Easy",
  },
  {
    name: "Ladakh Expedition",
    slug: "ladakh-expedition",
    location: "Ladakh",
    duration: "5–8 Days",
    price: "₹18,500",
    image: "/images/adventure-ladakh.jpg",
    description:
      "Cross dramatic high-altitude landscapes, remote valleys and ancient mountain passes on a journey through Ladakh.",
    category: "Expedition",
    difficulty: "Challenging",
  },
  {
    name: "Snow Adventure",
    slug: "snow-adventure",
    location: "Gulmarg",
    duration: "1–2 Days",
    price: "₹6,500",
    image: "/images/adventure-snow.jpg",
    description:
      "Experience Kashmir in winter with snow activities, mountain views and the spectacular landscapes around Gulmarg.",
    category: "Snow",
    difficulty: "Easy",
  },
  {
    name: "Forest Escape",
    slug: "forest-escape",
    location: "Uttarakhand",
    duration: "2–3 Days",
    price: "₹7,500",
    image: "/images/adventure-forest.jpg",
    description:
      "A slower adventure through forests, mountain trails and peaceful Himalayan settlements away from the crowds.",
    category: "Nature",
    difficulty: "Easy",
  },
];

const filters = [
  "All Adventures",
  "Trekking",
  "Water",
  "Camping",
  "Expedition",
  "Snow",
  "Nature",
];

function AdventureCard({
  item,
}: {
  item: Adventure;
}) {
  return (
    <article className="adventure-card">
      <Link
        href={`/adventures/${item.slug}`}
        className="adventure-card-image-wrap"
      >
        <img
          src={item.image}
          alt={item.name}
          className="adventure-card-image"
        />

        <span className="adventure-card-category">
          {item.category}
        </span>

        <span className="adventure-card-difficulty">
          {item.difficulty}
        </span>

        <span className="adventure-card-image-arrow">
          ↗
        </span>
      </Link>

      <div className="adventure-card-content">
        <div className="adventure-card-meta">
          <span>{item.location}</span>
          <span>{item.duration}</span>
        </div>

        <h3>{item.name}</h3>

        <p>{item.description}</p>

        <div className="adventure-card-bottom">
          <span>From {item.price}</span>

          <Link
            href={`/adventures/${item.slug}`}
            className="adventure-card-link"
          >
            Explore
            <span>↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AdventuresPage() {
  const [activeFilter, setActiveFilter] =
    useState("All Adventures");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const filteredAdventures = useMemo(() => {
    if (activeFilter === "All Adventures") {
      return adventures;
    }

    return adventures.filter(
      (item) => item.category === activeFilter
    );
  }, [activeFilter]);

  const featured = adventures[0];

  return (
    <main className="adventures-page">
      {/* HEADER */}
      <header className="adventures-header">
        <div className="adventures-header-inner">
          <Link
            href="/"
            className="adventures-logo"
          >
            <span className="adventures-logo-main">
              HIKINHIGH
            </span>

            <span className="adventures-logo-sub">
              TRAVELS
            </span>
          </Link>

          <nav className="adventures-desktop-nav">
            <Link href="/destinations">
              Destinations
            </Link>

            <Link href="/hotels">
              Hotels
            </Link>

            <Link href="/packages">
              Packages
            </Link>

            <Link
              href="/adventures"
              className="adventures-nav-active"
            >
              Adventures
            </Link>

            <Link href="/about">
              About
            </Link>
          </nav>

          <div className="adventures-header-actions">
            <Link
              href="/login"
              className="adventures-login"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="adventures-join"
            >
              Join us
            </Link>
          </div>

          <button
            type="button"
            className="adventures-menu-button"
            onClick={() =>
              setMobileMenu((value) => !value)
            }
            aria-label="Toggle navigation"
            aria-expanded={mobileMenu}
          >
            <span />
            <span />
          </button>
        </div>

        {mobileMenu && (
          <div className="adventures-mobile-menu">
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
              className="adventures-mobile-active"
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

            <div className="adventures-mobile-actions">
              <Link
                href="/login"
                onClick={() => setMobileMenu(false)}
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenu(false)}
              >
                Join us
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="adventures-hero">
        <div className="adventures-hero-image">
          <img
            src="/images/adventures-hero.jpg"
            alt="Adventure in the mountains"
          />
        </div>

        <div className="adventures-hero-overlay" />

        <div className="adventures-hero-content">
          <span className="adventures-eyebrow">
            BEYOND THE ORDINARY
          </span>

          <h1>
            Go
            <br />
            <em>further.</em>
          </h1>

          <p>
            Trails, rivers, mountains and open skies.
            Experiences for travellers who want to feel
            the destination, not just see it.
          </p>
        </div>

        <div className="adventures-hero-bottom">
          <span>HIKINHIGH TRAVELS</span>
          <span>
            MOVE / EXPLORE / EXPERIENCE
          </span>
        </div>
      </section>

      {/* INTRO */}
      <section className="adventures-intro">
        <div className="adventures-intro-label">
          THE ADVENTURE COLLECTION
        </div>

        <div className="adventures-intro-copy">
          <h2>
            Some places are better
            <em> experienced.</em>
          </h2>

          <p>
            Our adventure experiences are built around
            the landscape. Hike through forests, follow
            mountain trails, take on river rapids or spend
            a night beneath a sky full of stars.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      <section className="adventures-featured">
        <Link
          href={`/adventures/${featured.slug}`}
          className="adventures-featured-image"
        >
          <img
            src={featured.image}
            alt={featured.name}
          />

          <div className="adventures-featured-image-overlay" />

          <span className="adventures-featured-label">
            FEATURED EXPERIENCE
          </span>

          <span className="adventures-featured-arrow">
            ↗
          </span>
        </Link>

        <div className="adventures-featured-content">
          <span className="adventures-featured-kicker">
            {featured.category}
          </span>

          <h2>{featured.name}</h2>

          <div className="adventures-featured-location">
            {featured.location}
          </div>

          <p>{featured.description}</p>

          <div className="adventures-featured-details">
            <div>
              <span>Duration</span>
              <strong>{featured.duration}</strong>
            </div>

            <div>
              <span>Difficulty</span>
              <strong>{featured.difficulty}</strong>
            </div>

            <div>
              <span>From</span>
              <strong>{featured.price}</strong>
            </div>
          </div>

          <Link
            href={`/adventures/${featured.slug}`}
            className="adventures-primary-button"
          >
            Explore experience
            <span>↗</span>
          </Link>
        </div>
      </section>

      {/* FILTERS */}
      <section className="adventures-discovery">
        <div className="adventures-section-heading">
          <div>
            <span className="adventures-section-kicker">
              FIND YOUR EXPERIENCE
            </span>

            <h2>
              Choose your
              <em> adventure.</em>
            </h2>
          </div>

          <p>
            From easy escapes to demanding mountain
            journeys, find something that matches the
            way you want to travel.
          </p>
        </div>

        <div className="adventures-filter-row">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={
                activeFilter === filter
                  ? "adventures-filter active"
                  : "adventures-filter"
              }
              onClick={() =>
                setActiveFilter(filter)
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* COLLECTION */}
      <section className="adventures-collection">
        <div className="adventures-collection-top">
          <div>
            <span className="adventures-section-kicker">
              THE COLLECTION
            </span>

            <h2>
              Pick a direction.
              <br />
              <em>Then go.</em>
            </h2>
          </div>

          <span className="adventures-result-count">
            {filteredAdventures.length
              .toString()
              .padStart(2, "0")}{" "}
            EXPERIENCES
          </span>
        </div>

        <div className="adventures-grid">
          {filteredAdventures.map((item) => (
            <AdventureCard
              key={item.slug}
              item={item}
            />
          ))}
        </div>
      </section>

      {/* ADVENTURE PHILOSOPHY */}
      <section className="adventures-manifesto">
        <div className="adventures-manifesto-image">
          <img
            src="/images/adventures-manifesto.jpg"
            alt="Mountain landscape"
          />
        </div>

        <div className="adventures-manifesto-overlay" />

        <div className="adventures-manifesto-content">
          <span className="adventures-eyebrow">
            WHY WE GO
          </span>

          <h2>
            The best
            <br />
            <em>stories</em>
            <br />
            happen outside.
          </h2>

          <p>
            Sometimes the road disappears. Sometimes the
            weather changes. Sometimes the plan becomes
            something better.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="adventures-final-cta">
        <div className="adventures-final-cta-content">
          <span className="adventures-section-kicker">
            YOUR NEXT ADVENTURE
          </span>

          <h2>
            Find your
            <br />
            <em>wild.</em>
          </h2>

          <p>
            Tell us what kind of experience you're looking
            for and we'll help you find the right place to
            begin.
          </p>

          <Link
            href="/contact"
            className="adventures-final-button"
          >
            Start planning
            <span>↗</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="adventures-footer">
        <div className="adventures-footer-top">
          <div className="adventures-footer-brand">
            <Link
              href="/"
              className="adventures-footer-logo"
            >
              HIKINHIGH
            </Link>

            <p>
              Travel further.
              <br />
              Remember more.
            </p>
          </div>

          <div className="adventures-footer-column">
            <span>EXPLORE</span>

            <Link href="/destinations">
              Destinations
            </Link>

            <Link href="/hotels">
              Hotels
            </Link>

            <Link href="/packages">
              Packages
            </Link>

            <Link href="/adventures">
              Adventures
            </Link>
          </div>

          <div className="adventures-footer-column">
            <span>COMPANY</span>

            <Link href="/about">
              About Us
            </Link>

            <Link href="/contact">
              Contact
            </Link>

            <Link href="/faq">
              FAQ
            </Link>
          </div>

          <div className="adventures-footer-column">
            <span>LEGAL</span>

            <Link href="/privacy-policy">
              Privacy Policy
            </Link>

            <Link href="/terms-conditions">
              Terms & Conditions
            </Link>
          </div>
        </div>

        <div className="adventures-footer-bottom">
          <span>
            © {new Date().getFullYear()} Hikinhigh Travels
          </span>

          <span>
            MADE FOR THE CURIOUS
          </span>
        </div>
      </footer>
    </main>
  );
}