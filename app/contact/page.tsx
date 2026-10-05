"use client";

import { FormEvent } from "react";

export default function ContactPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Backend/API connection will be added here later.
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f1e9",
        color: "#103d31",
        padding: "140px 40px 90px",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
        }}
      >
        {/* INTRO */}
        <section>
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
              maxWidth: "900px",
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

          <p
            style={{
              maxWidth: "650px",
              marginTop: "30px",
              marginBottom: 0,
              color: "#53605a",
              fontSize: "17px",
              lineHeight: 1.8,
            }}
          >
            Whether you already know where you want to go or are simply
            looking for inspiration, tell us what you have in mind. Our team
            will help you shape the right stay, journey or experience.
          </p>
        </section>

        {/* CONTACT INFORMATION */}
        <section
          style={{
            marginTop: "70px",
            borderTop: "1px solid rgba(16, 61, 49, 0.15)",
            borderBottom: "1px solid rgba(16, 61, 49, 0.15)",
            padding: "34px 0",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "36px",
          }}
        >
          {/* EMAIL */}
          <div>
            <span
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6d766f",
              }}
            >
              Email
            </span>

            <a
              href="mailto:Connect@hikinhigh.com"
              style={{
                color: "#103d31",
                fontSize: "18px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Connect@hikinhigh.com
            </a>
          </div>

          {/* PHONE */}
          <div>
            <span
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6d766f",
              }}
            >
              Phone
            </span>

            <a
              href="tel:+918130069469"
              style={{
                color: "#103d31",
                fontSize: "18px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              +91 813 006 9469
            </a>
          </div>

          {/* OFFICE */}
          <div>
            <span
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6d766f",
              }}
            >
              Office
            </span>

            <p
              style={{
                margin: 0,
                color: "#53605a",
                fontSize: "16px",
                lineHeight: 1.7,
              }}
            >
              Gurugram,
              <br />
              Haryana, India
            </p>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section
          style={{
            marginTop: "80px",
            display: "grid",
            gridTemplateColumns:
              "minmax(260px, 0.75fr) minmax(320px, 1.25fr)",
            gap: "80px",
            alignItems: "start",
          }}
        >
          {/* FORM INTRO */}
          <div>
            <span
              style={{
                display: "block",
                marginBottom: "16px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6d766f",
              }}
            >
              Send an enquiry
            </span>

            <h2
              style={{
                margin: 0,
                maxWidth: "420px",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(34px, 4vw, 54px)",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Tell us where
              <em
                style={{
                  display: "block",
                  color: "#6f8878",
                  fontWeight: 400,
                }}
              >
                you want to go.
              </em>
            </h2>

            <p
              style={{
                maxWidth: "390px",
                marginTop: "24px",
                color: "#53605a",
                fontSize: "15px",
                lineHeight: 1.8,
              }}
            >
              Share a few details about your plans and our travel team will
              get back to you with ideas and options tailored to your journey.
            </p>

            <div
              style={{
                marginTop: "38px",
                paddingTop: "24px",
                borderTop: "1px solid rgba(16, 61, 49, 0.12)",
                maxWidth: "390px",
              }}
            >
              <span
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6d766f",
                }}
              >
                Prefer to speak directly?
              </span>

              <a
                href="tel:+918130069469"
                style={{
                  color: "#103d31",
                  fontSize: "16px",
                  textDecoration: "none",
                }}
              >
                +91 813 006 9469
              </a>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            style={{
              borderTop: "1px solid rgba(16, 61, 49, 0.15)",
              paddingTop: "28px",
            }}
          >
            {/* NAME + EMAIL */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px",
              }}
            >
              <div>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginBottom: "9px",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#53605a",
                  }}
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  style={{
                    width: "100%",
                    height: "54px",
                    padding: "0 16px",
                    border: "1px solid rgba(16, 61, 49, 0.18)",
                    borderRadius: "0",
                    outline: "none",
                    background: "#faf8f2",
                    color: "#103d31",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: "9px",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#53605a",
                  }}
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  style={{
                    width: "100%",
                    height: "54px",
                    padding: "0 16px",
                    border: "1px solid rgba(16, 61, 49, 0.18)",
                    borderRadius: "0",
                    outline: "none",
                    background: "#faf8f2",
                    color: "#103d31",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* PHONE + TRAVEL TYPE */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px",
                marginTop: "24px",
              }}
            >
              <div>
                <label
                  htmlFor="phone"
                  style={{
                    display: "block",
                    marginBottom: "9px",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#53605a",
                  }}
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91"
                  style={{
                    width: "100%",
                    height: "54px",
                    padding: "0 16px",
                    border: "1px solid rgba(16, 61, 49, 0.18)",
                    borderRadius: "0",
                    outline: "none",
                    background: "#faf8f2",
                    color: "#103d31",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="travelType"
                  style={{
                    display: "block",
                    marginBottom: "9px",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#53605a",
                  }}
                >
                  I&apos;m interested in
                </label>

                <select
                  id="travelType"
                  name="travelType"
                  defaultValue=""
                  style={{
                    width: "100%",
                    height: "54px",
                    padding: "0 16px",
                    border: "1px solid rgba(16, 61, 49, 0.18)",
                    borderRadius: "0",
                    outline: "none",
                    background: "#faf8f2",
                    color: "#103d31",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="stays">Stays</option>
                  <option value="journeys">Journeys</option>
                  <option value="experiences">Experiences</option>
                  <option value="custom">Custom trip</option>
                  <option value="other">Something else</option>
                </select>
              </div>
            </div>

            {/* SUBJECT */}
            <div style={{ marginTop: "24px" }}>
              <label
                htmlFor="subject"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#53605a",
                }}
              >
                Subject
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What can we help you with?"
                required
                style={{
                  width: "100%",
                  height: "54px",
                  padding: "0 16px",
                  border: "1px solid rgba(16, 61, 49, 0.18)",
                  borderRadius: "0",
                  outline: "none",
                  background: "#faf8f2",
                  color: "#103d31",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* MESSAGE */}
            <div style={{ marginTop: "24px" }}>
              <label
                htmlFor="message"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#53605a",
                }}
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your destination, dates, group size or anything else you have in mind..."
                required
                rows={7}
                style={{
                  width: "100%",
                  padding: "16px",
                  border: "1px solid rgba(16, 61, 49, 0.18)",
                  borderRadius: "0",
                  outline: "none",
                  resize: "vertical",
                  background: "#faf8f2",
                  color: "#103d31",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* SUBMIT */}
            <div
              style={{
                marginTop: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  margin: 0,
                  maxWidth: "360px",
                  color: "#6d766f",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                By submitting this form, you agree to be contacted regarding
                your enquiry.
              </p>

              <button
                type="submit"
                style={{
                  minHeight: "50px",
                  padding: "0 28px",
                  border: "1px solid #103d31",
                  borderRadius: "999px",
                  background: "#103d31",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Send enquiry →
              </button>
            </div>
          </form>
        </section>

        {/* BOTTOM CONTACT STRIP */}
        <section
          style={{
            marginTop: "90px",
            padding: "42px 0",
            borderTop: "1px solid rgba(16, 61, 49, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6d766f",
              }}
            >
              Start a conversation
            </span>

            <p
              style={{
                margin: 0,
                fontFamily: "Georgia, serif",
                fontSize: "28px",
                fontWeight: 400,
              }}
            >
              Your next journey starts here.
            </p>
          </div>

          <a
            href="mailto:Connect@hikinhigh.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "48px",
              padding: "0 24px",
              border: "1px solid rgba(16, 61, 49, 0.25)",
              borderRadius: "999px",
              color: "#103d31",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Email us →
          </a>
        </section>
      </div>
    </main>
  );
}