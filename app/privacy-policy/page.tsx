import Link from "next/link";
import styles from "./privacy-policy.module.css";

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

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>LEGAL</span>

          <h1>
            Privacy
            <em>Policy.</em>
          </h1>

          <p className={styles.heroDescription}>
            This policy explains how information may be collected, used and
            handled when you use the Hikinhigh Travels website and services.
          </p>

          <div className={styles.heroMeta}>
            <span>Hikinhigh Travels</span>
            <span>Privacy &amp; Data</span>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentGrid}>
          <aside className={styles.sidebar}>
            <span className={styles.sidebarLabel}>On this page</span>

            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.number} &nbsp; {section.title}
              </a>
            ))}
          </aside>

          <div>
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className={styles.section}
              >
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionNumber}>
                    {section.number}
                  </span>

                  <h2>{section.title}</h2>
                </div>

                <div className={styles.sectionCopy}>
                  {section.content}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.final}>
        <div className={styles.finalInner}>
          <span className={styles.finalLabel}>HAVE A QUESTION?</span>

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

          <Link href="/contact" className={styles.finalButton}>
            Contact Us →
          </Link>
        </div>
      </section>
    </main>
  );
}