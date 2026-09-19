import Link from "next/link";

const sections = [
  {
    id: "information",
    number: "01",
    title: "Information We Collect",
    content: (
      <>
        <p>
          When you use Hikinhigh Travels, we may collect information that you
          provide directly to us and information generated through your use of
          our website and services.
        </p>

        <p>
          This may include your name, email address, phone number, account
          details, booking information, travel preferences, payment-related
          information, and other details that you choose to provide.
        </p>

        <p>
          We may also collect technical information such as your browser type,
          device information, IP address, pages visited, and general usage
          information to help us operate and improve the website.
        </p>
      </>
    ),
  },
  {
    id: "use",
    number: "02",
    title: "How We Use Your Information",
    content: (
      <>
        <p>
          Information collected through Hikinhigh Travels may be used to
          provide, maintain, and improve our services and to help you plan and
          manage your travel.
        </p>

        <p>
          We may use your information to process bookings, communicate with
          you about enquiries or reservations, provide customer support,
          maintain your account, improve our website, and provide information
          about services that may be relevant to your interaction with us.
        </p>

        <p>
          We may also use information for security, fraud prevention,
          troubleshooting, analytics, and compliance with applicable legal
          obligations.
        </p>
      </>
    ),
  },
  {
    id: "bookings",
    number: "03",
    title: "Bookings & Payments",
    content: (
      <>
        <p>
          When you make a booking through Hikinhigh Travels, information
          necessary to complete and manage that booking may be collected and
          processed.
        </p>

        <p>
          Payment information may be processed through third-party payment
          service providers. Hikinhigh Travels does not intend to store
          complete payment card information on its own systems where payment
          processing is handled by an external payment provider.
        </p>

        <p>
          Additional terms may apply to individual hotels, tour packages,
          activities, or other travel services. Those terms may be presented
          during the booking process.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    number: "04",
    title: "Cookies & Similar Technologies",
    content: (
      <>
        <p>
          Hikinhigh Travels may use cookies and similar technologies to help
          the website function properly, remember preferences, understand
          website usage, and improve the overall user experience.
        </p>

        <p>
          Some cookies may be provided by third-party services used for
          analytics, security, payments, or other website functionality.
        </p>

        <p>
          Depending on your browser and device settings, you may be able to
          control or restrict cookies. Disabling certain cookies may affect
          some website functionality.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    number: "05",
    title: "Sharing of Information",
    content: (
      <>
        <p>
          We may share relevant information with service providers and
          partners when reasonably necessary to operate our website, process
          bookings, provide travel services, process payments, provide
          customer support, or perform other services on our behalf.
        </p>

        <p>
          Information may also be disclosed where required by applicable law,
          legal process, governmental authority, or where reasonably necessary
          to protect our rights, users, property, or security.
        </p>

        <p>
          We do not intend to sell your personal information as a commercial
          product.
        </p>
      </>
    ),
  },
  {
    id: "security",
    number: "06",
    title: "Data Security",
    content: (
      <>
        <p>
          We take reasonable measures designed to protect information handled
          through Hikinhigh Travels against unauthorized access, alteration,
          disclosure, or destruction.
        </p>

        <p>
          However, no internet transmission or electronic storage system can be
          guaranteed to be completely secure. You should therefore understand
          that information transmitted over the internet may carry inherent
          risks.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    number: "07",
    title: "Data Retention",
    content: (
      <>
        <p>
          We may retain information for as long as reasonably necessary for the
          purposes described in this policy, including providing services,
          maintaining business and transaction records, resolving disputes,
          enforcing agreements, and meeting legal or regulatory requirements.
        </p>

        <p>
          The length of time information is retained may vary depending on the
          nature of the information and the reason for which it was collected.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    number: "08",
    title: "Your Choices & Rights",
    content: (
      <>
        <p>
          Depending on applicable law, you may have rights relating to the
          personal information we hold about you. These may include requesting
          access to, correction of, or deletion of certain information.
        </p>

        <p>
          You may also contact us regarding certain communications or account
          information associated with your use of Hikinhigh Travels.
        </p>

        <p>
          Requests may be subject to verification and applicable legal
          requirements.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    number: "09",
    title: "Third-Party Websites & Services",
    content: (
      <>
        <p>
          Hikinhigh Travels may contain links to third-party websites,
          properties, payment services, booking services, maps, social
          platforms, or other external services.
        </p>

        <p>
          These third parties may have their own privacy policies and terms.
          We encourage you to review those policies before providing
          information directly to third-party services.
        </p>
      </>
    ),
  },
  {
    id: "children",
    number: "10",
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Hikinhigh Travels is intended for general travel and booking use. We
          do not knowingly seek to collect personal information from children
          in circumstances where such collection is prohibited by applicable
          law.
        </p>

        <p>
          If you believe that a child has provided personal information to us
          inappropriately, please contact us so that the matter can be
          reviewed.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "11",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect
          changes to our services, technology, business practices, or legal
          requirements.
        </p>

        <p>
          When changes are made, the updated version will be published on this
          page with a revised effective date where appropriate.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    number: "12",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy or how information is
          handled through Hikinhigh Travels, you can contact us using the
          details below.
        </p>

        <div className="hhp-contact-box">
          <strong>Hikinhigh Travels</strong>
          <span>hello@hikinhightravels.com</span>
          <span>+91 00000 00000</span>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="hhp-page">
      <style>{`
        /* =========================================================
           HIKINHIGH PRIVACY POLICY
           COMPLETE SELF-CONTAINED DESIGN
        ========================================================= */

        .hhp-page {
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

        .hhp-page *,
        .hhp-page *::before,
        .hhp-page *::after {
          box-sizing: border-box;
        }

        /* =========================================================
           HERO
        ========================================================= */

        .hhp-hero {
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

        .hhp-hero::after {
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
           HEADER — OVER HERO
        ========================================================= */

        .hhp-header {
          position: absolute;
          z-index: 20;

          top: 0;
          left: 0;

          width: 100%;
          height: 108px;

          background: transparent;

          color: #ffffff;
        }

        .hhp-header-inner {
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

        .hhp-brand {
          display: inline-flex;
          align-items: center;
          gap: 15px;

          width: fit-content;

          color: #ffffff;
          text-decoration: none;
        }

        .hhp-brand-mark {
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

        .hhp-brand-copy {
          display: flex;
          flex-direction: column;

          line-height: 1;
        }

        .hhp-brand-copy strong {
          color: #ffffff;

          font-size: 23px;
          font-weight: 800;

          letter-spacing: -0.04em;
        }

        .hhp-brand-copy small {
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

        .hhp-nav {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 40px;
        }

        .hhp-nav a {
          position: relative;

          color: rgba(255,255,255,0.92);

          text-decoration: none;

          font-size: 14px;
          font-weight: 650;

          transition:
            color 0.2s ease,
            opacity 0.2s ease;
        }

        .hhp-nav a::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: -8px;

          width: 0;
          height: 1px;

          background: #ffffff;

          transition: width 0.25s ease;
        }

        .hhp-nav a:hover {
          color: #ffffff;
        }

        .hhp-nav a:hover::after {
          width: 100%;
        }

        /* =========================================================
           HEADER ACTIONS
        ========================================================= */

        .hhp-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: 25px;
        }

        .hhp-login {
          color: #ffffff;

          text-decoration: none;

          font-size: 14px;
          font-weight: 700;

          transition: opacity 0.2s ease;
        }

        .hhp-login:hover {
          opacity: 0.65;
        }

        .hhp-join {
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

        .hhp-join:hover {
          background: #ffffff;
          color: var(--green) !important;

          transform: translateY(-2px);
        }

        /* =========================================================
           HERO CONTENT
        ========================================================= */

        .hhp-hero-content {
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

        .hhp-eyebrow {
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

        .hhp-eyebrow::before {
          content: "";

          width: 35px;
          height: 1px;

          background: var(--gold);
        }

        .hhp-hero h1 {
          max-width: 900px;

          margin: 27px 0 0;

          color: #ffffff;

          font-size: clamp(70px, 8vw, 132px);

          font-weight: 800;

          line-height: 0.82;

          letter-spacing: -0.075em;
        }

        .hhp-hero h1 em {
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

        .hhp-hero-description {
          max-width: 670px;

          margin: 42px 0 0;

          color: rgba(255,255,255,0.78);

          font-size: 16px;

          line-height: 1.8;
        }

        .hhp-hero-meta {
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

        .hhp-content {
          width: min(1180px, calc(100% - 48px));

          margin: 0 auto;

          padding: 120px 0 145px;
        }

        .hhp-content-grid {
          display: grid;

          grid-template-columns: 220px minmax(0, 760px);

          justify-content: space-between;

          gap: 80px;
        }

        .hhp-sidebar {
          position: sticky;

          top: 35px;

          align-self: start;
        }

        .hhp-sidebar-label {
          display: block;

          margin-bottom: 20px;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.25em;

          text-transform: uppercase;
        }

        .hhp-sidebar a {
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

        .hhp-sidebar a:hover {
          padding-left: 5px;

          color: var(--green);
        }

        .hhp-section {
          scroll-margin-top: 40px;

          padding-bottom: 68px;

          margin-bottom: 68px;

          border-bottom: 1px solid var(--line);
        }

        .hhp-section:last-child {
          margin-bottom: 0;

          border-bottom: 0;
        }

        .hhp-section-heading {
          display: grid;

          grid-template-columns: 55px 1fr;

          gap: 24px;
        }

        .hhp-section-number {
          padding-top: 8px;

          color: var(--gold);

          font-size: 11px;
          font-weight: 800;

          letter-spacing: 0.15em;
        }

        .hhp-section h2 {
          margin: 0;

          font-size: clamp(34px, 4vw, 48px);

          font-weight: 800;

          line-height: 0.98;

          letter-spacing: -0.045em;
        }

        .hhp-section-copy {
          margin-left: 79px;

          margin-top: 28px;
        }

        .hhp-section-copy p {
          margin: 0 0 20px;

          color: var(--text);

          font-size: 15px;

          line-height: 1.9;
        }

        .hhp-section-copy p:last-child {
          margin-bottom: 0;
        }

        .hhp-contact-box {
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

        .hhp-contact-box strong {
          font-size: 16px;
        }

        /* =========================================================
           CTA
        ========================================================= */

        .hhp-final {
          background: var(--green);

          color: #ffffff;
        }

        .hhp-final-inner {
          width: min(1180px, calc(100% - 48px));

          min-height: 450px;

          margin: 0 auto;

          padding: 90px 0;

          display: flex;

          flex-direction: column;

          justify-content: center;
        }

        .hhp-final-label {
          color: var(--gold);

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.3em;

          text-transform: uppercase;
        }

        .hhp-final h2 {
          max-width: 700px;

          margin: 25px 0 0;

          color: #ffffff;

          font-size: clamp(55px, 7vw, 94px);

          font-weight: 800;

          line-height: 0.9;

          letter-spacing: -0.065em;
        }

        .hhp-final h2 em {
          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-weight: 400;

          font-style: italic;
        }

        .hhp-final p {
          max-width: 580px;

          margin: 30px 0 0;

          color: rgba(255,255,255,0.68);

          font-size: 15px;

          line-height: 1.8;
        }

        .hhp-final-button {
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

        .hhp-final-button:hover {
          background: var(--gold);

          color: var(--deep-green) !important;
        }

        /* =========================================================
           FOOTER
        ========================================================= */

        .hhp-footer {
          background: #071f19;

          color: #ffffff;
        }

        .hhp-footer-inner {
          width: min(1180px, calc(100% - 48px));

          margin: 0 auto;

          padding: 75px 0 0;
        }

        .hhp-footer-grid {
          display: grid;

          grid-template-columns:
            1.6fr
            1fr
            1fr
            1.1fr;

          gap: 55px;
        }

        .hhp-footer-brand strong {
          display: block;

          font-size: 25px;

          font-weight: 800;

          letter-spacing: 0.16em;
        }

        .hhp-footer-brand small {
          display: block;

          margin-top: 8px;

          color: rgba(255,255,255,0.45);

          font-size: 8px;

          letter-spacing: 0.48em;

          text-transform: uppercase;
        }

        .hhp-footer-brand p {
          max-width: 280px;

          margin-top: 25px;

          color: rgba(255,255,255,0.5);

          font-size: 13px;

          line-height: 1.8;
        }

        .hhp-footer-column h4,
        .hhp-footer-contact h4 {
          margin: 0 0 20px;

          color: var(--gold);

          font-size: 10px;

          letter-spacing: 0.25em;

          text-transform: uppercase;
        }

        .hhp-footer-column a {
          display: block;

          margin-bottom: 12px;

          color: rgba(255,255,255,0.62);

          font-size: 13px;

          text-decoration: none;
        }

        .hhp-footer-column a:hover {
          color: #ffffff;
        }

        .hhp-footer-contact p {
          margin: 0 0 10px;

          color: rgba(255,255,255,0.62);

          font-size: 13px;
        }

        .hhp-footer-bottom {
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
          .hhp-header-inner {
            grid-template-columns: 230px 1fr 230px;

            padding: 0 35px;
          }

          .hhp-nav {
            gap: 25px;
          }

          .hhp-hero-content {
            width: calc(100% - 80px);
          }

          .hhp-footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr;
          }
        }

        /* =========================================================
           MOBILE
        ========================================================= */

        @media (max-width: 850px) {
          .hhp-header {
            height: 82px;
          }

          .hhp-header-inner {
            display: flex;

            justify-content: space-between;

            padding: 0 25px;
          }

          .hhp-nav,
          .hhp-actions {
            display: none;
          }

          .hhp-brand-mark {
            width: 43px;
            height: 43px;
          }

          .hhp-brand-copy strong {
            font-size: 20px;
          }

          .hhp-hero {
            min-height: 600px;

            background-position: 62% center;
          }

          .hhp-hero-content {
            width: calc(100% - 40px);

            min-height: 600px;

            padding-top: 205px;
          }

          .hhp-hero h1 {
            font-size: clamp(58px, 16vw, 86px);
          }

          .hhp-hero-description {
            max-width: 100%;

            margin-top: 30px;

            font-size: 14px;
          }

          .hhp-content-grid {
            grid-template-columns: 1fr;

            gap: 40px;
          }

          .hhp-sidebar {
            display: none;
          }

          .hhp-section-copy {
            margin-left: 0;
          }

          .hhp-footer-grid {
            grid-template-columns: 1fr 1fr;
          }

          .hhp-footer-brand {
            grid-column: 1 / -1;
          }

          .hhp-footer-contact {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .hhp-content {
            width: calc(100% - 40px);

            padding: 80px 0 100px;
          }

          .hhp-section {
            padding-bottom: 48px;

            margin-bottom: 48px;
          }

          .hhp-section-heading {
            grid-template-columns: 40px 1fr;

            gap: 12px;
          }

          .hhp-section h2 {
            font-size: 32px;
          }

          .hhp-section-copy {
            margin-top: 22px;
          }

          .hhp-section-copy p {
            font-size: 13px;
          }

          .hhp-final-inner {
            width: calc(100% - 40px);

            min-height: 420px;
          }

          .hhp-final h2 {
            font-size: 55px;
          }

          .hhp-footer-inner {
            width: calc(100% - 40px);
          }

          .hhp-footer-grid {
            grid-template-columns: 1fr;
          }

          .hhp-footer-brand,
          .hhp-footer-contact {
            grid-column: auto;
          }

          .hhp-footer-bottom {
            flex-direction: column;

            gap: 8px;

            align-items: flex-start;
          }
        }

        @media (max-width: 420px) {
          .hhp-brand-copy strong {
            font-size: 18px;
          }

          .hhp-brand-copy small {
            font-size: 7px;
          }

          .hhp-hero h1 {
            font-size: 54px;
          }

          .hhp-section-heading {
            display: block;
          }

          .hhp-section-number {
            display: block;

            margin-bottom: 12px;
          }
        }
      `}</style>

      {/* =========================================================
          HERO + OVERLAY HEADER
      ========================================================= */}

      <section className="hhp-hero">
        <header className="hhp-header">
          <div className="hhp-header-inner">

            {/* LOGO */}
            <Link href="/" className="hhp-brand">
              <span className="hhp-brand-mark">H</span>

              <span className="hhp-brand-copy">
                <strong>hikinhigh</strong>
                <small>travels</small>
              </span>
            </Link>

            {/* NAVIGATION */}
            <nav className="hhp-nav">
              <Link href="/destinations">Destinations</Link>
              <Link href="/hotels">Hotels</Link>
              <Link href="/packages">Packages</Link>
              <Link href="/adventures">Adventures</Link>
              <Link href="/about">About</Link>
            </nav>

            {/* ACTIONS */}
            <div className="hhp-actions">
              <Link href="/login" className="hhp-login">
                Login
              </Link>

              <Link href="/register" className="hhp-join">
                Join us
              </Link>
            </div>

          </div>
        </header>

        {/* HERO CONTENT */}
        <div className="hhp-hero-content">
          <span className="hhp-eyebrow">
            LEGAL
          </span>

          <h1>
            Privacy
            <em>Policy.</em>
          </h1>

          <p className="hhp-hero-description">
            This policy explains how information may be collected, used and
            handled when you use the Hikinhigh Travels website and services.
          </p>

          <div className="hhp-hero-meta">
            <span>Hikinhigh Travels</span>
            <span>Privacy &amp; Data</span>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <section className="hhp-content">
        <div className="hhp-content-grid">

          <aside className="hhp-sidebar">
            <span className="hhp-sidebar-label">
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
                className="hhp-section"
              >
                <div className="hhp-section-heading">
                  <span className="hhp-section-number">
                    {section.number}
                  </span>

                  <h2>{section.title}</h2>
                </div>

                <div className="hhp-section-copy">
                  {section.content}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="hhp-final">
        <div className="hhp-final-inner">
          <span className="hhp-final-label">
            HAVE A QUESTION?
          </span>

          <h2>
            We are here
            <br />
            <em>to help.</em>
          </h2>

          <p>
            If you have questions about this Privacy Policy or how your
            information is handled, get in touch with the Hikinhigh Travels
            team.
          </p>

          <Link
            href="/contact"
            className="hhp-final-button"
          >
            Contact Us →
          </Link>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="hhp-footer">
        <div className="hhp-footer-inner">

          <div className="hhp-footer-grid">

            <div className="hhp-footer-brand">
              <Link href="/">
                <strong>HIKINHIGH</strong>
                <small>TRAVELS</small>
              </Link>

              <p>
                Beautiful stays, unforgettable journeys and experiences
                worth travelling for.
              </p>
            </div>

            <div className="hhp-footer-column">
              <h4>Explore</h4>

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

            <div className="hhp-footer-column">
              <h4>Company</h4>

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

            <div className="hhp-footer-contact">
              <h4>Contact</h4>

              <p>
                hello@hikinhightravels.com
              </p>

              <p>
                +91 00000 00000
              </p>
            </div>

          </div>

          <div className="hhp-footer-bottom">
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