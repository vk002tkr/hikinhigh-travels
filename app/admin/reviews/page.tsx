
"use client";

import { useMemo, useState } from "react";

type ReviewStatus = "Pending" | "Approved" | "Rejected";

type Review = {
  id: string;
  customer: string;
  email: string;
  packageName: string;
  destination: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
};

const initialReviews: Review[] = [
  {
    id: "REV-001",
    customer: "Aarav Sharma",
    email: "aarav@example.com",
    packageName: "Manali Mountain Escape",
    destination: "Manali, Himachal Pradesh",
    rating: 5,
    comment:
      "Amazing experience! The hotel, transportation and sightseeing arrangements were excellent. The team was helpful throughout the trip.",
    date: "2026-09-22",
    status: "Approved",
  },
  {
    id: "REV-002",
    customer: "Priya Verma",
    email: "priya@example.com",
    packageName: "Kashmir Paradise",
    destination: "Srinagar, Kashmir",
    rating: 5,
    comment:
      "Kashmir was beautiful and the itinerary was well planned. We especially loved the Dal Lake experience.",
    date: "2026-09-20",
    status: "Approved",
  },
  {
    id: "REV-003",
    customer: "Rahul Mehta",
    email: "rahul@example.com",
    packageName: "Rishikesh Weekend Adventure",
    destination: "Rishikesh, Uttarakhand",
    rating: 4,
    comment:
      "A fun weekend getaway. The campsite was nice and the arrangements were good. Check-in could have been a little faster.",
    date: "2026-09-18",
    status: "Pending",
  },
  {
    id: "REV-004",
    customer: "Neha Kapoor",
    email: "neha@example.com",
    packageName: "Romantic Bali Retreat",
    destination: "Bali, Indonesia",
    rating: 5,
    comment:
      "A memorable holiday! Everything was organised beautifully, and the resort was wonderful.",
    date: "2026-09-16",
    status: "Approved",
  },
  {
    id: "REV-005",
    customer: "Karan Singh",
    email: "karan@example.com",
    packageName: "Spiti Valley Expedition",
    destination: "Spiti Valley, Himachal Pradesh",
    rating: 2,
    comment:
      "The destination was amazing, but the travel schedule was difficult and communication about pickup timings was not clear.",
    date: "2026-09-14",
    status: "Pending",
  },
  {
    id: "REV-006",
    customer: "Ananya Gupta",
    email: "ananya@example.com",
    packageName: "Luxury Dubai Experience",
    destination: "Dubai, UAE",
    rating: 1,
    comment:
      "The experience did not meet my expectations. I would like the support team to contact me regarding the arrangements.",
    date: "2026-09-12",
    status: "Rejected",
  },
  {
    id: "REV-007",
    customer: "Rohan Malhotra",
    email: "rohan@example.com",
    packageName: "Manali Mountain Escape",
    destination: "Manali, Himachal Pradesh",
    rating: 4,
    comment:
      "Great mountain views and a comfortable hotel. Overall, a good trip for families.",
    date: "2026-09-10",
    status: "Pending",
  },
  {
    id: "REV-008",
    customer: "Simran Kaur",
    email: "simran@example.com",
    packageName: "Kashmir Paradise",
    destination: "Srinagar, Kashmir",
    rating: 5,
    comment:
      "Wonderful hospitality and breathtaking views. I would happily recommend this package.",
    date: "2026-09-08",
    status: "Approved",
  },
];

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredReviews = useMemo(() => {
    const term = search.toLowerCase().trim();

    return reviews.filter((review) => {
      const matchesSearch =
        review.customer.toLowerCase().includes(term) ||
        review.email.toLowerCase().includes(term) ||
        review.packageName.toLowerCase().includes(term) ||
        review.destination.toLowerCase().includes(term) ||
        review.id.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || review.status === statusFilter;

      const matchesRating =
        ratingFilter === "All" || review.rating === Number(ratingFilter);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, search, statusFilter, ratingFilter]);

  const pendingCount = reviews.filter(
    (review) => review.status === "Pending"
  ).length;

  const approvedCount = reviews.filter(
    (review) => review.status === "Approved"
  ).length;

  const averageRating = reviews.length
    ? (
        reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  function updateStatus(review: Review, status: ReviewStatus) {
    setReviews((current) =>
      current.map((item) =>
        item.id === review.id ? { ...item, status } : item
      )
    );

    setSelectedReview((current) =>
      current?.id === review.id ? { ...current, status } : current
    );
  }

  function deleteReview(review: Review) {
    if (
      window.confirm(
        `Are you sure you want to delete the review by ${review.customer}?`
      )
    ) {
      setReviews((current) =>
        current.filter((item) => item.id !== review.id)
      );

      if (selectedReview?.id === review.id) {
        setSelectedReview(null);
        setShowDetails(false);
      }
    }
  }

  const statusClasses: Record<ReviewStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[#f7f9f8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7">
          <p className="mb-1 text-sm font-medium text-emerald-700">
            Management / Reviews
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Reviews Management
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Review customer feedback and manage publication status.
          </p>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Reviews"
            value={reviews.length}
            icon="▤"
            color="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Pending Reviews"
            value={pendingCount}
            icon="◷"
            color="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Approved Reviews"
            value={approvedCount}
            icon="✓"
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            label="Average Rating"
            value={`${averageRating} / 5`}
            icon="★"
            color="bg-purple-50 text-purple-700"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Customer Reviews
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Showing {filteredReviews.length} of {reviews.length} reviews
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[650px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customer or package..."
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={ratingFilter}
                onChange={(event) => setRatingFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-gray-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Package</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Review</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="transition hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                          {review.customer
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.customer}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {review.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {review.packageName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {review.destination}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div
                        className="whitespace-nowrap text-amber-500"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {"★".repeat(review.rating)}
                        <span className="text-gray-200">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {review.rating}/5
                      </p>
                    </td>

                    <td className="max-w-[230px] px-5 py-4">
                      <p className="line-clamp-2 text-sm leading-5 text-gray-600">
                        {review.comment}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {formatDate(review.date)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${statusClasses[review.status]}`}
                      >
                        {review.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setShowDetails(true);
                          }}
                          className="rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                        </button>

                        {review.status !== "Approved" && (
                          <button
                            onClick={() => updateStatus(review, "Approved")}
                            title="Approve review"
                            className="rounded-lg px-2.5 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                          >
                            Approve
                          </button>
                        )}

                        {review.status !== "Rejected" && (
                          <button
                            onClick={() => updateStatus(review, "Rejected")}
                            title="Reject review"
                            className="rounded-lg px-2.5 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                          >
                            Reject
                          </button>
                        )}

                        <button
                          onClick={() => deleteReview(review)}
                          title="Delete review"
                          className="rounded-lg px-2.5 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredReviews.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="text-3xl">⭐</div>
                      <p className="mt-3 font-semibold text-gray-800">
                        No reviews found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDetails && selectedReview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDetails(false);
              setSelectedReview(null);
            }
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Review Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedReview.id}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedReview(null);
                }}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 hover:bg-gray-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                  {selectedReview.customer
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selectedReview.customer}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedReview.email}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  {selectedReview.packageName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedReview.destination}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-lg tracking-wide text-amber-500">
                    {"★".repeat(selectedReview.rating)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - selectedReview.rating)}
                    </span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedReview.date)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Customer Feedback</h4>
                <p className="mt-2 text-sm leading-7 text-gray-600">
                  {selectedReview.comment}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Review Status
                </p>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses[selectedReview.status]}`}
                >
                  {selectedReview.status}
                </span>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
                {selectedReview.status !== "Approved" && (
                  <button
                    onClick={() => updateStatus(selectedReview, "Approved")}
                    className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Approve Review
                  </button>
                )}

                {selectedReview.status !== "Rejected" && (
                  <button
                    onClick={() => updateStatus(selectedReview, "Rejected")}
                    className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    Reject Review
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedReview(null);
                  }}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
