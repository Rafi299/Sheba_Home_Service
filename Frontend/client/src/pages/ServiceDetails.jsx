import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import SectionTitle from "../components/SectionTitle";
import ServiceCard from "../components/ServiceCard";
import api from "../services/api";

// ─── Star display helper ──────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="flex gap-0.5 text-lg">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-yellow-400" : "text-slate-300"}>
          ★
        </span>
      ))}
    </span>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function ServiceDetails() {
  const { slug } = useParams();

  const [serviceCategory, setServiceCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const fetchServiceCategory = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await api.get(`/services/${slug}`);

        setServiceCategory(response.data.category);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Failed to load service details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCategory();
  }, [slug]);

  // Fetch reviews once we have the category ID
  useEffect(() => {
    if (!serviceCategory?._id) return;

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await api.get(
          `/bookings/reviews/service/${serviceCategory._id}`
        );

        setReviews(response.data.reviews || []);
        setAverageRating(response.data.averageRating || 0);
        setTotalReviews(response.data.totalReviews || 0);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [serviceCategory]);

  if (loading) {
    return (
      <section className="container-custom py-24 text-center">
        <h1 className="text-4xl font-black text-slate-900">Loading service...</h1>
      </section>
    );
  }

  if (!serviceCategory) {
    return (
      <section className="container-custom py-24 text-center">
        <h1 className="text-4xl font-black text-slate-900">Service not found</h1>

        <p className="mt-4 text-slate-600">
          {message || "The service category you are looking for does not exist."}
        </p>

        <Link
          to="/services"
          className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
        >
          Back to Services
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* ── Hero Banner ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="absolute inset-0">
          <img
            src={serviceCategory.bannerImage}
            alt={serviceCategory.title}
            className="h-full w-full object-cover opacity-30"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/50"></div>
        </div>

        <div className="container-custom relative">
          <Link
            to="/services"
            className="mb-6 inline-flex font-bold text-emerald-300 hover:text-emerald-200"
          >
            ← Back to Services
          </Link>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white">
            {serviceCategory.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {serviceCategory.description}
          </p>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="container-custom py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {(serviceCategory.features || []).map((feature) => (
            <div
              key={feature}
              className="rounded-3xl bg-white p-5 text-center font-bold text-slate-800 shadow-sm ring-1 ring-slate-200"
            >
              ✓ {feature}
            </div>
          ))}
        </div>
      </section>

      {/* ── Service Options ─────────────────────────────────────────────────── */}
      <section className="container-custom pb-20">
        <SectionTitle
          label="Available Options"
          title={`Choose your ${serviceCategory.title}`}
          description="Select a service option and add it to your cart."
        />

        {serviceCategory.services?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceCategory.services.map((service) => (
              <ServiceCard
                key={service._id || service.id}
                service={service}
                category={serviceCategory}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <h3 className="text-2xl font-black text-slate-900">
              No service options available
            </h3>
            <p className="mt-2 text-slate-600">Please check again later.</p>
          </div>
        )}
      </section>

      {/* ── Customer Reviews ────────────────────────────────────────────────── */}
      <section className="container-custom pb-24">
        <SectionTitle
          label="Customer Reviews"
          title="What our customers say"
          description="Honest reviews from verified customers who used this service."
        />

        {/* Rating summary */}
        {totalReviews > 0 && (
          <div className="mb-8 flex items-center gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-center">
              <p className="text-5xl font-black text-slate-900">{averageRating}</p>
              <Stars rating={Math.round(averageRating)} />
              <p className="mt-1 text-sm text-slate-500">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}

        {reviewsLoading ? (
          <p className="text-slate-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-bold text-slate-700">No reviews yet</p>
            <p className="mt-2 text-slate-500">
              Be the first to review after completing this service!
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{review.customerName}</p>
                    <p className="text-xs text-slate-400">{review.serviceTitle}</p>
                  </div>
                  <Stars rating={review.review.rating} />
                </div>

                {review.review.comment && (
                  <p className="text-sm leading-relaxed text-slate-600">
                    {review.review.comment}
                  </p>
                )}

                <p className="mt-3 text-xs text-slate-400">
                  {new Date(review.review.reviewedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default ServiceDetails;