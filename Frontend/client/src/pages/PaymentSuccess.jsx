import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import api from "../services/api";

function PaymentSuccess() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // ── SSLCommerz redirects with ?bookingId= in URL ──
  const bookingIdFromUrl = searchParams.get("bookingId");
  const isRiskTransaction = searchParams.get("risk") === "true";

  // ── Cash payment uses location.state ──
  const stateData = location.state || {};

  const [booking, setBooking] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  // If came from SSLCommerz, fetch booking details from backend
  useEffect(() => {
    if (bookingIdFromUrl) {
      setLoadingBooking(true);
      api
        .get(`/bookings/${bookingIdFromUrl}`)
        .then(({ data }) => {
          if (data.success) {
            setBooking(data.booking);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingBooking(false));
    }
  }, [bookingIdFromUrl]);

  // ── Resolve display values ──
  const bookingId = bookingIdFromUrl || stateData.bookingId || "N/A";
  const total = booking?.totalAmount || stateData.total || 0;
  const paymentMethod = booking?.paymentMethod || stateData.paymentMethod || "cash";
  const bookingCount = stateData.bookingCount || 1;
  const paymentStatus = booking?.paymentStatus || null;

  const isSSLCommerz =
    paymentMethod === "bkash" ||
    paymentMethod === "nagad" ||
    paymentMethod === "card";

  return (
    <section className="container-custom grid min-h-[70vh] place-items-center py-20 text-center">
      <div className="max-w-xl rounded-[36px] bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
          ✓
        </div>

        <h1 className="text-4xl font-black text-slate-900">
          Booking Successful
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Your booking has been placed successfully. Our team will review it and
          contact you soon.
        </p>

        <div className="my-8 rounded-2xl bg-slate-50 p-5 text-left">
          <p className="flex justify-between gap-4 py-2">
            <span className="text-slate-500">Booking ID</span>
            <span className="break-all text-right font-bold text-slate-900">
              {loadingBooking ? "Loading..." : bookingId}
            </span>
          </p>

          {!bookingIdFromUrl && (
            <p className="flex justify-between gap-4 py-2">
              <span className="text-slate-500">Total Bookings</span>
              <span className="font-bold text-slate-900">{bookingCount}</span>
            </p>
          )}

          <p className="flex justify-between gap-4 py-2">
            <span className="text-slate-500">Payment Method</span>
            <span className="font-bold capitalize text-slate-900">
              {loadingBooking ? "Loading..." : paymentMethod}
            </span>
          </p>

          {paymentStatus && (
            <p className="flex justify-between gap-4 py-2">
              <span className="text-slate-500">Payment Status</span>
              <span
                className={`font-bold capitalize ${
                  paymentStatus === "paid"
                    ? "text-emerald-600"
                    : "text-yellow-600"
                }`}
              >
                {paymentStatus}
              </span>
            </p>
          )}

          <p className="flex justify-between gap-4 py-2">
            <span className="text-slate-500">Total</span>
            <span className="font-bold text-slate-900">
              {loadingBooking ? "Loading..." : `৳${total}`}
            </span>
          </p>
        </div>

        {isSSLCommerz && paymentStatus === "paid" && !isRiskTransaction && (
          <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-left text-sm font-semibold text-emerald-700">
            ✅ Your payment was successful and has been confirmed.
          </div>
        )}

        {isSSLCommerz && paymentStatus === "paid" && isRiskTransaction && (
          <div className="mb-6 rounded-2xl bg-amber-50 p-4 text-left text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
            ⚠️ Payment succeeded with risk flags. Our admin panel will review the verification shortly.
          </div>
        )}

        {isSSLCommerz && paymentStatus === "pending" && (
          <div className="mb-6 rounded-2xl bg-yellow-50 p-4 text-left text-sm font-semibold text-yellow-700">
            ⏳ Your payment is being verified. Admin will update your payment
            status shortly.
          </div>
        )}

        {paymentMethod === "cash" && (
          <div className="mb-6 rounded-2xl bg-blue-50 p-4 text-left text-sm font-semibold text-blue-700">
            💵 You selected Cash after service. Please pay when the service is
            completed.
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/my-bookings"
            className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            My Bookings
          </Link>

          <Link
            to="/services"
            className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            Book More Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PaymentSuccess;