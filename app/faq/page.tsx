"use client";

import { useState } from "react";
import Link from "next/link";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  intro: string;
  items: FAQItem[];
};

const categories: FAQCategory[] = [
  {
    title: "General",
    intro:
      "Everything you need to know before beginning your journey with Hikinhigh Travels.",
    items: [
      {
        question: "What is Hikinhigh Travels?",
        answer:
          "Hikinhigh Travels is a travel company focused on creating memorable journeys through carefully selected destinations, stays, travel packages and experiences. Our aim is to make travel simple, comfortable and meaningful from planning to return.",
      },
      {
        question: "What kind of travel experiences do you offer?",
        answer:
          "We offer a range of travel experiences including destination stays, curated journeys, holiday packages, nature escapes, adventure experiences and personalised travel arrangements.",
      },
      {
        question: "Can I customise my trip?",
        answer:
          "Yes. Depending on the destination and services involved, journeys can be customised around your preferred dates, accommodation, activities, duration and travel requirements. Contact our team and we can discuss the available options.",
      },
      {
        question: "Do you arrange international trips?",
        answer:
          "Yes. Hikinhigh Travels is designed around both domestic and international travel. Destination availability, travel requirements and package inclusions vary by journey.",
      },
    ],
  },
  {
    title: "Bookings & Payments",
    intro:
      "A clear look at how reservations, pricing and payments work.",
    items: [
      {
        question: "How can I make a booking?",
        answer:
          "You can explore our destinations, stays, journeys and experiences through the website and contact our team to proceed with a booking. Depending on the service, additional information may be required before your reservation is confirmed.",
      },
      {
        question: "When is my booking confirmed?",
        answer:
          "A booking is considered confirmed once the required booking information has been received and the applicable payment or confirmation requirements have been completed. Our team will communicate the confirmation details to you.",
      },
      {
        question: "What payment methods are available?",
        answer:
          "Available payment methods may vary depending on the booking and service provider. Our team will provide the applicable payment instructions when you proceed with your reservation.",
      },
      {
        question: "Are the prices shown on the website final?",
        answer:
          "Displayed prices are intended to provide an indication of the applicable travel or service cost. Final pricing may depend on travel dates, availability, selected options, taxes, provider charges and other applicable booking conditions.",
      },
      {
        question: "Can prices change after I make an enquiry?",
        answer:
          "Yes. Travel prices and availability can change based on destination demand, dates, supplier availability, currency fluctuations and other factors. The applicable price will be communicated before the booking is confirmed.",
      },
    ],
  },
  {
    title: "Stays",
    intro:
      "Information about hotels and accommodation arranged through Hikinhigh.",
    items: [
      {
        question: "Can I choose my hotel?",
        answer:
          "Where the booking allows it, you may request a preferred hotel or accommodation category. Availability and applicable pricing will depend on your selected destination and travel dates.",
      },
      {
        question: "What is included with a stay?",
        answer:
          "Inclusions depend on the selected property and booking. They may include accommodation, meals or other facilities where specifically mentioned in your booking details.",
      },
      {
        question: "Can I request a specific room?",
        answer:
          "You may submit room preferences during the booking process. Specific room requests are subject to hotel availability and cannot always be guaranteed.",
      },
      {
        question: "What time are hotel check-in and check-out?",
        answer:
          "Check-in and check-out timings are determined by the individual property. The applicable timings will be shared as part of your booking information.",
      },
    ],
  },
  {
    title: "Journeys & Packages",
    intro:
      "Understand what our curated travel journeys and packages include.",
    items: [
      {
        question: "What is included in a travel package?",
        answer:
          "Package inclusions vary by itinerary. Depending on the package, they may include accommodation, transfers, sightseeing, activities, meals or other travel services. Please review the specific package details before booking.",
      },
      {
        question: "Can I change the itinerary?",
        answer:
          "Some itineraries can be customised, while others are fixed. Changes may depend on availability, supplier conditions, travel dates and any additional charges involved.",
      },
      {
        question: "Are flights included in your packages?",
        answer:
          "Flight inclusion depends on the specific package. If flights are included, this will be clearly mentioned in the package details or booking confirmation.",
      },
      {
        question: "Can I book only part of a package?",
        answer:
          "This depends on the specific journey and the services involved. Contact our team with your requirements and we can confirm what options are available.",
      },
    ],
  },
  {
    title: "Experiences & Adventures",
    intro:
      "Important information before taking part in an experience or adventure.",
    items: [
      {
        question: "Are adventure activities suitable for everyone?",
        answer:
          "Suitability depends on the activity, age requirements, fitness level, medical considerations and safety conditions specified by the activity provider. Always review the applicable requirements before participating.",
      },
      {
        question: "Do adventure experiences have age restrictions?",
        answer:
          "Some experiences may have minimum or maximum age requirements. These requirements vary by activity and provider and will be communicated where applicable.",
      },
      {
        question: "What happens if weather affects an activity?",
        answer:
          "Certain outdoor experiences depend on weather and local conditions. If an activity needs to be changed, postponed or cancelled for safety or operational reasons, the applicable provider terms will determine the available options.",
      },
      {
        question: "Do I need travel insurance for an adventure?",
        answer:
          "Travel insurance is strongly recommended, particularly for trips involving adventure activities, international travel or non-refundable arrangements. Any specific insurance requirements will depend on the activity and destination.",
      },
    ],
  },
  {
    title: "Changes & Cancellations",
    intro: "What to know if your plans change.",
    items: [
      {
        question: "Can I cancel my booking?",
        answer:
          "Cancellation may be possible depending on the booking terms, travel dates, service providers and applicable cancellation policies. Any refund or cancellation charges will be determined by the applicable booking conditions.",
      },
      {
        question: "Can I change my travel dates?",
        answer:
          "Date changes may be possible depending on availability and the terms of the relevant booking or service provider. Additional charges may apply.",
      },
      {
        question: "What happens if I need to cancel close to my travel date?",
        answer:
          "Late cancellations may be subject to higher cancellation charges or may become non-refundable depending on the provider's terms. We recommend contacting us as soon as possible if your plans change.",
      },
      {
        question: "What if a service provider cancels my booking?",
        answer:
          "If a hotel, activity provider, transport operator or another service provider cancels a confirmed service, we will work with you to communicate the available alternatives or remedies in accordance with the applicable provider terms.",
      },
    ],
  },
  {
    title: "Travel Documents",
    intro:
      "Prepare the documents you may need before travelling.",
    items: [
      {
        question: "What documents do I need for international travel?",
        answer:
          "Requirements vary by destination and nationality. Depending on your trip, you may need a valid passport, visa, permits, travel insurance, vaccination or health documentation and other destination-specific documents.",
      },
      {
        question: "Is a visa included in my package?",
        answer:
          "Visa services or fees are not automatically included unless specifically stated in your booking details. Visa requirements and approval remain subject to the relevant authorities.",
      },
      {
        question: "Am I responsible for checking my travel documents?",
        answer:
          "Yes. Travellers are responsible for ensuring that their passports, visas, permits and other required travel documents are valid and available for the journey.",
      },
    ],
  },
  {
    title: "Support",
    intro:
      "Need help before or during your journey? We are here to assist.",
    items: [
      {
        question: "How can I contact Hikinhigh Travels?",
        answer:
          "You can reach our team by email at Connect@hikinhigh.com or by phone at +91 813 006 9469. Our office is based in Gurugram, Haryana, India.",
      },
      {
        question: "Can I contact you for a customised itinerary?",
        answer:
          "Absolutely. If you have a particular destination, travel style, budget, duration or experience in mind, contact our team and share your requirements.",
      },
      {
        question: "What should I do if I face an issue during my trip?",
        answer:
          "Contact Hikinhigh Travels as soon as possible with your booking details and information about the issue. Where applicable, we will coordinate with the relevant service provider to assist you.",
      },
      {
        question:
          "Where can I read your Privacy Policy and Terms & Conditions?",
        answer:
          "You can find both documents in the footer of our website. They explain how we handle personal information and the terms applicable to using our services.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(
    "General-What is Hikinhigh Travels?"
  );

  const toggleItem = (id: string) => {
    setOpenItem((current) => (current === id ? null : id));
  };

  const getCategoryId = (title: string) =>
    `faq-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <main className="hhfaq-page">
      <style jsx global>{`
        .hhfaq-page {
          --faq-green: #143d31;
          --faq-dark: #17231e;
          --faq-cream: #f5f1e8;
          --faq-paper: #faf8f3;
          --faq-line: #d9d4c9;
          --faq-muted: #6d716b;

          min-height: 100vh;
          background: var(--faq-paper);
          color: var(--faq-dark);
        }

        /* HERO */

        .hhfaq-hero {
          position: relative;
          min-height: 570px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;

          background-image:
            linear-gradient(
              90deg,
              rgba(5, 43, 39, 0.97) 0%,
              rgba(5, 43, 39, 0.86) 25%,
              rgba(5, 43, 39, 0.44) 50%,
              rgba(5, 43, 39, 0.08) 100%
            ),
            url("/images/faq-hero.jpg");

          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .hhfaq-hero-inner {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
          padding-bottom: 80px;
          color: #ffffff;
        }

        .hhfaq-eyebrow {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 22px;

          color: rgba(255, 255, 255, 0.84);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .hhfaq-eyebrow::before {
          content: "";
          width: 38px;
          height: 1px;
          background: rgba(255, 255, 255, 0.75);
        }

        .hhfaq-hero h1 {
          max-width: 700px;
          margin: 0;

          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(55px, 7vw, 94px);
          font-weight: 400;
          line-height: 0.94;
          letter-spacing: -0.05em;
        }

        .hhfaq-hero h1 em {
          font-style: italic;
        }

        .hhfaq-hero-copy {
          max-width: 610px;
          margin: 30px 0 0;

          color: rgba(255, 255, 255, 0.82);
          font-size: 17px;
          line-height: 1.75;
        }

        /* CONTENT */

        .hhfaq-content {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
          padding: 100px 0 110px;
        }

        .hhfaq-intro {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 90px;

          padding-bottom: 80px;
          border-bottom: 1px solid var(--faq-line);
        }

        .hhfaq-section-label {
          margin: 0;

          color: var(--faq-green);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .hhfaq-intro h2 {
          max-width: 720px;
          margin: 0;

          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(38px, 4.3vw, 58px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.04em;
        }

        .hhfaq-intro h2 em {
          font-style: italic;
        }

        .hhfaq-intro p:not(.hhfaq-section-label) {
          max-width: 680px;
          margin: 25px 0 0;

          color: var(--faq-muted);
          font-size: 16px;
          line-height: 1.8;
        }

        /* FAQ LAYOUT */

        .hhfaq-layout {
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          gap: 85px;
          padding-top: 82px;
        }

        .hhfaq-sidebar {
          position: sticky;
          top: 110px;
          align-self: start;
        }

        .hhfaq-sidebar-title {
          margin: 0 0 20px;

          color: var(--faq-green);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .hhfaq-sidebar-list {
          display: flex;
          flex-direction: column;
        }

        .hhfaq-sidebar-link {
          padding: 10px 0;

          border: 0;
          background: transparent;

          color: #73766f;
          font-size: 14px;
          line-height: 1.4;
          text-align: left;

          cursor: pointer;

          transition:
            color 180ms ease,
            padding-left 180ms ease;
        }

        .hhfaq-sidebar-link:hover {
          padding-left: 7px;
          color: var(--faq-green);
        }

        .hhfaq-sidebar-note {
          margin-top: 35px;
          padding-top: 24px;

          border-top: 1px solid var(--faq-line);

          color: #7b7e77;
          font-size: 13px;
          line-height: 1.7;
        }

        /* CATEGORY */

        .hhfaq-category {
          scroll-margin-top: 110px;
          padding-bottom: 75px;
        }

        .hhfaq-category + .hhfaq-category {
          padding-top: 72px;
          border-top: 1px solid var(--faq-line);
        }

        .hhfaq-category-head {
          display: grid;
          grid-template-columns: 0.72fr 1.28fr;
          gap: 50px;

          margin-bottom: 38px;
        }

        .hhfaq-category-head h3 {
          margin: 0;

          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 3vw, 42px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.03em;
        }

        .hhfaq-category-head p {
          max-width: 500px;
          margin: 3px 0 0;

          color: var(--faq-muted);
          font-size: 15px;
          line-height: 1.75;
        }

        /* QUESTIONS */

        .hhfaq-list {
          border-top: 1px solid var(--faq-line);
        }

        .hhfaq-item {
          border-bottom: 1px solid var(--faq-line);
        }

        .hhfaq-question {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;

          padding: 25px 0;

          border: 0;
          background: transparent;

          color: var(--faq-dark);

          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
          font-weight: 400;
          line-height: 1.35;
          text-align: left;

          cursor: pointer;
        }

        .hhfaq-question:hover {
          color: var(--faq-green);
        }

        .hhfaq-icon {
          position: relative;

          flex: 0 0 34px;

          width: 34px;
          height: 34px;

          border: 1px solid #c9c4b9;
          border-radius: 50%;

          transition:
            background 180ms ease,
            border-color 180ms ease;
        }

        .hhfaq-icon::before,
        .hhfaq-icon::after {
          content: "";

          position: absolute;
          top: 50%;
          left: 50%;

          width: 11px;
          height: 1px;

          background: var(--faq-green);

          transform: translate(-50%, -50%);
        }

        .hhfaq-icon::after {
          transform: translate(-50%, -50%) rotate(90deg);
          transition: transform 180ms ease;
        }

        .hhfaq-icon.open {
          border-color: var(--faq-green);
          background: var(--faq-green);
        }

        .hhfaq-icon.open::before,
        .hhfaq-icon.open::after {
          background: #ffffff;
        }

        .hhfaq-icon.open::after {
          transform: translate(-50%, -50%) rotate(0deg);
        }

        .hhfaq-answer {
          max-width: 760px;
          padding: 0 70px 28px 0;

          color: #686c66;
          font-size: 15px;
          line-height: 1.85;
        }

        /* CTA */

        .hhfaq-cta {
          position: relative;
          overflow: hidden;

          margin-top: 10px;
          padding: 72px 75px;

          background:
            linear-gradient(
              90deg,
              rgba(20, 61, 49, 0.98),
              rgba(20, 61, 49, 0.9)
            ),
            url("/images/cta-travel.jpg") center / cover no-repeat;

          color: #ffffff;
        }

        .hhfaq-cta-inner {
          position: relative;
          z-index: 1;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
        }

        .hhfaq-cta h2 {
          max-width: 650px;
          margin: 0;

          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(36px, 4vw, 58px);
          font-weight: 400;
          line-height: 1.02;
          letter-spacing: -0.035em;
        }

        .hhfaq-cta h2 em {
          font-style: italic;
        }

        .hhfaq-cta-copy {
          max-width: 440px;
          margin: 20px 0 0;

          color: rgba(255, 255, 255, 0.72);
          font-size: 15px;
          line-height: 1.75;
        }

        .hhfaq-actions {
          display: flex;
          flex-shrink: 0;
          gap: 12px;
        }

        .hhfaq-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 46px;
          padding: 0 22px;

          border: 1px solid #ffffff;
          border-radius: 999px;

          background: #ffffff;
          color: var(--faq-green);

          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;

          transition:
            background 180ms ease,
            color 180ms ease;
        }

        .hhfaq-button:hover {
          background: transparent;
          color: #ffffff;
        }

        .hhfaq-button.secondary {
          border-color: rgba(255, 255, 255, 0.35);
          background: transparent;
          color: #ffffff;
        }

        .hhfaq-button.secondary:hover {
          border-color: #ffffff;
          background: #ffffff;
          color: var(--faq-green);
        }

        /* TABLET */

        @media (max-width: 900px) {
          .hhfaq-intro {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .hhfaq-layout {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .hhfaq-sidebar {
            position: static;
          }

          .hhfaq-sidebar-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0 25px;
          }

          .hhfaq-sidebar-note {
            display: none;
          }

          .hhfaq-category-head {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .hhfaq-cta {
            padding: 55px 42px;
          }

          .hhfaq-cta-inner {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        /* MOBILE */

        @media (max-width: 640px) {
          .hhfaq-hero {
            min-height: 500px;

            background-position: 62% center;
          }

          .hhfaq-hero-inner {
            width: min(100% - 32px, 1180px);
            padding-bottom: 52px;
          }

          .hhfaq-hero h1 {
            font-size: clamp(50px, 15vw, 72px);
          }

          .hhfaq-hero-copy {
            max-width: 430px;
            font-size: 15px;
          }

          .hhfaq-content {
            width: min(100% - 32px, 1180px);
            padding: 65px 0 75px;
          }

          .hhfaq-intro {
            padding-bottom: 55px;
          }

          .hhfaq-layout {
            padding-top: 55px;
          }

          .hhfaq-sidebar-list {
            grid-template-columns: 1fr;
          }

          .hhfaq-category {
            padding-bottom: 55px;
          }

          .hhfaq-category + .hhfaq-category {
            padding-top: 55px;
          }

          .hhfaq-question {
            padding: 21px 0;
            font-size: 17px;
          }

          .hhfaq-answer {
            padding-right: 15px;
            font-size: 14px;
          }

          .hhfaq-cta {
            padding: 45px 28px;
          }

          .hhfaq-actions {
            width: 100%;
            flex-direction: column;
          }

          .hhfaq-button {
            width: 100%;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="hhfaq-hero">
        <div className="hhfaq-hero-inner">
          <div className="hhfaq-eyebrow">Help Centre</div>

          <h1>
            Questions,
            <br />
            <em>answered.</em>
          </h1>

          <p className="hhfaq-hero-copy">
            From planning your journey to checking into your stay, find
            answers to the questions travellers ask us most.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="hhfaq-content">
        <div className="hhfaq-intro">
          <div>
            <p className="hhfaq-section-label">
              Frequently Asked Questions
            </p>
          </div>

          <div>
            <h2>
              Travel should feel
              <br />
              <em>simple.</em>
            </h2>

            <p>
              We have gathered the essential information you may need while
              planning and booking your next journey with Hikinhigh Travels.
              If you cannot find what you are looking for, our team is happy
              to help.
            </p>
          </div>
        </div>

        <div className="hhfaq-layout">
          {/* SIDEBAR */}
          <aside className="hhfaq-sidebar">
            <p className="hhfaq-sidebar-title">Explore FAQs</p>

            <nav className="hhfaq-sidebar-list">
              {categories.map((category) => (
                <button
                  key={category.title}
                  type="button"
                  className="hhfaq-sidebar-link"
                  onClick={() => {
                    document
                      .getElementById(getCategoryId(category.title))
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                >
                  {category.title}
                </button>
              ))}
            </nav>

            <p className="hhfaq-sidebar-note">
              Still have a question? Our travel team is only a message away.
            </p>
          </aside>

          {/* FAQ CONTENT */}
          <div>
            {categories.map((category) => {
              const categoryId = getCategoryId(category.title);

              return (
                <section
                  key={category.title}
                  id={categoryId}
                  className="hhfaq-category"
                >
                  <div className="hhfaq-category-head">
                    <h3>{category.title}</h3>

                    <p>{category.intro}</p>
                  </div>

                  <div className="hhfaq-list">
                    {category.items.map((item) => {
                      const itemId = `${category.title}-${item.question}`;
                      const isOpen = openItem === itemId;

                      return (
                        <div className="hhfaq-item" key={item.question}>
                          <button
                            type="button"
                            className="hhfaq-question"
                            aria-expanded={isOpen}
                            onClick={() => toggleItem(itemId)}
                          >
                            <span>{item.question}</span>

                            <span
                              className={`hhfaq-icon ${
                                isOpen ? "open" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>

                          {isOpen && (
                            <div className="hhfaq-answer">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* CTA */}
            <section className="hhfaq-cta">
              <div className="hhfaq-cta-inner">
                <div>
                  <h2>
                    Still planning
                    <br />
                    your <em>next escape?</em>
                  </h2>

                  <p className="hhfaq-cta-copy">
                    Tell us where you want to go, what you want to experience,
                    and how you want to travel. We will help you take it from
                    there.
                  </p>
                </div>

                <div className="hhfaq-actions">
                  <Link href="/contact" className="hhfaq-button">
                    Contact us
                  </Link>

                  <Link
                    href="/destinations"
                    className="hhfaq-button secondary"
                  >
                    Explore destinations
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}