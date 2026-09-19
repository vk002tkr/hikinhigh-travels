export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f1e9",
        color: "#103d31",
        padding: "140px 40px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <span
          style={{
            display: "block",
            marginBottom: "18px",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#6d766f",
          }}
        >
          Get in touch
        </span>

        <h1
          style={{
            margin: 0,
            maxWidth: "800px",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(48px, 7vw, 92px)",
            fontWeight: 400,
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
          }}
        >
          Let&apos;s plan your
          <em
            style={{
              display: "block",
              color: "#6f8878",
              fontWeight: 400,
            }}
          >
            next journey.
          </em>
        </h1>

        <div
          style={{
            marginTop: "70px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "50px",
            borderTop: "1px solid rgba(16, 61, 49, 0.15)",
            paddingTop: "35px",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Email
            </span>

            <a
              href="mailto:hello@hikinhigh.com"
              style={{
                color: "#103d31",
                fontSize: "18px",
                textDecoration: "none",
              }}
            >
              hello@hikinhigh.com
            </a>
          </div>

          <div>
            <span
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Phone
            </span>

            <a
              href="tel:+919999999999"
              style={{
                color: "#103d31",
                fontSize: "18px",
                textDecoration: "none",
              }}
            >
              +91 99999 99999
            </a>
          </div>

          <div>
            <span
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Office
            </span>

            <p
              style={{
                margin: 0,
                maxWidth: "280px",
                color: "#53605a",
                fontSize: "16px",
                lineHeight: 1.7,
              }}
            >
              India
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}