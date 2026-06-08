import { Link, useSearchParams } from "react-router-dom";

const reasonMessages = {
  payment_failed: "Your payment was not completed. Please try again.",
  validation_failed: "Payment validation failed. Please contact support if amount was deducted.",
  invalid_status: "Payment returned an invalid status. Please try again.",
  cancelled: "You cancelled the payment. You can try again anytime.",
  server_error: "A server error occurred. Please contact support if needed.",
};

function PaymentFailed() {
  const [searchParams] = useSearchParams();

  const reason = searchParams.get("reason");
  const bookingId = searchParams.get("bookingId");

  const message =
    reasonMessages[reason] ||
    "Something went wrong while placing your booking. Please try again or choose cash after service.";

  return (
    <section className="container-custom grid min-h-[70vh] place-items-center py-20 text-center">
      <div className="max-w-xl rounded-[36px] bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-red-100 text-4xl text-red-500">
          ✕
        </div>

        <h1 className="text-4xl font-black text-slate-900">
          {reason === "cancelled" ? "Payment Cancelled" : "Payment Failed"}
        </h1>

        <p className="mt-4 leading-7 text-slate-600">{message}</p>

        {bookingId && (
          <div className="my-6 rounded-2xl bg-slate-50 p-4 text-left">
            <p className="flex justify-between gap-4">
              <span className="text-slate-500">Booking ID</span>
              <span className="break-all text-right font-bold text-slate-900">
                {bookingId}
              </span>
            </p>

            <p className="mt-3 text-sm text-slate-500">
              This booking has been recorded with a failed payment status. You
              can contact support with this ID.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/checkout"
            className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Try Again
          </Link>

          <Link
            to="/services"
            className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PaymentFailed;