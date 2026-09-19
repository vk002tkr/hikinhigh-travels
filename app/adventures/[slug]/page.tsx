"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type ItineraryDay = {
  day: string;
  title: string;
  description: string;
};

type AdventureDetail = {
  name: string;
  slug: string;
  location: string;
  duration: string;
  price: string;
  image: string;
  description: string;
  category: string;
  difficulty: string;
  bestFor: string;
  groupSize: string;
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  notes: string[];
};

const adventureDetails: AdventureDetail[] = [
  {
    name: "Himalayan Trekking",
    slug: "himalayan-trekking",
    location: "Himachal Pradesh",
    duration: "3–6 Days",
    price: "₹8,500",
    image: "/images/adventure-trekking.jpg",
    description:
      "Walk deeper into the mountains through pine forests, quiet villages, high trails and unforgettable Himalayan landscapes.",
    category: "Trekking",
    difficulty: "Moderate",
    bestFor: "Nature lovers & active travellers",
    groupSize: "4–12 travellers",
    itinerary: [
      {
        day: "01",
        title: "Into the mountains",
        description:
          "Meet your trek team, leave the busy roads behind and begin the journey through forest trails and mountain villages.",
      },
      {
        day: "02",
        title: "Forest trails & open valleys",
        description:
          "A full day on the trail through pine forests, open meadows and changing mountain landscapes.",
      },
      {
        day: "03",
        title: "Higher ground",
        description:
          "Continue towards higher terrain with panoramic views and time to experience the quieter side of the Himalayas.",
      },
      {
        day: "04",
        title: "The long way back",
        description:
          "Descend gradually through scenic trails and return towards the valley after one final mountain morning.",
      },
    ],
    included: [
      "Experienced local trek leader",
      "Accommodation during the trek",
      "Breakfast and selected meals",
      "Local transfers during the experience",
      "Basic first-aid support",
    ],
    notIncluded: [
      "Personal expenses",
      "Travel insurance",
      "Meals not mentioned",
      "Personal trekking equipment",
    ],
    notes: [
      "Fitness level should be suitable for moderate walking.",
      "Weather can affect the final itinerary.",
      "Guests should carry suitable walking shoes and warm layers.",
    ],
  },
  {
    name: "River Rafting",
    slug: "river-rafting",
    location: "Rishikesh",
    duration: "Half Day",
    price: "₹2,500",
    image: "/images/adventure-rafting.jpg",
    description:
      "Take on the rapids of the Ganga with experienced guides, mountain scenery and an experience built around the river.",
    category: "Water",
    difficulty: "Moderate",
    bestFor: "Adventure seekers",
    groupSize: "4–16 travellers",
    itinerary: [
      {
        day: "01",
        title: "Meet the river",
        description:
          "Meet the rafting team, receive a safety briefing and prepare for the river before heading to the launch point.",
      },
      {
        day: "02",
        title: "Rapids & river bends",
        description:
          "Spend the main part of the experience navigating rapids, calmer stretches and the dramatic landscapes around the Ganga.",
      },
    ],
    included: [
      "Professional rafting guide",
      "Safety briefing",
      "Rafting equipment",
      "Life jacket and helmet",
      "Local transfers to the river point",
    ],
    notIncluded: [
      "Personal expenses",
      "Travel to Rishikesh",
      "Meals",
      "Personal photographs or videos",
    ],
    notes: [
      "Activity is subject to river and weather conditions.",
      "Guests must follow the guide's safety instructions.",
      "Minimum age and participation requirements may apply.",
    ],
  },
  {
    name: "Mountain Camping",
    slug: "mountain-camping",
    location: "Manali",
    duration: "2 Days / 1 Night",
    price: "₹4,500",
    image: "/images/adventure-camping.jpg",
    description:
      "Leave the city behind for a night beneath the mountains, with open skies, campfire evenings and fresh mountain air.",
    category: "Camping",
    difficulty: "Easy",
    bestFor: "Couples, families & first-time campers",
    groupSize: "2–12 travellers",
    itinerary: [
      {
        day: "01",
        title: "Arrive & slow down",
        description:
          "Reach the campsite, settle into your accommodation and spend the afternoon exploring the surrounding landscape.",
      },
      {
        day: "02",
        title: "Morning in the mountains",
        description:
          "Wake up to mountain views, enjoy breakfast and take a short nature walk before departing.",
      },
    ],
    included: [
      "Campsite accommodation",
      "Breakfast",
      "Evening refreshments",
      "Campfire where conditions permit",
      "Local activity coordinator",
    ],
    notIncluded: [
      "Personal expenses",
      "Travel to Manali",
      "Lunch and dinner unless specified",
      "Personal equipment",
    ],
    notes: [
      "Campfire availability depends on local conditions.",
      "Mountain weather can change quickly.",
      "Guests should carry warm clothing.",
    ],
  },
  {
    name: "Ladakh Expedition",
    slug: "ladakh-expedition",
    location: "Ladakh",
    duration: "5–8 Days",
    price: "₹18,500",
    image: "/images/adventure-ladakh.jpg",
    description:
      "Cross dramatic high-altitude landscapes, remote valleys and ancient mountain passes on a journey through Ladakh.",
    category: "Expedition",
    difficulty: "Challenging",
    bestFor: "Experienced mountain travellers",
    groupSize: "4–10 travellers",
    itinerary: [
      {
        day: "01",
        title: "Arrive in Ladakh",
        description:
          "Arrive and allow your body time to adjust to the altitude before beginning the expedition.",
      },
      {
        day: "02",
        title: "Valleys & monasteries",
        description:
          "Explore the surrounding landscape and cultural landmarks while continuing the acclimatisation process.",
      },
      {
        day: "03",
        title: "Into the high country",
        description:
          "Begin travelling deeper into the mountains through dramatic valleys and high-altitude terrain.",
      },
      {
        day: "04",
        title: "Across the passes",
        description:
          "A demanding expedition day featuring some of the region's most spectacular mountain landscapes.",
      },
      {
        day: "05",
        title: "Remote horizons",
        description:
          "Continue across remote terrain before beginning the return journey.",
      },
    ],
    included: [
      "Expedition coordinator",
      "Accommodation",
      "Selected meals",
      "Local transportation",
      "Basic first-aid support",
    ],
    notIncluded: [
      "Flights",
      "Personal expenses",
      "Travel insurance",
      "Meals not mentioned",
    ],
    notes: [
      "High-altitude travel requires appropriate acclimatisation.",
      "The itinerary may change due to road or weather conditions.",
      "Travel insurance with suitable adventure coverage is recommended.",
    ],
  },
  {
    name: "Snow Adventure",
    slug: "snow-adventure",
    location: "Gulmarg",
    duration: "1–2 Days",
    price: "₹6,500",
    image: "/images/adventure-snow.jpg",
    description:
      "Experience Kashmir in winter with snow activities, mountain views and the spectacular landscapes around Gulmarg.",
    category: "Snow",
    difficulty: "Easy",
    bestFor: "Families, couples & winter travellers",
    groupSize: "2–12 travellers",
    itinerary: [
      {
        day: "01",
        title: "Into the snow",
        description:
          "Arrive in Gulmarg and spend the day experiencing the winter landscape and available snow activities.",
      },
      {
        day: "02",
        title: "Mountain morning",
        description:
          "Enjoy a relaxed morning surrounded by snow-covered mountains before departing for the next destination.",
      },
    ],
    included: [
      "Local experience coordinator",
      "Selected activity equipment",
      "Local transfers",
      "Breakfast where applicable",
    ],
    notIncluded: [
      "Travel to Gulmarg",
      "Personal expenses",
      "Meals not mentioned",
      "Optional activities",
    ],
    notes: [
      "Snow conditions vary by season.",
      "Activities depend on weather and local operating conditions.",
      "Warm waterproof clothing is strongly recommended.",
    ],
  },
  {
    name: "Forest Escape",
    slug: "forest-escape",
    location: "Uttarakhand",
    duration: "2–3 Days",
    price: "₹7,500",
    image: "/images/adventure-forest.jpg",
    description:
      "A slower adventure through forests, mountain trails and peaceful Himalayan settlements away from the crowds.",
    category: "Nature",
    difficulty: "Easy",
    bestFor: "Slow travellers & nature lovers",
    groupSize: "2–10 travellers",
    itinerary: [
      {
        day: "01",
        title: "Into the forest",
        description:
          "Arrive at your mountain stay, settle in and take an easy walk through the surrounding forest trails.",
      },
      {
        day: "02",
        title: "The quiet trail",
        description:
          "Spend the day exploring forest paths, viewpoints and nearby mountain settlements at an unhurried pace.",
      },
      {
        day: "03",
        title: "One last morning",
        description:
          "Enjoy breakfast surrounded by nature before beginning your journey home.",
      },
    ],
    included: [
      "Mountain accommodation",
      "Breakfast",
      "Local nature walk",
      "Local coordinator",
      "Selected transfers",
    ],
    notIncluded: [
      "Travel to Uttarakhand",
      "Personal expenses",
      "Lunch and dinner",
      "Travel insurance",
    ],
    notes: [
      "This experience is designed around a slower pace.",
      "Walking routes may change according to local conditions.",
      "Comfortable walking shoes are recommended.",
    ],
  },
];

