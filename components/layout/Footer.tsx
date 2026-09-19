import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hh-footer">
      <div className="hh-footer-main">
        <div className="hh-footer-brand">
          <Link href="/" className="hh-footer-logo">
            <img
              src="/images/hikinhigh-logo.png"
              alt="Hikinhigh Travels"
            />
          </Link>

          <p>
            Beautiful stays, thoughtful journeys and
            experiences worth remembering.
          </p>

          <Link
            href="/register"
            className="hh-footer-cta"
          >
            Start exploring <span>→</span>
          </Link>
        </div>

        <div className="hh-footer-column">
          <span>Explore</span>

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

        <div className="hh-footer-column">
          <span>Company</span>

          <Link href="/about">
            About us
          </Link>

          <Link href="/contact">
            Contact
          </Link>

          <Link href="/faq">
            FAQ
          </Link>

          <Link href="/login">
            Login
          </Link>
        </div>

        <div className="hh-footer-column">
          <span>Legal</span>

          <Link href="/privacy-policy">
            Privacy Policy
          </Link>

          <Link href="/terms-conditions">
            Terms & Conditions
          </Link>
        </div>
      </div>

      <div className="hh-footer-bottom">
        <span>
          © {new Date().getFullYear()} Hikinhigh Travels.
          All rights reserved.
        </span>

        <span>
          Travel more. Live more.
        </span>
      </div>

      <style jsx>{`
        .hh-footer {
          background: #103d31;
          color: #ffffff;
        }

        .hh-footer-main {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 50px 70px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          box-sizing: border-box;
        }

        .hh-footer-brand {
          max-width: 340px;
        }

        .hh-footer-logo {
          display: inline-flex;
          align-items: center;
          margin-bottom: 28px;
        }

        .hh-footer-logo img {
          display: block;
          width: 190px;
          height: auto;
          max-height: 70px;
          object-fit: contain;
        }

        .hh-footer-brand p {
          margin: 0 0 28px;
          max-width: 300px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 15px;
          line-height: 1.8;
        }

        .hh-footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .hh-footer-cta span {
          font-size: 18px;
          transition: transform 0.2s ease;
        }

        .hh-footer-cta:hover span {
          transform: translateX(4px);
        }

        .hh-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }

        .hh-footer-column > span {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .hh-footer-column a {
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .hh-footer-column a:hover {
          color: #ffffff;
        }

        .hh-footer-bottom {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 22px 50px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 11px;
          box-sizing: border-box;
        }

        @media (max-width: 900px) {
          .hh-footer-main {
            grid-template-columns: 1.5fr 1fr 1fr;
            gap: 40px;
            padding: 65px 30px 50px;
          }

          .hh-footer-brand {
            grid-column: 1 / -1;
            max-width: 500px;
          }

          .hh-footer-bottom {
            padding: 20px 30px;
          }
        }

        @media (max-width: 600px) {
          .hh-footer-main {
            grid-template-columns: 1fr 1fr;
            padding: 55px 25px 45px;
          }

          .hh-footer-brand {
            grid-column: 1 / -1;
          }

          .hh-footer-logo img {
            width: 165px;
          }

          .hh-footer-bottom {
            padding: 20px 25px;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}