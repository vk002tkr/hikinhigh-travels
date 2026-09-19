import Link from "next/link";
import Header from "../../components/layout/Header";

function Footer() {
  return (
    <footer className="footer">
      <div className="content-width">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand brand-footer">
              <span className="brand-mark">H</span>

              <span className="brand-copy">
                <strong>hikinhigh</strong>
                <small>travels</small>
              </span>
            </Link>

            <p>
              Beautiful stays, unforgettable journeys and experiences worth
              travelling for.
            </p>
          </div>

          <div>
            <h4>Explore</h4>

            <div className="footer-links">
              <Link href="/destinations">Destinations</Link>
              <Link href="/hotels">Hotels</Link>
              <Link href="/packages">Tour Packages</Link>
              <Link href="/adventures">Adventures</Link>
            </div>
          </div>

          <div>
            <h4>Company</h4>

            <div className="footer-links">
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-conditions">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>

          <div>
            <h4>Contact</h4>

            <p className="footer-contact">
              info@hikinhightravels.com
            </p>

            <p className="footer-contact">
              +91 999-060-1105
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
          <span>
            © {new Date().getFullYear()} Hikinhigh Travels
          </span>

          <span>
            Travel further. Experience more.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* =========================================
          HEADER
      ========================================= */}

      <Header />

      {/* =========================================
          HERO
      ========================================= */}

      <section className="about-hero">
        <div className="about-hero-image" />

        <div className="about-hero-overlay" />

        <div className="about-hero-content">
          <span className="about-eyebrow">ABOUT HIKINHIGH</span>

          <h1>
            Travel beyond
            <em> the itinerary.</em>
          </h1>

          <p>
            We create journeys that bring together beautiful places,
            comfortable stays and experiences worth remembering.
          </p>
        </div>

        <div className="about-hero-bottom">
          <span>HIKINHIGH TRAVELS</span>

          <span>EST. 2026</span>
        </div>
      </section>

      {/* =========================================
          INTRO
      ========================================= */}

      <section className="about-intro">
        <div className="about-container about-intro-grid">
          <div>
            <span className="about-eyebrow about-eyebrow-green">
              THE IDEA
            </span>

            <h2>
              A better way
              <br />
              to <em>travel.</em>
            </h2>
          </div>

          <div className="about-intro-copy">
            <p className="about-large-copy">
              Hikinhigh Travels was created with a simple thought: planning a
              trip should feel exciting, not exhausting.
            </p>

            <p>
              From finding the right hotel to choosing the perfect itinerary
              and adding an unforgettable adventure, we bring the essential
              pieces of travel together in one place.
            </p>

            <p>
              Whether you are planning a quiet escape, a family holiday, a
              mountain adventure or a completely new experience, Hikinhigh is
              built to help you discover it.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          IMAGE STATEMENT
      ========================================= */}

      <section className="about-image-section">
        <div className="about-container">
          <div className="about-image-frame">
            <img
              src="/images/hero-kashmir.jpg"
              alt="Mountain landscape"
            />

            <div className="about-image-caption">
              <span>01</span>

              <p>
                The best journeys are the ones that stay with you long after
                you return home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          WHAT WE DO
      ========================================= */}

      <section className="about-services">
        <div className="about-container">
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow about-eyebrow-green">
                WHAT WE DO
              </span>

              <h2>
                Everything you need
                <br />
                for the <em>journey.</em>
              </h2>
            </div>

            <p>
              One platform for discovering destinations, finding places to
              stay and creating experiences around the way you want to travel.
            </p>
          </div>

          <div className="about-service-list">
            <Link href="/hotels" className="about-service-row">
              <span className="about-service-number">01</span>

              <div className="about-service-main">
                <h3>Hotels &amp; Stays</h3>

                <p>
                  From comfortable family hotels to distinctive boutique
                  stays, find a place that fits your journey.
                </p>
              </div>

              <span className="about-service-arrow">↗</span>
            </Link>

            <Link href="/packages" className="about-service-row">
              <span className="about-service-number">02</span>

              <div className="about-service-main">
                <h3>Tour Packages</h3>

                <p>
                  Carefully planned itineraries combining destinations,
                  accommodation and experiences.
                </p>
              </div>

              <span className="about-service-arrow">↗</span>
            </Link>

            <Link href="/adventures" className="about-service-row">
              <span className="about-service-number">03</span>

              <div className="about-service-main">
                <h3>Adventure Activities</h3>

                <p>
                  Trekking, rafting, camping and experiences for travellers
                  who want to go beyond sightseeing.
                </p>
              </div>

              <span className="about-service-arrow">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          PHILOSOPHY
      ========================================= */}

      <section className="about-philosophy">
        <div className="about-container about-philosophy-grid">
          <div>
            <span className="about-eyebrow about-eyebrow-light">
              OUR PHILOSOPHY
            </span>

            <h2>
              Go with curiosity.
              <br />
              Come back with
              <em> stories.</em>
            </h2>
          </div>

          <div className="about-philosophy-copy">
            <p>
              We believe travel is more than moving from one destination to
              another.
            </p>

            <p>
              It is the morning view from a mountain hotel. The road that was
              not on the original plan. A conversation with someone you would
              never have met at home. The first taste of a local dish. The
              feeling of standing somewhere completely new.
            </p>

            <p>
              That is the kind of travel we want Hikinhigh to help people
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          VALUES
      ========================================= */}

      <section className="about-values">
        <div className="about-container">
          <div className="about-section-heading about-values-heading">
            <div>
              <span className="about-eyebrow about-eyebrow-green">
                WHAT MATTERS TO US
              </span>

              <h2>
                Built around the
                <br />
                traveller.
              </h2>
            </div>
          </div>

          <div className="about-values-grid">
            <article>
              <span>01</span>

              <h3>Discovery</h3>

              <p>
                We want travellers to discover places they may not have
                considered before.
              </p>
            </article>

            <article>
              <span>02</span>

              <h3>Clarity</h3>

              <p>
                Travel planning should be straightforward, transparent and
                easy to understand.
              </p>
            </article>

            <article>
              <span>03</span>

              <h3>Experience</h3>

              <p>
                A destination becomes memorable through the experiences you
                have there.
              </p>
            </article>

            <article>
              <span>04</span>

              <h3>People</h3>

              <p>
                Every journey is personal. The platform should adapt to the
                traveller, not the other way around.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================
          CTA
      ========================================= */}

      <section className="about-final-cta">
        <div className="about-final-image" />

        <div className="about-final-overlay" />

        <div className="about-container about-final-content">
          <span className="about-eyebrow about-eyebrow-light">
            YOUR JOURNEY STARTS HERE
          </span>

          <h2>
            There is always
            <br />
            somewhere
            <em> new.</em>
          </h2>

          <p>
            Explore destinations, discover places to stay and start planning
            your next journey with Hikinhigh Travels.
          </p>

          <div className="about-final-buttons">
            <Link
              href="/destinations"
              className="about-button-primary"
            >
              Explore destinations
            </Link>

            <Link
              href="/packages"
              className="about-button-secondary"
            >
              View tour packages
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          FOOTER
      ========================================= */}

      <Footer />
    </main>
  );
}