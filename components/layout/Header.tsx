"use client";

import Link from "next/link";
import { useState } from "react";
import {
  currencies,
  useCurrency,
  type CurrencyCode,
} from "../providers/CurrencyProvider";

const navigation = [
  {
    label: "Destinations",
    href: "/destinations",
  },
  {
    label: "Stays",
    href: "/hotels",
  },
  {
    label: "Journeys",
    href: "/packages",
  },
  {
    label: "Experiences",
    href: "/adventures",
  },
  {
    label: "About",
    href: "/about",
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [currencyOpen, setCurrencyOpen] =
    useState(false);

  const {
    currency,
    selectedCurrency,
    setCurrency,
    detectingCurrency,
  } = useCurrency();

  const closeMenus = () => {
    setMenuOpen(false);
    setCurrencyOpen(false);
  };

  const changeCurrency = (
    code: CurrencyCode
  ) => {
    setCurrency(code);
    setCurrencyOpen(false);
  };

  return (
    <>
      <header className="hh-header">
        <div className="hh-header-inner">
          {/* LOGO */}

          <Link
            href="/"
            className="hh-brand"
            aria-label="Hikinhigh Travels home"
            onClick={closeMenus}
          >
            <img
              src="/images/hikinhigh-logo.png"
              alt="Hikinhigh Travels"
              className="hh-brand-logo"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav
            className="hh-desktop-nav"
            aria-label="Primary navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hh-nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}

          <div className="hh-actions">
            <div className="hh-currency-wrap">
              <button
                type="button"
                className="hh-currency-trigger"
                aria-haspopup="menu"
                aria-expanded={currencyOpen}
                onClick={() =>
                  setCurrencyOpen(
                    (value) => !value
                  )
                }
              >
                <span className="hh-currency-symbol">
                  {selectedCurrency.symbol}
                </span>

                <span className="hh-currency-code">
                  {detectingCurrency
                    ? "..."
                    : selectedCurrency.code}
                </span>

                <span
                  className={`hh-currency-chevron ${
                    currencyOpen
                      ? "hh-currency-chevron-open"
                      : ""
                  }`}
                >
                  ⌄
                </span>
              </button>

              {currencyOpen && (
                <>
                  <button
                    type="button"
                    className="hh-currency-backdrop"
                    aria-label="Close currency menu"
                    onClick={() =>
                      setCurrencyOpen(false)
                    }
                  />

                  <div
                    className="hh-currency-menu"
                    role="menu"
                  >
                    <div className="hh-currency-title">
                      Choose currency
                    </div>

                    {currencies.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        role="menuitem"
                        className={`hh-currency-option ${
                          item.code === currency
                            ? "hh-currency-option-active"
                            : ""
                        }`}
                        onClick={() =>
                          changeCurrency(item.code)
                        }
                      >
                        <span className="hh-option-symbol">
                          {item.symbol}
                        </span>

                        <span className="hh-option-copy">
                          <strong>
                            {item.code}
                          </strong>

                          <small>
                            {item.country}
                          </small>
                        </span>

                        {item.code === currency && (
                          <span className="hh-currency-check">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

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

          {/* MOBILE BUTTON */}

          <button
            type="button"
            className={`hh-mobile-toggle ${
              menuOpen
                ? "hh-mobile-toggle-open"
                : ""
            }`}
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen(
                (value) => !value
              )
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* MOBILE PANEL */}

        {menuOpen && (
          <div className="hh-mobile-panel">
            <nav
              className="hh-mobile-nav"
              aria-label="Mobile navigation"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hh-mobile-nav-link"
                  onClick={closeMenus}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hh-mobile-currency">
              <span>
                Currency
              </span>

              <div className="hh-mobile-currency-grid">
                {currencies.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className={
                      item.code === currency
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      changeCurrency(item.code)
                    }
                  >
                    {item.symbol}{" "}
                    {item.code}
                  </button>
                ))}
              </div>
            </div>

            <div className="hh-mobile-actions">
              <Link
                href="/login"
                className="hh-mobile-login"
                onClick={closeMenus}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="hh-mobile-join"
                onClick={closeMenus}
              >
                Join us
              </Link>
            </div>

            <div className="hh-mobile-contact">
              <span>
                Connect@hikinhigh.com
              </span>

              <span>
                +91 813 006 9469
              </span>
            </div>
          </div>
        )}
      </header>

      <style jsx>{`
        .hh-header {
          position: relative;
          z-index: 1000;
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #e8ece9;
          color: #143d31;
        }

        .hh-header-inner {
          width: min(
            1440px,
            calc(100% - 64px)
          );
          min-height: 96px;
          margin: 0 auto;

          display: grid;
          grid-template-columns:
            180px
            1fr
            auto;

          align-items: center;
          gap: 30px;
        }

        .hh-brand {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          text-decoration: none;
        }

        .hh-brand-logo {
          display: block;
          width: 122px;
          height: 62px;
          object-fit: contain;
          object-position: left center;
        }

        .hh-desktop-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(
            22px,
            2.5vw,
            40px
          );
        }

        .hh-nav-link {
          position: relative;
          color: #173d32;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          transition:
            color 180ms ease;
        }

        .hh-nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -8px;
          height: 1px;
          background: #173d32;
          transform: scaleX(0);
          transform-origin: center;
          transition:
            transform 180ms ease;
        }

        .hh-nav-link:hover {
          color: #071f18;
        }

        .hh-nav-link:hover::after {
          transform: scaleX(1);
        }

        .hh-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 18px;
        }

        .hh-currency-wrap {
          position: relative;
          z-index: 20;
        }

        .hh-currency-trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 40px;
          padding: 0 6px;
          border: 0;
          outline: none;
          background: transparent;
          color: #173d32;
          font: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .hh-currency-symbol {
          font-size: 15px;
          font-weight: 500;
        }

        .hh-currency-code {
          min-width: 28px;
        }

        .hh-currency-chevron {
          margin-left: 1px;
          font-size: 14px;
          line-height: 1;
          transition:
            transform 180ms ease;
        }

        .hh-currency-chevron-open {
          transform: rotate(180deg);
        }

        .hh-currency-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1;
          width: 100vw;
          height: 100vh;
          border: 0;
          background: transparent;
        }

        .hh-currency-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: -10px;
          z-index: 5;

          width: 252px;
          padding: 9px;

          border: 1px solid #e2e8e4;
          border-radius: 14px;

          background: #ffffff;

          box-shadow:
            0 20px 50px
              rgba(
                19,
                54,
                43,
                0.15
              );
        }

        .hh-currency-title {
          padding: 9px 11px 10px;
          color: #7a847f;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .hh-currency-option {
          width: 100%;
          display: grid;
          grid-template-columns:
            34px
            1fr
            auto;
          align-items: center;
          gap: 9px;

          padding: 9px;

          border: 0;
          border-radius: 9px;

          background: transparent;
          color: #173d32;

          text-align: left;
          cursor: pointer;

          transition:
            background 160ms ease;
        }

        .hh-currency-option:hover,
        .hh-currency-option-active {
          background: #f2f6f3;
        }

        .hh-option-symbol {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 30px;
          height: 30px;

          border: 1px solid #dce4df;
          border-radius: 50%;

          font-size: 13px;
        }

        .hh-option-copy {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .hh-option-copy strong {
          font-size: 13px;
          font-weight: 700;
        }

        .hh-option-copy small {
          color: #7b8580;
          font-size: 11px;
        }

        .hh-currency-check {
          color: #103d31;
          font-size: 14px;
          font-weight: 700;
        }

        /* LOGIN */

        .hh-login {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 40px;
          padding: 0 2px;

          border: 0 !important;
          outline: none !important;
          border-radius: 0 !important;

          background: transparent !important;
          box-shadow: none !important;

          color: #173d32;

          font-size: 14px;
          font-weight: 500;

          text-decoration: none;

          white-space: nowrap;
          transition: color 180ms ease;
        }

        .hh-login:hover {
          color: #071f18;
        }

        /* JOIN US */

        .hh-join {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 42px;
          padding: 0 19px;

          border: 1px solid #143d31 !important;
          border-radius: 999px !important;

          background: #143d31 !important;
          color: #ffffff !important;

          font-size: 13px;
          font-weight: 600;

          text-decoration: none;

          white-space: nowrap;

          transition:
            background 180ms ease,
            transform 180ms ease;
        }

        .hh-join:hover {
          background: #1c5142 !important;
          transform: translateY(-1px);
        }

        .hh-mobile-toggle {
          display: none;
        }

        .hh-mobile-panel {
          display: none;
        }

        @media (max-width: 1120px) {
          .hh-header-inner {
            width: min(
              100%,
              calc(100% - 40px)
            );
            grid-template-columns:
              150px
              1fr
              auto;
            gap: 18px;
          }

          .hh-desktop-nav {
            gap: 18px;
          }

          .hh-actions {
            gap: 12px;
          }
        }

        @media (max-width: 900px) {
          .hh-header-inner {
            width: calc(100% - 32px);
            min-height: 82px;
            display: flex;
            justify-content: space-between;
          }

          .hh-desktop-nav,
          .hh-actions {
            display: none;
          }

          .hh-brand-logo {
            width: 116px;
            height: 56px;
          }

          .hh-mobile-toggle {
            width: 44px;
            height: 44px;

            padding: 0;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            gap: 5px;

            border: 1px solid #dce4df;
            border-radius: 50%;

            background: #ffffff;
            cursor: pointer;
          }

          .hh-mobile-toggle span {
            width: 17px;
            height: 1.5px;
            background: #143d31;
            transition:
              transform 180ms ease,
              opacity 180ms ease;
          }

          .hh-mobile-toggle-open
            span:nth-child(1) {
            transform:
              translateY(6.5px)
              rotate(45deg);
          }

          .hh-mobile-toggle-open
            span:nth-child(2) {
            opacity: 0;
          }

          .hh-mobile-toggle-open
            span:nth-child(3) {
            transform:
              translateY(-6.5px)
              rotate(-45deg);
          }

          .hh-mobile-panel {
            display: block;

            padding: 20px 18px 25px;

            border-top: 1px solid
              #edf0ee;

            background: #ffffff;

            box-shadow:
              0 18px 40px
                rgba(
                  16,
                  61,
                  49,
                  0.1
                );
          }

          .hh-mobile-nav {
            display: flex;
            flex-direction: column;
          }

          .hh-mobile-nav-link {
            padding: 15px 0;

            border-bottom: 1px solid
              #edf0ee;

            color: #173d32;

            font-size: 16px;
            font-weight: 500;

            text-decoration: none;
          }

          .hh-mobile-currency {
            margin-top: 20px;
            padding-top: 18px;

            border-top: 1px solid
              #edf0ee;
          }

          .hh-mobile-currency > span {
            display: block;
            margin-bottom: 11px;

            color: #7b8580;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }

          .hh-mobile-currency-grid {
            display: grid;
            grid-template-columns:
              repeat(3, 1fr);
            gap: 7px;
          }

          .hh-mobile-currency-grid button {
            min-height: 38px;

            border: 1px solid
              #dfe6e2;
            border-radius: 8px;

            background: #ffffff;
            color: #173d32;

            font-size: 12px;
            cursor: pointer;
          }

          .hh-mobile-currency-grid
            button.active {
            border-color: #143d31;
            background: #143d31;
            color: #ffffff;
          }

          .hh-mobile-actions {
            display: grid;
            grid-template-columns:
              1fr 1fr;
            gap: 9px;

            margin-top: 20px;
          }

          .hh-mobile-login,
          .hh-mobile-join {
            min-height: 48px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 999px;

            font-size: 14px;
            font-weight: 600;

            text-decoration: none;
          }

          .hh-mobile-login {
            border: 1px solid #d9e1dc;
            color: #173d32;
          }

          .hh-mobile-join {
            border: 1px solid #143d31;
            background: #143d31;
            color: #ffffff;
          }

          .hh-mobile-contact {
            display: flex;
            flex-direction: column;
            gap: 5px;

            margin-top: 20px;
            padding-top: 18px;

            border-top: 1px solid
              #edf0ee;

            color: #737d78;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}