"use client";

import Link from "next/link";
import { useState } from "react";

type HeaderProps = {
  variant?: "transparent" | "light";
};

export default function Header({
  variant = "transparent",
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={`hh-global-header ${
          variant === "transparent"
            ? "hh-header-transparent"
            : "hh-header-light"
        }`}
      >
        <div className="hh-header-inner">
          {/* LOGO */}
          <Link
            href="/"
            className="hh-logo-link"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src="/images/hikinhigh-logo.png"
              alt="Hikinhigh Travels"
              className="hh-logo"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hh-desktop-nav">
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

          {/* DESKTOP ACTIONS */}
          <div className="hh-header-actions">
            <Link
              href="/login"
              className="hh-login"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="hh-join"
            >
              Join us
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="hh-mobile-toggle"
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((value) => !value)
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`hh-mobile-menu ${
            mobileOpen
              ? "hh-mobile-menu-open"
              : ""
          }`}
        >
          <nav>
            <Link
              href="/destinations"
              onClick={() => setMobileOpen(false)}
            >
              Destinations
            </Link>

            <Link
              href="/hotels"
              onClick={() => setMobileOpen(false)}
            >
              Hotels
            </Link>

            <Link
              href="/packages"
              onClick={() => setMobileOpen(false)}
            >
              Packages
            </Link>

            <Link
              href="/adventures"
              onClick={() => setMobileOpen(false)}
            >
              Adventures
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
          </nav>

          <div className="hh-mobile-actions">
            <Link
              href="/login"
              className="hh-mobile-login"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>

            <Link
              href="/register"
              className="hh-mobile-join"
              onClick={() => setMobileOpen(false)}
            >
              Join us
            </Link>
          </div>
        </div>
      </header>

      <style jsx>{`
        .hh-global-header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 108px;
          z-index: 99999;
          box-sizing: border-box;
        }

        .hh-header-transparent {
          background: transparent;
        }

        .hh-header-light {
          position: relative;
          background: #f4f1e9;
        }

        .hh-header-inner {
          width: 100%;
          height: 100%;
          padding: 0 50px;

          display: grid;

          grid-template-columns:
            280px
            minmax(0, 1fr)
            280px;

          align-items: center;

          box-sizing: border-box;
        }

        /* =========================
           LOGO
        ========================= */

        .hh-logo-link {
          position: relative;

          display: flex;
          align-items: center;

          width: 220px;
          height: 80px;

          z-index: 100000;

          text-decoration: none;

          overflow: visible;
        }

        .hh-logo {
          display: block !important;

          width: 190px !important;
          height: auto !important;

          max-width: none !important;
          max-height: 70px !important;

          min-width: 190px !important;

          margin: 0;
          padding: 0;

          object-fit: contain;
          object-position: left center;

          opacity: 1 !important;
          visibility: visible !important;

          box-sizing: border-box;
        }

        /* =========================
           DESKTOP NAVIGATION
        ========================= */

        .hh-desktop-nav {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 40px;
        }

        .hh-desktop-nav a {
          position: relative;

          /* WHITE NAV TEXT */
          color: #ffffff !important;

          font-size: 14px;
          font-weight: 700;

          line-height: 1;

          text-decoration: none;

          white-space: nowrap;

          transition:
            opacity 0.2s ease,
            color 0.2s ease;
        }

        .hh-desktop-nav a:visited {
          color: #ffffff !important;
        }

        .hh-desktop-nav a:hover {
          color: #ffffff !important;
          opacity: 0.7;
        }

        .hh-desktop-nav a::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: -9px;

          width: 0;
          height: 1px;

          background: #ffffff;

          transition: width 0.25s ease;
        }

        .hh-desktop-nav a:hover::after {
          width: 100%;
        }

        /* =========================
           DESKTOP ACTIONS
        ========================= */

        .hh-header-actions {
          display: flex;

          align-items: center;
          justify-content: flex-end;

          gap: 24px;
        }

        .hh-login {
          color: #ffffff !important;

          font-size: 14px;
          font-weight: 700;

          text-decoration: none;

          white-space: nowrap;

          transition:
            opacity 0.2s ease,
            color 0.2s ease;
        }

        .hh-login:visited {
          color: #ffffff !important;
        }

        .hh-login:hover {
          color: #ffffff !important;
          opacity: 0.7;
        }

        /* =========================
           JOIN BUTTON
        ========================= */

        .hh-join {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 126px;
          height: 54px;

          background: #103d31;

          color: #ffffff !important;

          font-size: 12px;
          font-weight: 800;

          letter-spacing: 0.04em;

          text-decoration: none;

          box-sizing: border-box;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .hh-join:visited {
          color: #ffffff !important;
        }

        .hh-join:hover {
          background: #ffffff;

          color: #103d31 !important;

          transform: translateY(-2px);
        }

        /* =========================
           MOBILE TOGGLE
        ========================= */

        .hh-mobile-toggle {
          display: none;

          width: 45px;
          height: 45px;

          margin-left: auto;

          padding: 0;

          border: 0;

          background: transparent;

          cursor: pointer;

          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 5px;
        }

        .hh-mobile-toggle span {
          display: block;

          width: 24px;
          height: 1px;

          background: #ffffff !important;
        }

        /* =========================
           MOBILE MENU
        ========================= */

        .hh-mobile-menu {
          display: none;
        }

        @media (max-width: 1100px) {
          .hh-header-inner {
            grid-template-columns:
              230px
              minmax(0, 1fr)
              230px;

            padding: 0 35px;
          }

          .hh-logo-link {
            width: 200px;
          }

          .hh-logo {
            width: 175px !important;
            min-width: 175px !important;
          }

          .hh-desktop-nav {
            gap: 25px;
          }

          .hh-desktop-nav a {
            color: #ffffff !important;
          }

          .hh-login {
            color: #ffffff !important;
          }
        }

        @media (max-width: 850px) {
          .hh-global-header {
            height: 82px;
          }

          .hh-header-inner {
            display: flex;

            padding: 0 25px;
          }

          .hh-logo-link {
            width: 180px;
            height: 70px;
          }

          .hh-logo {
            width: 160px !important;
            min-width: 160px !important;
            max-height: 55px !important;
          }

          .hh-desktop-nav,
          .hh-header-actions {
            display: none;
          }

          .hh-mobile-toggle {
            display: flex;
          }

          .hh-mobile-menu {
            position: absolute;

            top: 82px;
            left: 0;

            width: 100%;

            padding: 0 25px 25px;

            background: #103d31;

            box-sizing: border-box;

            box-shadow:
              0 20px 40px
              rgba(0, 0, 0, 0.15);

            opacity: 0;
            visibility: hidden;

            transform: translateY(-8px);

            transition:
              opacity 0.2s ease,
              visibility 0.2s ease,
              transform 0.2s ease;
          }

          .hh-mobile-menu-open {
            display: block;

            opacity: 1;
            visibility: visible;

            transform: translateY(0);
          }

          .hh-mobile-menu nav {
            display: flex;

            flex-direction: column;
          }

          .hh-mobile-menu nav a {
            padding: 16px 0;

            border-bottom:
              1px solid
              rgba(255, 255, 255, 0.12);

            color: #ffffff !important;

            font-size: 15px;
            font-weight: 700;

            text-decoration: none;
          }

          .hh-mobile-menu nav a:visited {
            color: #ffffff !important;
          }

          .hh-mobile-menu nav a:hover {
            color: #ffffff !important;
          }

          .hh-mobile-actions {
            display: flex;

            gap: 12px;

            padding-top: 20px;
          }

          .hh-mobile-login,
          .hh-mobile-join {
            flex: 1;

            height: 48px;

            display: flex;

            align-items: center;
            justify-content: center;

            font-size: 12px;
            font-weight: 800;

            text-transform: uppercase;

            text-decoration: none;
          }

          .hh-mobile-login {
            border: 1px solid #ffffff;

            color: #ffffff !important;
          }

          .hh-mobile-login:visited {
            color: #ffffff !important;
          }

          .hh-mobile-join {
            background: #ffffff;

            color: #103d31 !important;
          }
        }

        @media (max-width: 420px) {
          .hh-header-inner {
            padding: 0 20px;
          }

          .hh-logo {
            width: 145px !important;
            min-width: 145px !important;
          }
        }
      `}</style>
    </>
  );
}