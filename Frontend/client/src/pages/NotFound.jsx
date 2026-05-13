import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="container-custom grid min-h-[70vh] place-items-center py-20 text-center">
      <div>
        <h1 className="text-8xl font-black text-emerald-600">404</h1>

        <h2 className="mt-4 text-4xl font-black text-slate-900">
          Page not found
        </h2>

        <p className="mt-4 text-slate-600">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;