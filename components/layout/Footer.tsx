"use client";

import Link from "next/link";

const exploreLinks = [
  { label: "Destinations", href: "/destinations" },
  { label: "Stays", href: "/hotels" },
  { label: "Journeys", href: "/packages" },
  { label: "Experiences", href: "/adventures" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

const supportLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="social-icon"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        r="4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="17.4" cy="6.7" r="1.15" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="social-icon"
    >
      <path
        d="M14 8h3V4.5c-.5-.1-1.8-.2-3.3-.2-3.3 0-5.6 2-5.6 5.7v3.2H5v3.9h3.1v6.6h3.9v-6.6h3.2l.5-3.9H12v-2.8c0-1.1.3-1.8 2-1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="social-icon"
    >
      <path
        d="M5.1 7.1A2.1 2.1 0 1 0 5.1 3a2.1 2.1 0 0 0 0 4.1ZM3.4 21h3.4V9H3.4v12ZM9 9v12h3.4v-6.7c0-1.8.3-3.5 2.6-3.5 2.2 0 2.2 2 2.2 3.6V21h3.4v-7.3c0-3.6-.8-6.4-5-6.4-2 0-3.3 1.1-3.8 2.1h-.1V9H9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        {/* Brand */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo-link">
            <img
              src="/images/hikinhigh-logo.png"
              alt="Hikinhigh Travels"
              className="footer-logo"
            />
          </Link>

          <p className="footer-description">
            Thoughtfully designed journeys, remarkable stays and experiences
            that take you further.
          </p>

          <Link href="/destinations" className="explore-button">
            Explore the world
            <span>→</span>
          </Link>
        </div>

        {/* Explore */}
        <div className="footer-column">
          <h3>Explore</h3>

          <nav>
            {exploreLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h3>Company</h3>

          <nav>
            {companyLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h3>Support</h3>

          <nav>
            {supportLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Connect */}
        <div className="footer-column contact-column">
          <h3>Connect</h3>

          <div className="contact-details">
            <a href="mailto:Connect@hikinhigh.com">
              Connect@hikinhigh.com
            </a>

            <a href="tel:+918130069469">
              +91 813 006 9469
            </a>

            <span>Gurugram, Haryana, India</span>
          </div>

          {/* Social Media */}
          <div className="social-links">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="social-link"
            >
              <InstagramIcon />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="social-link"
            >
              <FacebookIcon />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="social-link"
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Hikinhigh Travels. All rights reserved.
        </p>

        <div className="bottom-links">
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-conditions">Terms</Link>
        </div>

        <span className="travel-more">
          Travel further. Experience more.
        </span>
      </div>

      <style jsx>{`
        .site-footer {
          width: 100%;
          background: #ffffff;
          color: #173f34;
          border-top: 1px solid rgba(16, 61, 49, 0.1);
        }

        .footer-main {
          width: min(100% - 48px, 1320px);
          margin: 0 auto;
          padding: 72px 0 64px;
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr 1.35fr;
          gap: 54px;
        }

        .footer-brand {
          max-width: 310px;
        }

        .footer-logo-link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }

        .footer-logo {
          width: 128px;
          height: 62px;
          display: block;
          object-fit: contain;
          object-position: left center;
        }

        .footer-description {
          margin: 18px 0 22px;
          max-width: 285px;
          color: #66736d;
          font-size: 13px;
          line-height: 1.8;
        }

        .explore-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #173f34;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.03em;
        }

        .explore-button span {
          font-size: 16px;
          transition: transform 0.2s ease;
        }

        .explore-button:hover span {
          transform: translateX(4px);
        }

        .footer-column h3 {
          margin: 4px 0 22px;
          color: #173f34;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .footer-column nav {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 13px;
        }

        .footer-column nav a {
          color: #69756f;
          font-size: 13px;
          line-height: 1.5;
          text-decoration: none;
          transition:
            color 0.18s ease,
            transform 0.18s ease;
        }

        .footer-column nav a:hover {
          color: #173f34;
          transform: translateX(2px);
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 11px;
        }

        .contact-details a,
        .contact-details span {
          color: #69756f;
          font-size: 12px;
          line-height: 1.5;
          text-decoration: none;
        }

        .contact-details a:hover {
          color: #173f34;
        }

        /* Social icons */
        .social-links {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
        }

        .social-link {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(16, 61, 49, 0.16);
          border-radius: 50%;
          color: #173f34;
          text-decoration: none;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .social-link:hover {
          background: #173f34;
          border-color: #173f34;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .social-icon {
          width: 16px;
          height: 16px;
          display: block;
        }

        .footer-bottom {
          width: min(100% - 48px, 1320px);
          margin: 0 auto;
          padding: 21px 0 24px;
          border-top: 1px solid rgba(16, 61, 49, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .footer-bottom p {
          margin: 0;
          color: #87908b;
          font-size: 10px;
        }

        .bottom-links {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .bottom-links a {
          color: #69756f;
          font-size: 10px;
          text-decoration: none;
        }

        .bottom-links a:hover {
          color: #173f34;
        }

        .travel-more {
          color: #87908b;
          font-size: 10px;
          font-style: italic;
        }

        @media (max-width: 1050px) {
          .footer-main {
            grid-template-columns: 1.5fr 1fr 1fr 1fr;
          }

          .contact-column {
            grid-column: span 2;
          }
        }

        @media (max-width: 760px) {
          .footer-main {
            width: min(100% - 36px, 620px);
            padding: 52px 0 44px;
            grid-template-columns: repeat(2, 1fr);
            gap: 42px 28px;
          }

          .footer-brand {
            grid-column: span 2;
            max-width: 420px;
          }

          .contact-column {
            grid-column: span 2;
          }

          .footer-bottom {
            width: min(100% - 36px, 620px);
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .bottom-links {
            order: 3;
          }
        }

        @media (max-width: 480px) {
          .footer-main {
            width: min(100% - 30px, 620px);
            grid-template-columns: 1fr;
            gap: 34px;
          }

          .footer-brand,
          .contact-column {
            grid-column: auto;
          }

          .footer-description {
            font-size: 12px;
          }

          .footer-bottom {
            width: min(100% - 30px, 620px);
          }

          .travel-more {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
}