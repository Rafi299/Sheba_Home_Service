import { Link } from "react-router-dom";

function PaymentFailed() {
  return (
    <section className="container-custom grid min-h-[70vh] place-items-center py-20 text-center">
      <div className="max-w-xl rounded-[36px] bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-red-100 text-4xl text-red-500">
          !
        </div>

        <h1 className="text-4xl font-black text-slate-900">
          Payment Failed
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Something went wrong with your payment. Please try again or choose
          cash after service.
        </p>

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