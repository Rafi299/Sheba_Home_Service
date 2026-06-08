import { Link } from "react-router-dom";

const fallbackImage =
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";

function CategoryCard({ category }) {
  const imageUrl = category.image || category.bannerImage || fallbackImage;
  const serviceCount = category.services?.length || 0;

  return (
    <Link
      to={`/services/${category.slug}`}
      className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-emerald-100 to-slate-200">
        <img
          src={imageUrl}
          alt={category.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>

        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="text-2xl font-black text-white">{category.title}</h3>
          <p className="mt-1 text-sm text-white/80">
            {serviceCount} services available
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className="mb-5 leading-7 text-slate-600">
          {category.shortDescription}
        </p>

        <span className="font-bold text-emerald-600 group-hover:text-emerald-700">
          View Services →
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;