export default function AdventureDetailPage() {
  const params = useParams();

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : "";

  const adventure = adventureDetails.find(
    (item) => item.slug === slug
  );

  if (!adventure) {
    return (
      <main className="adventure-detail-page">
        <div className="adventure-not-found">
          <span>ADVENTURE NOT FOUND</span>

          <h1>
            This journey
            <br />
            <em>isn't here.</em>
          </h1>

          <Link
            href="/adventures"
            className="adventure-detail-button"
          >
            Back to adventures
            <span>↗</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="adventure-detail-page">
      {/* HEADER */}
      <header className="adventure-detail-header">
        <div className="adventure-detail-header-inner">
          <Link
            href="/"
            className="adventure-detail-logo"
          >
            <span>HIKINHIGH</span>
            <small>TRAVELS</small>
          </Link>

          <nav className="adventure-detail-nav">
            <Link href="/destinations">
              Destinations
            </Link>

            <Link href="/hotels">
              Hotels
            </Link>

            <Link href="/packages">
              Packages
            </Link>

            <Link
              href="/adventures"
              className="active"
            >
              Adventures
            </Link>

            <Link href="/about">
              About
            </Link>
          </nav>

          <div className="adventure-detail-actions">
            <Link href="/login">
              Login
            </Link>

            <Link
              href="/register"
              className="join"
            >
              Join us
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="adventure-detail-hero">
        <img
          src={adventure.image}
          alt={adventure.name}
        />

        <div className="adventure-detail-hero-overlay" />

        <div className="adventure-detail-hero-content">
          <Link
            href="/adventures"
            className="adventure-back-link"
          >
            ← All adventures
          </Link>

          <span className="adventure-detail-kicker">
            {adventure.category}
          </span>

          <h1>
            {adventure.name}
          </h1>

          <p>
            {adventure.location}
          </p>
        </div>

        <div className="adventure-detail-hero-index">
          HIKINHIGH / EXPERIENCE
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="adventure-facts">
        <div className="adventure-facts-inner">
          <div>
            <span>LOCATION</span>
            <strong>{adventure.location}</strong>
          </div>

          <div>
            <span>DURATION</span>
            <strong>{adventure.duration}</strong>
          </div>

          <div>
            <span>DIFFICULTY</span>
            <strong>{adventure.difficulty}</strong>
          </div>

          <div>
            <span>FROM</span>
            <strong>{adventure.price}</strong>
          </div>
        </div>
      </section>

      {/* EXPERIENCE INTRO */}
      <section className="adventure-detail-intro">
        <div className="adventure-detail-intro-label">
          THE EXPERIENCE
        </div>

        <div className="adventure-detail-intro-content">
          <h2>
            Go beyond the
            <br />
            <em>usual route.</em>
          </h2>

          <p>
            {adventure.description}
          </p>

          <div className="adventure-intro-extra">
            <div>
              <span>BEST FOR</span>
              <strong>{adventure.bestFor}</strong>
            </div>

            <div>
              <span>GROUP SIZE</span>
              <strong>{adventure.groupSize}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ITINERARY */}
      <section className="adventure-itinerary">
        <div className="adventure-itinerary-heading">
          <span>THE JOURNEY</span>

          <h2>
            How the
            <br />
            <em>days unfold.</em>
          </h2>
        </div>

        <div className="adventure-itinerary-list">
          {adventure.itinerary.map(
            (item) => (
              <div
                className="adventure-itinerary-item"
                key={`${adventure.slug}-${item.day}`}
              >
                <div className="adventure-day-number">
                  {item.day}
                </div>

                <div className="adventure-day-content">
                  <h3>{item.title}</h3>

                  <p>
                    {item.description}
                  </p>
                </div>

                <div className="adventure-day-arrow">
                  +
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* INCLUDED */}
      <section className="adventure-included">
        <div className="adventure-included-column">
          <span className="adventure-detail-section-label">
            INCLUDED
          </span>

          <h2>
            Everything
            <br />
            <em>you need.</em>
          </h2>

          <ul>
            {adventure.included.map(
              (item) => (
                <li key={item}>
                  <span>+</span>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="adventure-included-column excluded">
          <span className="adventure-detail-section-label">
            NOT INCLUDED
          </span>

          <h2>
            Keep in
            <br />
            <em>mind.</em>
          </h2>

          <ul>
            {adventure.notIncluded.map(
              (item) => (
                <li key={item}>
                  <span>—</span>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </section>

      {/* IMPORTANT INFORMATION */}
      <section className="adventure-notes">
        <div>
          <span className="adventure-detail-section-label">
            BEFORE YOU GO
          </span>

          <h2>
            A few things
            <br />
            <em>to know.</em>
          </h2>
        </div>

        <div className="adventure-notes-list">
          {adventure.notes.map(
            (note, index) => (
              <div key={note}>
                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <p>{note}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="adventure-booking">
        <div className="adventure-booking-content">
          <span>
            READY TO GO?
          </span>

          <h2>
            Your next
            <br />
            <em>story starts here.</em>
          </h2>

          <p>
            Starting from{" "}
            <strong>{adventure.price}</strong>{" "}
            per person.
          </p>

          <Link
            href={`/contact?adventure=${adventure.slug}`}
            className="adventure-detail-button"
          >
            Plan this adventure
            <span>↗</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="adventure-detail-footer">
        <div className="adventure-detail-footer-top">
          <div>
            <Link
              href="/"
              className="adventure-footer-logo"
            >
              HIKINHIGH
            </Link>

            <p>
              Travel further.
              <br />
              Remember more.
            </p>
          </div>

          <div className="adventure-footer-links">
            <span>EXPLORE</span>

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
          </div>

          <div className="adventure-footer-links">
            <span>COMPANY</span>

            <Link href="/about">
              About Us
            </Link>

            <Link href="/contact">
              Contact
            </Link>

            <Link href="/faq">
              FAQ
            </Link>
          </div>

          <div className="adventure-footer-links">
            <span>LEGAL</span>

            <Link href="/privacy-policy">
              Privacy Policy
            </Link>

            <Link href="/terms-conditions">
              Terms & Conditions
            </Link>
          </div>
        </div>

        <div className="adventure-detail-footer-bottom">
          <span>
            © {new Date().getFullYear()} Hikinhigh Travels
          </span>

          <span>
            MADE FOR THE CURIOUS
          </span>
        </div>
      </footer>
    </main>
  );
}