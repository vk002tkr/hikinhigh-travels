import Link from "next/link";
import styles from "./terms-conditions.module.css";

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

        <div className={styles.contactBox}>
          <strong>Hikinhigh Travels</strong>
          <span>Connect@hikinhigh.com</span>
          <span>+91 813 006 9469</span>
          <span>Gurugram, Haryana, India</span>
        </div>
      </>
    ),
  },
];

export default function TermsConditionsPage() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            HIKINHIGH TRAVELS
          </div>

          <h1>
            Terms
            <br />
            <em>&amp; Conditions</em>
          </h1>

          <p>
            The terms that guide the use of our website,
            travel services and experiences.
          </p>
        </div>

        <div className={styles.heroBottom}>
          <span>Legal</span>
          <span>13 Sections</span>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro}>
        <div className={styles.introNumber}>00</div>

        <div className={styles.introContent}>
          <p className={styles.introLabel}>
            PLEASE READ CAREFULLY
          </p>

          <h2>
            Travel should feel
            <br />
            <em>simple and clear.</em>
          </h2>

          <p className={styles.introText}>
            These Terms &amp; Conditions explain the general terms that apply
            when you use the Hikinhigh Travels website and engage with our
            travel-related services, information and experiences.
          </p>
        </div>
      </section>

      {/* CONTENT AREA */}
      <section className={styles.contentSection}>
        <div className={styles.contentGrid}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarTitle}>
              On this page
            </div>

            <nav className={styles.sidebarNav}>
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  <span>{section.number}</span>
                  <span>{section.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <div className={styles.sections}>
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className={styles.section}
              >
                <div className={styles.sectionNumber}>
                  {section.number}
                </div>

                <div className={styles.sectionBody}>
                  <p className={styles.sectionEyebrow}>
                    SECTION {section.number}
                  </p>

                  <h2>{section.title}</h2>

                  <div className={styles.sectionText}>
                    {section.content}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaCopy}>
            <span className={styles.ctaEyebrow}>
              HAVE QUESTIONS?
            </span>

            <h2>
              Start your
              <br />
              <em>journey.</em>
            </h2>

            <p>
              If you have questions about these Terms &amp; Conditions
              or anything related to your journey, our team is here to help.
            </p>
          </div>

          <div className={styles.ctaActions}>
            <Link
              href="/contact"
              className={styles.primaryButton}
            >
              Contact Us
              <span>↗</span>
            </Link>

            <Link
              href="/destinations"
              className={styles.secondaryButton}
            >
              Explore Destinations
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER LEGAL STRIP */}
      <section className={styles.legalStrip}>
        <div>
          <span>Hikinhigh Travels</span>
          <span>Terms &amp; Conditions</span>
        </div>

        <div>
          <Link href="/privacy-policy">
            Privacy Policy
          </Link>

          <Link href="/contact">
            Contact
          </Link>
        </div>
      </section>
    </main>
  );
}