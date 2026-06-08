import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const bookingStatuses = ["all", "pending", "confirmed", "processing", "completed", "cancelled"];

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

// ─── Star Rating Component ────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-3xl leading-none focus:outline-none"
        >
          <span className={(hovered || value) >= star ? "text-yellow-400" : "text-slate-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ booking, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post(`/bookings/${booking._id}/review`, { rating, comment });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-1 text-2xl font-black text-slate-900">Write a Review</h2>
        <p className="mb-6 text-sm text-slate-500">{booking.serviceTitle}</p>

        <div className="mb-5">
          <p className="mb-2 font-bold text-slate-700">Your Rating</p>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-bold text-slate-700">
            Comment <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function MyBookings() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { data } = await api.get("/bookings/my-bookings");

      setBookings(data.bookings || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [isAuthenticated]);

  const filteredBookings = useMemo(() => {
    const value = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        booking.serviceTitle?.toLowerCase().includes(value) ||
        booking.serviceCategoryTitle?.toLowerCase().includes(value) ||
        booking.transactionId?.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchText, statusFilter]);

  const handleCancelBooking = async (bookingId) => {
    const reason = window.prompt("Why do you want to cancel this booking?");

    if (reason === null) return;

    try {
      await api.patch(`/bookings/${bookingId}/cancel`, {
        cancellationReason: reason,
      });

      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleDownloadInvoice = async (booking) => {
    try {
      const response = await api.get(`/bookings/${booking._id}/invoice`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `booking-invoice-${booking._id}.pdf`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.URL.revokeObjectURL(fileUrl), 3000);
    } catch (error) {
      console.error("Invoice download error:", error);
    }
  };

  // Helper: can this booking be reviewed?
  const canReview = (booking) =>
    booking.status === "completed" &&
    booking.paymentStatus === "paid" &&
    !(booking.review && booking.review.rating);

  // Helper: render filled stars
  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= rating ? "text-yellow-400" : "text-slate-300"}>
        ★
      </span>
    ));

  if (loading) {
    return (
      <section className="container-custom py-20">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <p className="font-bold text-slate-700">Loading your bookings...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-custom py-16">
      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={fetchBookings}
        />
      )}

      <div className="mb-8">
        <p className="font-bold text-emerald-600">My Bookings</p>
        <h1 className="text-4xl font-black text-slate-900">Your Booking History</h1>
        <p className="mt-2 text-slate-600">
          Track your bookings, payment status and download invoices.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl bg-red-50 px-5 py-4 font-semibold text-red-700">
          {message}
        </div>
      )}

      <div className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1fr_220px]">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by service or transaction ID..."
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        >
          {bookingStatuses.map((status) => (
            <option key={status} value={status}>
              {status === "all" ? "All Status" : status}
            </option>
          ))}
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <h3 className="text-2xl font-black text-slate-900">No bookings found</h3>
          <p className="mt-2 text-slate-500">You have not placed any matching bookings yet.</p>

          <Link
            to="/services"
            className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-900">
                      {booking.serviceTitle}
                    </h2>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                      {booking.status}
                    </span>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold capitalize text-emerald-700">
                      Payment: {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="grid gap-4 text-sm text-slate-600 md:grid-cols-2">
                    <p>
                      <span className="font-bold text-slate-900">Category:</span>{" "}
                      {booking.serviceCategoryTitle}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Date & Time:</span>{" "}
                      {booking.bookingDate}, {booking.bookingTime}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Quantity:</span>{" "}
                      {booking.quantity}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Total:</span>{" "}
                      {booking.totalAmount} BDT
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Payment Method:</span>{" "}
                      {booking.paymentMethod}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Transaction ID:</span>{" "}
                      {booking.transactionId || "N/A"}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Created:</span>{" "}
                      {formatDate(booking.createdAt)}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Booking ID:</span>{" "}
                      {booking._id}
                    </p>
                  </div>

                  {booking.note && (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <span className="font-bold text-slate-900">Note:</span> {booking.note}
                    </div>
                  )}

                  {booking.adminNote && (
                    <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                      <span className="font-bold">Admin Note:</span> {booking.adminNote}
                    </div>
                  )}

                  {booking.cancellationReason && (
                    <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                      <span className="font-bold">Cancellation Reason:</span>{" "}
                      {booking.cancellationReason}
                    </div>
                  )}

                  {/* ─── Show existing review ─────────────────────────── */}
                  {booking.review && booking.review.rating && (
                    <div className="mt-4 rounded-2xl bg-yellow-50 p-4">
                      <p className="mb-1 font-bold text-slate-800">Your Review</p>
                      <div className="flex text-lg">{renderStars(booking.review.rating)}</div>
                      {booking.review.comment && (
                        <p className="mt-2 text-sm text-slate-600">{booking.review.comment}</p>
                      )}
                      <p className="mt-1 text-xs text-slate-400">
                        Reviewed on {formatDate(booking.review.reviewedAt)}
                      </p>
                    </div>
                  )}
                  {/* ──────────────────────────────────────────────────── */}
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(booking)}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800"
                  >
                    Download Invoice
                  </button>

                  {/* ─── Write Review button ──────────────────────────── */}
                  {canReview(booking) && (
                    <button
                      type="button"
                      onClick={() => setReviewBooking(booking)}
                      className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-slate-900 hover:bg-yellow-300"
                    >
                      ★ Write Review
                    </button>
                  )}
                  {/* ──────────────────────────────────────────────────── */}

                  {booking.status !== "completed" &&
                    booking.status !== "cancelled" &&
                    booking.paymentStatus !== "paid" && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(booking._id)}
                        className="w-full rounded-xl bg-red-100 px-4 py-3 font-bold text-red-600 hover:bg-red-200"
                      >
                        Cancel Booking
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyBookings;