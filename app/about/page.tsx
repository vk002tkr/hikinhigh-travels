import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="hh-about-page">
      <style>{`
        .hh-about-page {
          background: #f4f1e9;
          color: #103d31;
          overflow: hidden;
        }

        .hh-about-container {
          width: min(1240px, calc(100% - 80px));
          margin: 0 auto;
        }

        /* =========================================
           HERO
        ========================================= */

        .hh-about-hero {
          position: relative;
          min-height: 760px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: #173d32;
        }

        .hh-about-hero-image {
          position: absolute;
          inset: 0;
          background-image: url("/images/adventures-manifesto.jpg");
          background-size: cover;
          background-position: center;
          transform: scale(1.01);
        }

        .hh-about-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(8, 29, 23, 0.16) 0%,
              rgba(8, 29, 23, 0.2) 38%,
              rgba(8, 29, 23, 0.82) 100%
            );
        }

        .hh-about-hero-content {
          position: relative;
          z-index: 2;
          width: min(1240px, calc(100% - 80px));
          margin: 0 auto;
          padding: 150px 0 92px;
          color: #ffffff;
        }

        .hh-about-eyebrow {
          display: inline-block;
          margin-bottom: 22px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .hh-about-eyebrow-muted {
          color: rgba(255, 255, 255, 0.72);
        }

        .hh-about-hero h1 {
          max-width: 920px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(58px, 8.5vw, 118px);
          font-weight: 400;
          line-height: 0.94;
          letter-spacing: -0.055em;
        }

        .hh-about-hero h1 em {
          display: block;
          color: #d4ded6;
          font-weight: 400;
        }

        .hh-about-hero-description {
          max-width: 570px;
          margin: 34px 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 17px;
          line-height: 1.75;
        }

        .hh-about-hero-meta {
          position: absolute;
          z-index: 2;
          right: 40px;
          bottom: 38px;
          display: flex;
          gap: 28px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        /* =========================================
           INTRO
        ========================================= */

        .hh-about-intro {
          padding: 125px 0 120px;
        }

        .hh-about-intro-grid {
          display: grid;
          grid-template-columns: minmax(280px, 0.8fr) minmax(320px, 1.2fr);
          gap: 100px;
          align-items: start;
        }

        .hh-about-section-label {
          display: block;
          margin-bottom: 20px;
          color: #6d766f;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .hh-about-section-label-green {
          color: #547064;
        }

        .hh-about-intro h2,
        .hh-about-section-heading h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 5vw, 68px);
          font-weight: 400;
          line-height: 1.02;
          letter-spacing: -0.045em;
        }

        .hh-about-intro h2 em,
        .hh-about-section-heading h2 em {
          color: #718b7c;
          font-weight: 400;
        }

        .hh-about-intro-copy {
          max-width: 670px;
        }

        .hh-about-intro-copy .hh-about-lead {
          margin: 0 0 28px;
          color: #103d31;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(24px, 2.5vw, 34px);
          line-height: 1.35;
          letter-spacing: -0.025em;
        }

        .hh-about-intro-copy p:not(.hh-about-lead) {
          margin: 0 0 20px;
          color: #53605a;
          font-size: 16px;
          line-height: 1.85;
        }

        /* =========================================
           BRAND STATEMENT
        ========================================= */

        .hh-about-statement {
          padding: 0 0 125px;
        }

        .hh-about-statement-frame {
          position: relative;
          min-height: 620px;
          overflow: hidden;
          background: #173d32;
        }

        .hh-about-statement-image {
          position: absolute;
          inset: 0;
          background-image: url("/images/hikinhigh-about-destinations-bg.jpg");
          background-size: cover;
          background-position: center;
        }

        .hh-about-statement-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(9, 35, 27, 0.82) 0%,
              rgba(9, 35, 27, 0.48) 52%,
              rgba(9, 35, 27, 0.18) 100%
            );
        }

        .hh-about-statement-content {
          position: relative;
          z-index: 2;
          min-height: 620px;
          padding: 90px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: #ffffff;
        }

        .hh-about-statement-content h2 {
          max-width: 760px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(44px, 6vw, 78px);
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .hh-about-statement-content h2 em {
          color: #cbd8cf;
          font-weight: 400;
        }

        .hh-about-statement-content p {
          max-width: 590px;
          margin: 26px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 16px;
          line-height: 1.8;
        }

        /* =========================================
           WHAT WE DO
        ========================================= */

        .hh-about-services {
          padding: 0 0 125px;
        }

        .hh-about-section-heading {
          display: grid;
          grid-template-columns: minmax(280px, 0.85fr) minmax(300px, 0.7fr);
          justify-content: space-between;
          gap: 70px;
          align-items: end;
          padding-bottom: 55px;
          border-bottom: 1px solid rgba(16, 61, 49, 0.14);
        }

        .hh-about-section-heading > p {
          max-width: 470px;
          margin: 0;
          color: #53605a;
          font-size: 15px;
          line-height: 1.8;
        }

        .hh-about-service-list {
          border-bottom: 1px solid rgba(16, 61, 49, 0.14);
        }

        .hh-about-service-row {
          display: grid;
          grid-template-columns: 80px minmax(0, 1fr) 60px;
          gap: 30px;
          align-items: center;
          padding: 34px 0;
          border-bottom: 1px solid rgba(16, 61, 49, 0.14);
          color: #103d31;
          text-decoration: none;
          transition:
            padding 0.25s ease,
            background 0.25s ease;
        }

        .hh-about-service-row:last-child {
          border-bottom: 0;
        }

        .hh-about-service-row:hover {
          padding-left: 14px;
          padding-right: 14px;
          background: rgba(255, 255, 255, 0.34);
        }

        .hh-about-service-number {
          color: #78857d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .hh-about-service-main h3 {
          margin: 0 0 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(25px, 3vw, 36px);
          font-weight: 400;
          letter-spacing: -0.025em;
        }

        .hh-about-service-main p {
          max-width: 650px;
          margin: 0;
          color: #66716b;
          font-size: 14px;
          line-height: 1.7;
        }

        .hh-about-service-arrow {
          justify-self: end;
          font-size: 23px;
          font-weight: 300;
        }

        /* =========================================
           PHILOSOPHY
        ========================================= */

        .hh-about-philosophy {
          padding: 125px 0;
          background: #183f33;
          color: #ffffff;
        }

        .hh-about-philosophy-grid {
          display: grid;
          grid-template-columns: minmax(300px, 0.9fr) minmax(320px, 1.1fr);
          gap: 100px;
        }

        .hh-about-light-label {
          color: rgba(255, 255, 255, 0.56);
        }

        .hh-about-philosophy h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(44px, 5.5vw, 72px);
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .hh-about-philosophy h2 em {
          color: #c9d8cf;
          font-weight: 400;
        }

        .hh-about-philosophy-copy {
          max-width: 610px;
          padding-top: 42px;
        }

        .hh-about-philosophy-copy p {
          margin: 0 0 24px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 16px;
          line-height: 1.85;
        }

        .hh-about-philosophy-copy p:first-child {
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 26px;
          line-height: 1.4;
        }

        /* =========================================
           VALUES
        ========================================= */

        .hh-about-values {
          padding: 125px 0;
        }

        .hh-about-values-heading {
          display: block;
          padding-bottom: 55px;
        }

        .hh-about-values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(16, 61, 49, 0.14);
          border-bottom: 1px solid rgba(16, 61, 49, 0.14);
        }

        .hh-about-value {
          min-height: 290px;
          padding: 30px 28px 30px 0;
          border-right: 1px solid rgba(16, 61, 49, 0.14);
        }

        .hh-about-value:not(:first-child) {
          padding-left: 28px;
        }

        .hh-about-value:last-child {
          border-right: 0;
        }

        .hh-about-value-number {
          display: block;
          margin-bottom: 60px;
          color: #7b857f;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .hh-about-value h3 {
          margin: 0 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 27px;
          font-weight: 400;
          letter-spacing: -0.02em;
        }

        .hh-about-value p {
          margin: 0;
          color: #657069;
          font-size: 14px;
          line-height: 1.75;
        }

        /* =========================================
           FINAL CTA
        ========================================= */

        .hh-about-final {
          position: relative;
          min-height: 650px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: #173d32;
        }

        .hh-about-final-image {
          position: absolute;
          inset: 0;
          background-image: url("/images/cta-travel.jpg");
          background-size: cover;
          background-position: center;
        }

        .hh-about-final-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(8, 29, 23, 0.12) 0%,
              rgba(8, 29, 23, 0.76) 100%
            );
        }

        .hh-about-final-content {
          position: relative;
          z-index: 2;
          padding-top: 100px;
          padding-bottom: 90px;
          color: #ffffff;
        }

        .hh-about-final-content h2 {
          max-width: 800px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(48px, 7vw, 92px);
          font-weight: 400;
          line-height: 0.97;
          letter-spacing: -0.05em;
        }

        .hh-about-final-content h2 em {
          color: #cbd8cf;
          font-weight: 400;
        }

        .hh-about-final-content > p {
          max-width: 540px;
          margin: 28px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 16px;
          line-height: 1.8;
        }

        .hh-about-final-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 34px;
        }

        .hh-about-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 22px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .hh-about-button:hover {
          transform: translateY(-2px);
        }

        .hh-about-button-primary {
          border: 1px solid #ffffff;
          background: #ffffff;
          color: #173d32;
        }

        .hh-about-button-secondary {
          border: 1px solid rgba(255, 255, 255, 0.45);
          background: transparent;
          color: #ffffff;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 900px) {
          .hh-about-container {
            width: min(100% - 44px, 1240px);
          }

          .hh-about-hero-content {
            width: min(100% - 44px, 1240px);
          }

          .hh-about-hero {
            min-height: 680px;
          }

          .hh-about-hero-meta {
            right: 22px;
            bottom: 25px;
          }

          .hh-about-intro-grid,
          .hh-about-philosophy-grid {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .hh-about-section-heading {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .hh-about-statement-content {
            padding: 55px;
          }

          .hh-about-values-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hh-about-value {
            border-bottom: 1px solid rgba(16, 61, 49, 0.14);
          }

          .hh-about-value:nth-child(2) {
            border-right: 0;
          }

          .hh-about-value:nth-child(3),
          .hh-about-value:nth-child(4) {
            border-bottom: 0;
          }
        }

        @media (max-width: 640px) {
          .hh-about-container {
            width: calc(100% - 36px);
          }

          .hh-about-hero-content {
            width: calc(100% - 36px);
            padding-top: 120px;
            padding-bottom: 75px;
          }

          .hh-about-hero {
            min-height: 620px;
          }

          .hh-about-hero h1 {
            font-size: clamp(52px, 15vw, 76px);
          }

          .hh-about-hero-description {
            font-size: 15px;
          }

          .hh-about-hero-meta {
            display: none;
          }

          .hh-about-intro,
          .hh-about-services,
          .hh-about-values {
            padding-top: 85px;
            padding-bottom: 85px;
          }

          .hh-about-statement {
            padding-bottom: 85px;
          }

          .hh-about-statement-frame,
          .hh-about-statement-content {
            min-height: 540px;
          }

          .hh-about-statement-content {
            padding: 35px 28px;
          }

          .hh-about-statement-overlay {
            background:
              linear-gradient(
                180deg,
                rgba(9, 35, 27, 0.2) 0%,
                rgba(9, 35, 27, 0.82) 100%
              );
          }

          .hh-about-section-heading {
            padding-bottom: 35px;
          }

          .hh-about-service-row {
            grid-template-columns: 38px minmax(0, 1fr) 28px;
            gap: 12px;
            padding: 27px 0;
          }

          .hh-about-service-row:hover {
            padding-left: 8px;
            padding-right: 8px;
          }

          .hh-about-service-main h3 {
            font-size: 25px;
          }

          .hh-about-service-main p {
            font-size: 13px;
          }

          .hh-about-philosophy {
            padding: 85px 0;
          }

          .hh-about-philosophy-copy {
            padding-top: 0;
          }

          .hh-about-philosophy-copy p:first-child {
            font-size: 23px;
          }

          .hh-about-values-grid {
            grid-template-columns: 1fr;
          }

          .hh-about-value,
          .hh-about-value:not(:first-child) {
            min-height: auto;
            padding: 26px 0;
            border-right: 0;
            border-bottom: 1px solid rgba(16, 61, 49, 0.14);
          }

          .hh-about-value:last-child {
            border-bottom: 0;
          }

          .hh-about-value-number {
            margin-bottom: 35px;
          }

          .hh-about-final {
            min-height: 610px;
          }

          .hh-about-final-content {
            padding-top: 80px;
            padding-bottom: 70px;
          }

          .hh-about-final-content h2 {
            font-size: clamp(48px, 14vw, 70px);
          }

          .hh-about-final-content > p {
            font-size: 15px;
          }

          .hh-about-button {
            width: 100%;
          }
        }
      `}</style>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="hh-about-hero">
        <div className="hh-about-hero-image" />
        <div className="hh-about-hero-overlay" />

        <div className="hh-about-hero-content">
          <span className="hh-about-eyebrow hh-about-eyebrow-muted">
            ABOUT HIKINHIGH
          </span>

          <h1>
            Travel beyond
            <em>the itinerary.</em>
          </h1>

          <p className="hh-about-hero-description">
            Hikinhigh is a travel platform built around a simple idea:
            discovering the world should feel inspiring, effortless and
            personal.
          </p>
        </div>

        <div className="hh-about-hero-meta">
          <span>HIKINHIGH TRAVELS</span>
          <span>EST. 2026</span>
        </div>
      </section>

      {/* =========================================
          INTRO
      ========================================= */}

      <section className="hh-about-intro">
        <div className="hh-about-container hh-about-intro-grid">
          <div>
            <span className="hh-about-section-label hh-about-section-label-green">
              THE IDEA
            </span>

            <h2>
              Travel should feel
              <br />
              like an <em>invitation.</em>
            </h2>
          </div>

          <div className="hh-about-intro-copy">
            <p className="hh-about-lead">
              We created Hikinhigh to make the journey from inspiration to
              departure feel simpler.
            </p>

            <p>
              There are countless places to see, thousands of hotels to
              choose from and endless ways to experience a destination.
              Finding the right combination should not feel overwhelming.
            </p>

            <p>
              Hikinhigh brings together stays, journeys and experiences so
              travellers can explore what is possible and shape a trip around
              the way they actually want to travel.
            </p>

            <p>
              Sometimes that means a quiet escape. Sometimes it means taking
              the long road, climbing higher or discovering somewhere you
              have never been before.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          BRAND STATEMENT
      ========================================= */}

      <section className="hh-about-statement">
        <div className="hh-about-container">
          <div className="hh-about-statement-frame">
            <div className="hh-about-statement-image" />
            <div className="hh-about-statement-overlay" />

            <div className="hh-about-statement-content">
              <span className="hh-about-eyebrow hh-about-eyebrow-muted">
                OUR APPROACH
              </span>

              <h2>
                Less planning.
                <br />
                More <em>living.</em>
              </h2>

              <p>
                We believe the best travel platforms should disappear into
                the experience. They should make discovering, choosing and
                planning easier — then get out of the way when the journey
                begins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          WHAT WE DO
      ========================================= */}

      <section className="hh-about-services">
        <div className="hh-about-container">
          <div className="hh-about-section-heading">
            <div>
              <span className="hh-about-section-label hh-about-section-label-green">
                WHAT WE DO
              </span>

              <h2>
                Three ways to
                <br />
                make a journey <em>yours.</em>
              </h2>
            </div>

            <p>
              From where you sleep to where you go and what you experience
              along the way, Hikinhigh brings the essential parts of travel
              together in one place.
            </p>
          </div>

          <div className="hh-about-service-list">
            <Link
              href="/hotels"
              className="hh-about-service-row"
            >
              <span className="hh-about-service-number">01</span>

              <div className="hh-about-service-main">
                <h3>Stays</h3>

                <p>
                  Discover hotels, retreats and distinctive places to stay —
                  from comfortable escapes to memorable properties.
                </p>
              </div>

              <span className="hh-about-service-arrow">↗</span>
            </Link>

            <Link
              href="/packages"
              className="hh-about-service-row"
            >
              <span className="hh-about-service-number">02</span>

              <div className="hh-about-service-main">
                <h3>Journeys</h3>

                <p>
                  Explore thoughtfully planned itineraries that bring
                  destinations, stays and experiences together.
                </p>
              </div>

              <span className="hh-about-service-arrow">↗</span>
            </Link>

            <Link
              href="/adventures"
              className="hh-about-service-row"
            >
              <span className="hh-about-service-number">03</span>

              <div className="hh-about-service-main">
                <h3>Experiences</h3>

                <p>
                  Go beyond sightseeing with adventures, activities and
                  moments that make a destination come alive.
                </p>
              </div>

              <span className="hh-about-service-arrow">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          PHILOSOPHY
      ========================================= */}

      <section className="hh-about-philosophy">
        <div className="hh-about-container hh-about-philosophy-grid">
          <div>
            <span className="hh-about-section-label hh-about-light-label">
              OUR PHILOSOPHY
            </span>

            <h2>
              Go with curiosity.
              <br />
              Come back with
              <em> stories.</em>
            </h2>
          </div>

          <div className="hh-about-philosophy-copy">
            <p>
              Travel is not simply about reaching a destination.
            </p>

            <p>
              It is the view from a window in a place you have never visited.
              The road that was not on the original plan. A meal you still
              remember months later. A conversation with someone you would
              never have met at home.
            </p>

            <p>
              It is the unexpected moments between the places on the map.
              Those are the moments we want to make room for.
            </p>

            <p>
              Hikinhigh is built around that belief: plan enough to travel
              confidently, but leave enough space for discovery.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          VALUES
      ========================================= */}

      <section className="hh-about-values">
        <div className="hh-about-container">
          <div className="hh-about-values-heading">
            <span className="hh-about-section-label hh-about-section-label-green">
              WHAT MATTERS TO US
            </span>

            <h2>
              Built around the
              <br />
              <em>traveller.</em>
            </h2>
          </div>

          <div className="hh-about-values-grid">
            <article className="hh-about-value">
              <span className="hh-about-value-number">01</span>

              <h3>Discovery</h3>

              <p>
                Travel begins with curiosity. We want to make discovering new
                places feel exciting and effortless.
              </p>
            </article>

            <article className="hh-about-value">
              <span className="hh-about-value-number">02</span>

              <h3>Clarity</h3>

              <p>
                Good planning should feel simple. Information should help you
                make decisions, not make them harder.
              </p>
            </article>

            <article className="hh-about-value">
              <span className="hh-about-value-number">03</span>

              <h3>Experience</h3>

              <p>
                A destination is more than a photograph. The experiences
                along the way are what turn a trip into a memory.
              </p>
            </article>

            <article className="hh-about-value">
              <span className="hh-about-value-number">04</span>

              <h3>Freedom</h3>

              <p>
                There is no single right way to travel. Your journey should
                reflect your pace, interests and sense of adventure.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="hh-about-final">
        <div className="hh-about-final-image" />
        <div className="hh-about-final-overlay" />

        <div className="hh-about-container hh-about-final-content">
          <span className="hh-about-eyebrow hh-about-eyebrow-muted">
            YOUR NEXT CHAPTER
          </span>

          <h2>
            There is always
            <br />
            somewhere
            <em> new.</em>
          </h2>

          <p>
            Explore destinations, discover stays and find experiences that
            make you want to take the next journey.
          </p>

          <div className="hh-about-final-buttons">
            <Link
              href="/destinations"
              className="hh-about-button hh-about-button-primary"
            >
              Explore destinations →
            </Link>

            <Link
              href="/contact"
              className="hh-about-button hh-about-button-secondary"
            >
              Plan a journey
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}