import Link from "next/link";

const sections = [
  {
    id: "about",
    number: "01",
    title: "About These Terms",
    content: (
      <>
        <p>
          These Terms &amp; Conditions govern your use of the Hikinhigh
          Travels website and the travel-related services, information and
          experiences made available through it.
        </p>

        <p>
          By using the website, you acknowledge that you have read and
          understood these terms and agree to comply with them.
        </p>
      </>
    ),
  },
  {
    id: "services",
    number: "02",
    title: "Our Services",
    content: (
      <>
        <p>
          Hikinhigh Travels provides information and services relating to
          destinations, accommodation, tour packages and adventure
          experiences.
        </p>

        <p>
          Availability, pricing, itineraries and other service details may
          change from time to time. Specific terms may also apply to
          individual bookings or services.
        </p>
      </>
    ),
  },
  {
    id: "bookings",
    number: "03",
    title: "Bookings",
    content: (
      <>
        <p>
          A booking request does not necessarily constitute a confirmed
          booking. Confirmation may depend on availability, payment
          requirements and acceptance of the relevant booking terms.
        </p>

        <p>
          You are responsible for providing accurate information when making
          an enquiry or booking, including names, contact information, travel
          dates and other details requested during the booking process.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    number: "04",
    title: "Pricing & Payments",
    content: (
      <>
        <p>
          Prices displayed on the website may be subject to change unless a
          price has been expressly confirmed for a specific booking.
        </p>

        <p>
          Additional charges may apply depending on the selected
          accommodation, activities, transportation, meals, taxes or other
          services.
        </p>

        <p>
          Where payments are processed through a third-party payment
          provider, the provider&apos;s own terms may also apply.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    number: "05",
    title: "Changes & Cancellations",
    content: (
      <>
        <p>
          Cancellation, modification and refund conditions may differ
          depending on the specific hotel, package, activity or booking
          partner involved.
        </p>

        <p>
          Before making a payment, travellers should review the cancellation
          and modification conditions applicable to their booking.
        </p>
      </>
    ),
  },
  {
    id: "documents",
    number: "06",
    title: "Travel Documents & Requirements",
    content: (
      <>
        <p>
          Travellers are responsible for ensuring that they have valid
          identification, travel documents, permits, visas, insurance and any
          other documents required for their journey.
        </p>

        <p>
          Requirements may vary according to the destination and nature of the
          travel service.
        </p>
      </>
    ),
  },
  {
    id: "adventure",
    number: "07",
    title: "Adventure Activities",
    content: (
      <>
        <p>
          Adventure activities may involve inherent risks associated with
          weather, terrain, altitude, water conditions, transportation and
          other environmental factors.
        </p>

        <p>
          Participants are expected to follow safety instructions provided by
          activity operators and guides and to disclose relevant information
          when reasonably required for participation.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    number: "08",
    title: "Third-Party Providers",
    content: (
      <>
        <p>
          Some travel services may be provided by independent hotels,
          transport operators, guides, activity providers or other third
          parties.
        </p>

        <p>
          Their own terms, conditions, safety requirements and cancellation
          policies may apply to the services they provide.
        </p>
      </>
    ),
  },
  {
    id: "website",
    number: "09",
    title: "Website Use",
    content: (
      <>
        <p>
          You agree not to misuse the website, interfere with its operation,
          attempt unauthorised access, introduce malicious code or use the
          website for unlawful purposes.
        </p>

        <p>
          Website content is provided for general information and may be
          updated or changed without prior notice.
        </p>
      </>
    ),
  },
  {
    id: "intellectual",
    number: "10",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          Unless otherwise stated, content appearing on the Hikinhigh Travels
          website, including text, graphics, branding, design and original
          materials, is intended for use in connection with the website and
          may not be reproduced or commercially exploited without appropriate
          permission.
        </p>
      </>
    ),
  },
  {
    id: "responsibility",
    number: "11",
    title: "Limitation of Responsibility",
    content: (
      <>
        <p>
          Travel involves circumstances that may be outside our control,
          including weather, natural events, transportation disruptions,
          government restrictions and actions of independent service providers.
        </p>

        <p>
          Nothing in these terms is intended to exclude or limit any liability
          that cannot lawfully be excluded or limited under applicable law.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "12",
    title: "Changes to These Terms",
    content: (
      <>
        <p>
          We may update these Terms &amp; Conditions from time to time. The
          latest version published on this page will apply to future use of
          the website unless otherwise stated.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    number: "13",
    title: "Contact Us",
    content: (
      <>
        <p>
          Questions about these Terms &amp; Conditions can be sent through our
          contact details or by using the Contact page on the Hikinhigh Travels
          website.
        </p>

        <div className="hht-contact-box">
          <strong>Hikinhigh</strong>
          <span>info@hikinhigh.com</span>
          <span>+91 999-060-1105</span>
        </div>
      </>
    ),
  },
];

export default function TermsConditionsPage() {
  return (
    <main className="hht-page">
      <style>{`
        /* =========================================================
           HIKINHIGH TERMS & CONDITIONS
           COMPLETE SELF-CONTAINED DESIGN
        ========================================================= */

        .hht-page {
          --cream: #f4f1e9;
          --green: #103d31;
          --deep-green: #082c23;
          --gold: #d0a95d;
          --text: #596760;
          --line: rgba(16, 61, 49, 0.15);

          min-height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;

          background: var(--cream);
          color: var(--green);

          overflow-x: hidden;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .hht-page *,
        .hht-page *::before,
        .hht-page *::after {
          box-sizing: border-box;
        }

        .hht-page a {
          color: inherit;
        }

        /* =========================================================
           HERO
        ========================================================= */

        .hht-hero {
          position: relative;

          min-height: 720px;

          background-image:
            linear-gradient(
              90deg,
              rgba(7, 25, 21, 0.72) 0%,
              rgba(7, 25, 21, 0.42) 48%,
              rgba(7, 25, 21, 0.18) 100%
            ),
            url("/images/hero-kashmir.jpg");

          background-size: cover;
          background-position: center;

          color: #ffffff;

          overflow: hidden;
        }

        .hht-hero::after {
          content: "";

          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.18) 0%,
              transparent 28%,
              rgba(0, 0, 0, 0.12) 100%
            );

          pointer-events: none;
        }

        /* =========================================================
           HEADER — SAME AS PRIVACY PAGE / HOMEPAGE STYLE
        ========================================================= */

        .hht-header {
          position: absolute;
          z-index: 20;

          top: 0;
          left: 0;

          width: 100%;
          height: 108px;

          background: transparent;

          color: #ffffff;
        }

        .hht-header-inner {
          width: 100%;
          height: 100%;

          padding: 0 50px;

          display: grid;
          grid-template-columns: 300px 1fr 300px;
          align-items: center;
        }

        /* =========================================================
           LOGO
        ========================================================= */

        .hht-brand {
          display: inline-flex;
          align-items: center;
          gap: 15px;

          width: fit-content;

          color: #ffffff;
          text-decoration: none;
        }

        .hht-brand-mark {
          width: 49px;
          height: 49px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255,255,255,0.55);
          border-radius: 50%;

          color: #ffffff;

          font-size: 20px;
          font-weight: 800;

          line-height: 1;
        }

        .hht-brand-copy {
          display: flex;
          flex-direction: column;

          line-height: 1;
        }

        .hht-brand-copy strong {
          color: #ffffff;

          font-size: 23px;
          font-weight: 800;

          letter-spacing: -0.04em;
        }

        .hht-brand-copy small {
          margin-top: 7px;

          color: rgba(255,255,255,0.72);

          font-size: 8px;
          font-weight: 700;

          letter-spacing: 0.38em;

          text-transform: uppercase;
        }

        /* =========================================================
           NAV
        ========================================================= */

        .hht-nav {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 40px;
        }

        .hht-nav a {
          position: relative;

          color: rgba(255,255,255,0.92);

          text-decoration: none;

          font-size: 14px;
          font-weight: 650;

          transition:
            color 0.2s ease,
            opacity 0.2s ease;
        }

        .hht-nav a::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: -8px;

          width: 0;
          height: 1px;

          background: #ffffff;

          transition: width 0.25s ease;
        }

        .hht-nav a:hover {
          color: #ffffff;
        }

        .hht-nav a:hover::after {
          width: 100%;
        }

        /* =========================================================
           ACTIONS
        ========================================================= */

        .hht-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: 25px;
        }

        .hht-login {
          color: #ffffff;

          text-decoration: none;

          font-size: 14px;
          font-weight: 700;

          transition: opacity 0.2s ease;
        }

        .hht-login:hover {
          opacity: 0.65;
        }

        .hht-join {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-width: 126px;
          height: 58px;

          padding: 0 25px;

          background: var(--green);
          border: 1px solid var(--green);

          color: #ffffff !important;

          text-decoration: none;

          font-size: 12px;
          font-weight: 800;

          letter-spacing: 0.04em;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .hht-join:hover {
          background: #ffffff;
          color: var(--green) !important;

          transform: translateY(-2px);
        }

        /* =========================================================
           HERO CONTENT
        ========================================================= */

        .hht-hero-content {
          position: relative;
          z-index: 5;

          width: min(100% - 160px, 1520px);

          min-height: 720px;

          margin: 0 auto;

          padding-top: 265px;

          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .hht-eyebrow {
          display: inline-flex;
          align-items: center;

          gap: 13px;

          width: fit-content;

          color: #ffffff;

          font-size: 11px;
          font-weight: 800;

          letter-spacing: 0.25em;

          text-transform: uppercase;
        }

        .hht-eyebrow::before {
          content: "";

          width: 35px;
          height: 1px;

          background: var(--gold);
        }

        .hht-hero h1 {
          max-width: 950px;

          margin: 27px 0 0;

          color: #ffffff;

          font-size: clamp(68px, 7.6vw, 126px);

          font-weight: 800;

          line-height: 0.82;

          letter-spacing: -0.075em;
        }

        .hht-hero h1 em {
          display: block;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 1.03em;

          font-weight: 400;

          font-style: italic;

          letter-spacing: -0.065em;
        }

        .hht-hero-description {
          max-width: 700px;

          margin: 42px 0 0;

          color: rgba(255,255,255,0.78);

          font-size: 16px;

          line-height: 1.8;
        }

        .hht-hero-meta {
          display: flex;

          gap: 30px;

          margin-top: 45px;

          color: rgba(255,255,255,0.62);

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 0.16em;

          text-transform: uppercase;
        }

        /* =========================================================
           CONTENT
        ========================================================= */

        .hht-content {
          width: min(1180px, calc(100% - 48px));

          margin: 0 auto;

          padding: 120px 0 145px;
        }

        .hht-content-grid {
          display: grid;

          grid-template-columns: 220px minmax(0, 760px);

          justify-content: space-between;

          gap: 80px;
        }

        .hht-sidebar {
          position: sticky;

          top: 35px;

          align-self: start;
        }

        .hht-sidebar-label {
          display: block;

          margin-bottom: 20px;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.25em;

          text-transform: uppercase;
        }

        .hht-sidebar a {
          display: block;

          padding: 10px 0;

          color: #68746e;

          border-bottom: 1px solid var(--line);

          font-size: 12px;

          line-height: 1.4;

          text-decoration: none;

          transition:
            color 0.2s ease,
            padding-left 0.2s ease;
        }

        .hht-sidebar a:hover {
          padding-left: 5px;

          color: var(--green);
        }

        .hht-section {
          scroll-margin-top: 40px;

          padding-bottom: 68px;

          margin-bottom: 68px;

          border-bottom: 1px solid var(--line);
        }

        .hht-section:last-child {
          margin-bottom: 0;

          border-bottom: 0;
        }

        .hht-section-heading {
          display: grid;

          grid-template-columns: 55px 1fr;

          gap: 24px;
        }

        .hht-section-number {
          padding-top: 8px;

          color: var(--gold);

          font-size: 11px;
          font-weight: 800;

          letter-spacing: 0.15em;
        }

        .hht-section h2 {
          margin: 0;

          font-size: clamp(34px, 4vw, 48px);

          font-weight: 800;

          line-height: 0.98;

          letter-spacing: -0.045em;
        }

        .hht-section-copy {
          margin-left: 79px;

          margin-top: 28px;
        }

        .hht-section-copy p {
          margin: 0 0 20px;

          color: var(--text);

          font-size: 15px;

          line-height: 1.9;
        }

        .hht-section-copy p:last-child {
          margin-bottom: 0;
        }

        .hht-contact-box {
          display: flex;
          flex-direction: column;

          gap: 8px;

          margin-top: 30px;

          padding: 26px 28px;

          background: rgba(16,61,49,0.055);

          border-left: 2px solid var(--gold);

          color: var(--green);

          font-size: 14px;

          line-height: 1.6;
        }

        .hht-contact-box strong {
          font-size: 16px;
        }

        /* =========================================================
           CTA
        ========================================================= */

        .hht-final {
          background: var(--green);

          color: #ffffff;
        }

        .hht-final-inner {
          width: min(1180px, calc(100% - 48px));

          min-height: 450px;

          margin: 0 auto;

          padding: 90px 0;

          display: flex;

          flex-direction: column;

          justify-content: center;
        }

        .hht-final-label {
          color: var(--gold);

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.3em;

          text-transform: uppercase;
        }

        .hht-final h2 {
          max-width: 700px;

          margin: 25px 0 0;

          color: #ffffff;

          font-size: clamp(55px, 7vw, 94px);

          font-weight: 800;

          line-height: 0.9;

          letter-spacing: -0.065em;
        }

        .hht-final h2 em {
          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-weight: 400;

          font-style: italic;
        }

        .hht-final p {
          max-width: 580px;

          margin: 30px 0 0;

          color: rgba(255,255,255,0.68);

          font-size: 15px;

          line-height: 1.8;
        }

        .hht-final-button {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          width: fit-content;

          margin-top: 32px;

          padding: 15px 24px;

          background: #ffffff;

          color: var(--green) !important;

          text-decoration: none;

          font-size: 11px;

          font-weight: 800;

          letter-spacing: 0.08em;

          text-transform: uppercase;
        }

        .hht-final-button:hover {
          background: var(--gold);

          color: var(--deep-green) !important;
        }

        /* =========================================================
           FOOTER
        ========================================================= */

        .hht-footer {
          background: #071f19;

          color: #ffffff;
        }

        .hht-footer-inner {
          width: min(1180px, calc(100% - 48px));

          margin: 0 auto;

          padding: 75px 0 0;
        }

        .hht-footer-grid {
          display: grid;

          grid-template-columns:
            1.6fr
            1fr
            1fr
            1.1fr;

          gap: 55px;
        }

        .hht-footer-brand strong {
          display: block;

          font-size: 25px;

          font-weight: 800;

          letter-spacing: 0.16em;
        }

        .hht-footer-brand small {
          display: block;

          margin-top: 8px;

          color: rgba(255,255,255,0.45);

          font-size: 8px;

          letter-spacing: 0.48em;

          text-transform: uppercase;
        }

        .hht-footer-brand p {
          max-width: 280px;

          margin-top: 25px;

          color: rgba(255,255,255,0.5);

          font-size: 13px;

          line-height: 1.8;
        }

        .hht-footer-column h4,
        .hht-footer-contact h4 {
          margin: 0 0 20px;

          color: var(--gold);

          font-size: 10px;

          letter-spacing: 0.25em;

          text-transform: uppercase;
        }

        .hht-footer-column a {
          display: block;

          margin-bottom: 12px;

          color: rgba(255,255,255,0.62);

          font-size: 13px;

          text-decoration: none;
        }

        .hht-footer-column a:hover {
          color: #ffffff;
        }

        .hht-footer-contact p {
          margin: 0 0 10px;

          color: rgba(255,255,255,0.62);

          font-size: 13px;
        }

        .hht-footer-bottom {
          display: flex;

          justify-content: space-between;

          margin-top: 65px;

          padding: 20px 0 24px;

          border-top: 1px solid rgba(255,255,255,0.1);

          color: rgba(255,255,255,0.35);

          font-size: 10px;
        }

        /* =========================================================
           TABLET
        ========================================================= */

        @media (max-width: 1100px) {
          .hht-header-inner {
            grid-template-columns: 230px 1fr 230px;

            padding: 0 35px;
          }

          .hht-nav {
            gap: 25px;
          }

          .hht-hero-content {
            width: calc(100% - 80px);
          }

          .hht-footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr;
          }
        }

        /* =========================================================
           MOBILE
        ========================================================= */

        @media (max-width: 850px) {
          .hht-header {
            height: 82px;
          }

          .hht-header-inner {
            display: flex;

            justify-content: space-between;

            padding: 0 25px;
          }

          .hht-nav,
          .hht-actions {
            display: none;
          }

          .hht-brand-mark {
            width: 43px;
            height: 43px;
          }

          .hht-brand-copy strong {
            font-size: 20px;
          }

          .hht-hero {
            min-height: 600px;

            background-position: 62% center;
          }

          .hht-hero-content {
            width: calc(100% - 40px);

            min-height: 600px;

            padding-top: 205px;
          }

          .hht-hero h1 {
            font-size: clamp(58px, 16vw, 86px);
          }

          .hht-hero-description {
            max-width: 100%;

            margin-top: 30px;

            font-size: 14px;
          }

          .hht-content-grid {
            grid-template-columns: 1fr;

            gap: 40px;
          }

          .hht-sidebar {
            display: none;
          }

          .hht-section-copy {
            margin-left: 0;
          }

          .hht-footer-grid {
            grid-template-columns: 1fr 1fr;
          }

          .hht-footer-brand {
            grid-column: 1 / -1;
          }

          .hht-footer-contact {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .hht-content {
            width: calc(100% - 40px);

            padding: 80px 0 100px;
          }

          .hht-section {
            padding-bottom: 48px;

            margin-bottom: 48px;
          }

          .hht-section-heading {
            grid-template-columns: 40px 1fr;

            gap: 12px;
          }

          .hht-section h2 {
            font-size: 32px;
          }

          .hht-section-copy {
            margin-top: 22px;
          }

          .hht-section-copy p {
            font-size: 13px;
          }

          .hht-final-inner {
            width: calc(100% - 40px);

            min-height: 420px;
          }

          .hht-final h2 {
            font-size: 55px;
          }

          .hht-footer-inner {
            width: calc(100% - 40px);
          }

          .hht-footer-grid {
            grid-template-columns: 1fr;
          }

          .hht-footer-brand,
          .hht-footer-contact {
            grid-column: auto;
          }

          .hht-footer-bottom {
            flex-direction: column;

            gap: 8px;

            align-items: flex-start;
          }
        }

        @media (max-width: 420px) {
          .hht-brand-copy strong {
            font-size: 18px;
          }

          .hht-brand-copy small {
            font-size: 7px;
          }

          .hht-hero h1 {
            font-size: 54px;
          }

          .hht-section-heading {
            display: block;
          }

          .hht-section-number {
            display: block;

            margin-bottom: 12px;
          }
        }
      `}</style>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="hht-hero">

        {/* =======================================================
            HEADER
        ======================================================= */}

        <header className="hht-header">
          <div className="hht-header-inner">

            <Link href="/" className="hht-brand">
              <span className="hht-brand-mark">
                H
              </span>

              <span className="hht-brand-copy">
                <strong>hikinhigh</strong>
                <small>travels</small>
              </span>
            </Link>

            <nav className="hht-nav">
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

              <Link href="/about">
                About
              </Link>
            </nav>

            <div className="hht-actions">
              <Link
                href="/login"
                className="hht-login"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="hht-join"
              >
                Join us
              </Link>
            </div>

          </div>
        </header>

        {/* =======================================================
            HERO CONTENT
        ======================================================= */}

        <div className="hht-hero-content">

          <span className="hht-eyebrow">
            LEGAL
          </span>

          <h1>
            Terms &amp;
            <em>Conditions.</em>
          </h1>

          <p className="hht-hero-description">
            The terms that apply when using the Hikinhigh Travels website
            and travel services.
          </p>

          <div className="hht-hero-meta">
            <span>
              Hikinhigh Travels
            </span>

            <span>
              Terms &amp; Conditions
            </span>
          </div>

        </div>

      </section>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <section className="hht-content">
        <div className="hht-content-grid">

          <aside className="hht-sidebar">
            <span className="hht-sidebar-label">
              On this page
            </span>

            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
              >
                {section.number} &nbsp; {section.title}
              </a>
            ))}
          </aside>

          <div>
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="hht-section"
              >
                <div className="hht-section-heading">

                  <span className="hht-section-number">
                    {section.number}
                  </span>

                  <h2>
                    {section.title}
                  </h2>

                </div>

                <div className="hht-section-copy">
                  {section.content}
                </div>

              </article>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="hht-final">
        <div className="hht-final-inner">

          <span className="hht-final-label">
            READY TO TRAVEL?
          </span>

          <h2>
            Start your
            <br />
            <em>journey.</em>
          </h2>

          <p>
            Explore destinations, discover memorable stays and find your
            next experience with Hikinhigh Travels.
          </p>

          <Link
            href="/destinations"
            className="hht-final-button"
          >
            Explore Destinations →
          </Link>

        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="hht-footer">
        <div className="hht-footer-inner">

          <div className="hht-footer-grid">

            <div className="hht-footer-brand">
              <Link href="/">
                <strong>
                  HIKINHIGH
                </strong>

                <small>
                  TRAVELS
                </small>
              </Link>

              <p>
                Beautiful stays, unforgettable journeys and experiences
                worth travelling for.
              </p>
            </div>

            <div className="hht-footer-column">
              <h4>
                Explore
              </h4>

              <Link href="/destinations">
                Destinations
              </Link>

              <Link href="/hotels">
                Hotels
              </Link>

              <Link href="/packages">
                Tour Packages
              </Link>

              <Link href="/adventures">
                Adventures
              </Link>
            </div>

            <div className="hht-footer-column">
              <h4>
                Company
              </h4>

              <Link href="/about">
                About Us
              </Link>

              <Link href="/contact">
                Contact
              </Link>

              <Link href="/privacy-policy">
                Privacy Policy
              </Link>

              <Link href="/terms-conditions">
                Terms &amp; Conditions
              </Link>
            </div>

            <div className="hht-footer-contact">
              <h4>
                Contact
              </h4>

              <p>
                hello@hikinhigh.com
              </p>

              <p>
                +91 999-060-1105
              </p>
            </div>

          </div>

          <div className="hht-footer-bottom">
            <span>
              © {new Date().getFullYear()} Hikinhigh Travels
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