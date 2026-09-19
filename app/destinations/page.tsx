"use client";

import { useEffect, useState } from "react";

type HeroSlide = {
  location: string;
  title: string;
  accent: string;
  description: string;
  image: string;
};

const heroSlides: HeroSlide[] = [
  {
    location: "Kashmir · India",
    title: "Where the mountains",
    accent: "meet the sky.",
    description:
      "Discover serene lakes, alpine valleys and unforgettable journeys through Kashmir.",
    image: "/images/hero-kashmir.jpg",
  },
  {
    location: "Manali · Himachal Pradesh",
    title: "Into the wild,",
    accent: "into the mountains.",
    description:
      "Escape to pine forests, dramatic peaks and experiences made for adventure.",
    image: "/images/hero-manali.jpg",
  },
  {
    location: "Goa · India",
    title: "Slow mornings,",
    accent: "endless horizons.",
    description:
      "Trade the ordinary for golden beaches, beautiful stays and coastal escapes.",
    image: "/images/hero-goa.jpg",
  },
  {
    location: "Rajasthan · India",
    title: "A journey through",
    accent: "royal India.",
    description:
      "Experience magnificent forts, timeless architecture and the colours of Rajasthan.",
    image: "/images/hero-rajasthan.jpg",
  },
  {
    location: "Ladakh · India",
    title: "Take the road",
    accent: "less travelled.",
    description:
      "High-altitude landscapes, winding roads and an adventure you will never forget.",
    image: "/images/hero-ladakh.jpg",
  },
];

const destinations = [
  {
    name: "Kashmir",
    country: "India",
    image: "/images/destination-kashmir.jpg",
  },
  {
    name: "Manali",
    country: "Himachal Pradesh",
    image: "/images/destination-manali.jpg",
  },
  {
    name: "Goa",
    country: "India",
    image: "/images/destination-goa.jpg",
  },
  {
    name: "Rajasthan",
    country: "India",
    image: "/images/destination-rajasthan.jpg",
  },
];

const services = [
  {
    number: "01",
    title: "Hotels & Stays",
    text: "From boutique escapes to comfortable family stays, discover places that feel right for your journey.",
    image: "/images/service-hotels.jpg",
    href: "/hotels",
  },
  {
    number: "02",
    title: "Tour Packages",
    text: "Well-planned journeys combining destinations, accommodation and memorable experiences.",
    image: "/images/service-packages.jpg",
    href: "/packages",
  },
  {
    number: "03",
    title: "Adventure",
    text: "Trekking, rafting, camping and more for travellers who want to experience a destination differently.",
    image: "/images/service-adventure.jpg",
    href: "/adventures",
  },
];

