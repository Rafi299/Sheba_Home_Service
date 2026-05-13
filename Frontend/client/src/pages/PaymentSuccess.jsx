import { Link, useLocation } from "react-router-dom";

function PaymentSuccess() {
  const location = useLocation();

  const {
    bookingId = "SHB-DEMO",
    total = 0,
    paymentMethod = "cash",
  } = location.state || {};

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
          Your booking has been placed successfully. Our team will contact you
          soon.
        </p>

        <div className="my-8 rounded-2xl bg-slate-50 p-5 text-left">
          <p className="flex justify-between gap-4 py-2">
            <span className="text-slate-500">Booking ID</span>
            <span className="font-bold text-slate-900">{bookingId}</span>
          </p>

          <p className="flex justify-between gap-4 py-2">
            <span className="text-slate-500">Payment Method</span>
            <span className="font-bold capitalize text-slate-900">
              {paymentMethod}
            </span>
          </p>

          <p className="flex justify-between gap-4 py-2">
            <span className="text-slate-500">Total</span>
            <span className="font-bold text-slate-900">৳{total}</span>
          </p>
        </div>

        <Link
          to="/services"
          className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
        >
          Book More Services
        </Link>
      </div>
    </section>
  );
}

export default PaymentSuccess;