const packages = [
  {
    title: "Kashmir in 6 Days",
    location: "Srinagar · Gulmarg · Pahalgam",
    duration: "6 Days / 5 Nights",
    price: "₹18,999",
    image: "/images/package-kashmir.jpg",
  },
  {
    title: "Himalayan Escape",
    location: "Manali · Solang · Kasol",
    duration: "5 Days / 4 Nights",
    price: "₹14,999",
    image: "/images/package-manali.jpg",
  },
  {
    title: "The Royal Route",
    location: "Jaipur · Jodhpur · Udaipur",
    duration: "7 Days / 6 Nights",
    price: "₹21,999",
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
    title: "Rafting",
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSearch, setActiveSearch] = useState("Hotels");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  const slide = heroSlides[activeSlide];

  return (
    <main className="site-shell">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="brand" aria-label="Hikinhigh Travels Home">
            <span className="brand-mark">H</span>

            <span className="brand-copy">
              <strong>hikinhigh</strong>
              <small>travels</small>
            </span>
          </a>

          <nav className="desktop-nav">
            <a href="/destinations">Destinations</a>
            <a href="/hotels">Hotels</a>
            <a href="/packages">Packages</a>
            <a href="/adventures">Adventures</a>
            <a href="/about">About</a>
          </nav>

          <div className="header-actions">
            <a href="/login" className="login-link">
              Login
            </a>

            <a href="/register" className="header-button">
              Join us
            </a>
          </div>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenu((value) => !value)}
            aria-label="Open navigation"
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? "×" : "☰"}
          </button>
        </div>

        {mobileMenu && (
          <div className="mobile-menu">
            <a href="/destinations" onClick={() => setMobileMenu(false)}>
              Destinations
            </a>

            <a href="/hotels" onClick={() => setMobileMenu(false)}>
              Hotels
            </a>

            <a href="/packages" onClick={() => setMobileMenu(false)}>
              Packages
            </a>

            <a href="/adventures" onClick={() => setMobileMenu(false)}>
              Adventures
            </a>

            <a href="/about" onClick={() => setMobileMenu(false)}>
              About
            </a>

            <div className="mobile-menu-divider" />

            <a href="/login" onClick={() => setMobileMenu(false)}>
              Login
            </a>

            <a
              href="/register"
              className="mobile-join"
              onClick={() => setMobileMenu(false)}
            >
              Join Hikinhigh
            </a>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">
        {heroSlides.map((item, index) => (
          <div
            key={item.location}
            className={`hero-slide ${
              index === activeSlide ? "hero-slide-active" : ""
            }`}
          >
            <img
              src={item.image}
              alt={item.location}
              className="hero-image"
            />
          </div>
        ))}

        <div className="hero-overlay" />
        <div className="hero-bottom-gradient" />

        <div className="hero-content">
          <div className="hero-copy" key={activeSlide}>
            <div className="hero-location">
              <span />
              {slide.location}
            </div>

            <h1>
              {slide.title}
              <em>{slide.accent}</em>
            </h1>

            <p>{slide.description}</p>

            <div className="hero-buttons">
              <a href="/packages" className="primary-button">
                Explore journeys
              </a>

              <a href="/adventures" className="secondary-button">
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
            <strong>{String(activeSlide + 1).padStart(2, "0")}</strong>
            <span>/</span>
            <span>{String(heroSlides.length).padStart(2, "0")}</span>
          </div>

          <button type="button" onClick={nextSlide} aria-label="Next slide">
            →
          </button>
        </div>

        <div className="slide-progress">
          {heroSlides.map((item, index) => (
            <button
              key={item.location}
              type="button"
              className={index === activeSlide ? "progress-active" : ""}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* ===================================================
            BOOKING SEARCH
        =================================================== */}

        <div className="booking-wrapper">
          <div className="booking-box">
            <div className="booking-tabs">
              {["Hotels", "Tour Packages", "Adventures"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={activeSearch === item ? "tab-active" : ""}
                  onClick={() => setActiveSearch(item)}
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

              <BookingField label="Check in" value="Add dates" />

              <BookingField label="Check out" value="Add dates" />

              <BookingField label="Travellers" value="2 Guests" />

              <button
                type="button"
                className="search-button"
                onClick={() => {
                  if (activeSearch === "Hotels") {
                    window.location.href = "/hotels";
                  } else if (activeSearch === "Tour Packages") {
                    window.location.href = "/packages";
                  } else {
                    window.location.href = "/adventures";
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section id="about" className="intro-section">
        <div className="content-width intro-grid">
          <div>
            <span className="eyebrow">The Hikinhigh way</span>

            <h2>
              Travel should be about the
              <em> feeling.</em>
            </h2>
          </div>

          <div className="intro-text">
            <p>
              From beautiful hotels and carefully planned journeys to
              experiences that take you outside your comfort zone, Hikinhigh
              brings the pieces of your next escape together.
            </p>

            <a href="/about" className="text-link">
              Discover Hikinhigh <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          DESTINATIONS
      ===================================================== */}

      <section id="destinations" className="section">
        <div className="content-width">
          <SectionHeading
            eyebrow="Destinations"
            title="Go somewhere worth remembering."
            action="View all destinations"
            actionHref="/destinations"
          />

          <div className="destination-grid">
            {destinations.map((destination, index) => (
              <a
                href="/destinations"
                key={destination.name}
                className={`destination-card ${
                  index % 2 === 1 ? "destination-offset" : ""
                }`}
              >
                <img src={destination.image} alt={destination.name} />

                <div className="destination-overlay" />

                <div className="destination-content">
                  <span>{destination.country}</span>

                  <h3>{destination.name}</h3>

                  <div className="destination-arrow">↗</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section id="hotels" className="dark-section">
        <div className="content-width">
          <SectionHeading
            dark
            eyebrow="Everything in one place"
            title="Plan the journey. We handle the details."
          />

          <div className="service-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                number={service.number}
                title={service.title}
                text={service.text}
                image={service.image}
                href={service.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PACKAGES
      ===================================================== */}

      <section id="packages" className="section package-section">
        <div className="content-width">
          <SectionHeading
            eyebrow="Curated journeys"
            title="Trips made for the way you want to travel."
            action="View all packages"
            actionHref="/packages"
          />

          <div className="home-package-grid">
            {packages.map((pkg, index) => (
              <a
                href="/packages"
                key={pkg.title}
                className={`home-package-card ${
                  index === 0 ? "home-package-card-featured" : ""
                }`}
                aria-label={`View ${pkg.title}`}
              >
                <div className="home-package-image">
                  <img src={pkg.image} alt={pkg.title} />

                  <span className="home-package-label">
                    {index === 0 ? "Featured journey" : pkg.location.split(" · ")[0]}
                  </span>

                  <div className="home-package-image-bottom">
                    <span>{pkg.location}</span>

                    <h3>{pkg.title}</h3>
                  </div>
                </div>

                <div className="home-package-details">
                  <div className="home-package-duration">
                    <span className="home-package-meta-label">Duration</span>
                    <strong>{pkg.duration}</strong>
                  </div>

                  <div className="home-package-price">
                    <span className="home-package-meta-label">Starting from</span>
                    <strong>{pkg.price}</strong>
                  </div>

                  <span className="home-package-view">
                    View journey <span>↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ADVENTURES
      ===================================================== */}

      <section id="adventures" className="adventure-section">
        <div className="content-width">
          <div className="adventure-heading">
            <div>
              <span className="eyebrow eyebrow-light">
                Adventure collection
              </span>

              <h2>
                Leave room for a
                <em> little wild.</em>
              </h2>
            </div>

            <p>
              Add something unforgettable to your itinerary with experiences
              designed for curious travellers.
            </p>
          </div>

          <div className="adventure-grid">
            {adventures.map((adventure) => (
              <a
                href="/adventures"
                key={adventure.title}
                className="adventure-card"
              >
                <img src={adventure.image} alt={adventure.title} />

                <div className="adventure-overlay" />

                <div className="adventure-content">
                  <span>{adventure.category}</span>

                  <h3>{adventure.title}</h3>

                  <div>Explore →</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY US
      ===================================================== */}

      <section className="section">
        <div className="content-width why-grid">
          <div>
            <span className="eyebrow">Why Hikinhigh</span>

            <h2 className="large-heading">
              Less planning.
              <em> More living.</em>
            </h2>

            <p className="why-description">
              A travel platform built around the things that actually matter:
              great places, straightforward booking and experiences worth
              talking about afterwards.
            </p>
          </div>

          <div className="benefit-grid">
            <Benefit
              number="01"
              title="Curated"
              text="Travel options selected with quality and experience in mind."
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

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="cta-section">
        <div className="cta-image">
          <img src="/images/cta-travel.jpg" alt="Travel landscape" />
        </div>

        <div className="cta-overlay" />

        <div className="cta-content">
          <span>YOUR NEXT JOURNEY</span>

          <h2>
            Somewhere
            <em> is waiting.</em>
          </h2>

          <p>
            Create your account and start discovering hotels, journeys and
            adventures.
          </p>

          <a href="/register" className="primary-button">
            Start exploring
          </a>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">
        <div className="content-width">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="/" className="brand brand-footer">
                <span className="brand-mark">H</span>

                <span className="brand-copy">
                  <strong>hikinhigh</strong>
                  <small>travels</small>
                </span>
              </a>

              <p>
                Beautiful stays, unforgettable journeys and experiences worth
                travelling for.
              </p>
            </div>

            <FooterColumn
              title="Explore"
              links={[
                ["Destinations", "/destinations"],
                ["Hotels", "/hotels"],
                ["Tour Packages", "/packages"],
                ["Adventures", "/adventures"],
              ]}
            />

            <FooterColumn
              title="Company"
              links={[
                ["About Us", "/about"],
                ["Contact", "/contact"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms & Conditions", "/terms-conditions"],
              ]}
            />

            <div>
              <h4>Contact</h4>

              <p className="footer-contact">
                hello@hikinhightravels.com
              </p>

              <p className="footer-contact">
                +91 00000 00000
              </p>

              <div className="social-links">
                <a href="#" aria-label="Instagram">
                  IG
                </a>

                <a href="#" aria-label="Facebook">
                  FB
                </a>

                <a href="#" aria-label="LinkedIn">
                  IN
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Hikinhigh Travels</span>

            <span>Travel further. Experience more.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function BookingField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <button type="button" className="booking-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </button>
  );
}

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
        dark ? "section-heading-dark" : ""
      }`}
    >
      <div>
        <span className="eyebrow">{eyebrow}</span>

        <h2>{title}</h2>
      </div>

      {action && actionHref && (
        <a href={actionHref} className="heading-action">
          {action} <span>→</span>
        </a>
      )}
    </div>
  );
}

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
    <a href={href} className="service-card">
      <img src={image} alt={title} />

      <div className="service-image-overlay" />

      <div className="service-top">
        <span className="service-number">{number}</span>

        <span className="service-arrow">↗</span>
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

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[][];
}) {
  return (
    <div>
      <h4>{title}</h4>

      <div className="footer-links">
        {links.map(([label, href]) => (
          <a href={href} key={label}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}