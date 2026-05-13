import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ServiceCard({ service, category }) {
  const { addToCart } = useCart();

  const serviceId = service._id || service.id;

const handleAddToCart = () => {
  const cartItem = {
    id: serviceId,
    serviceId: serviceId,
    categoryId: category?._id || category?.id,
    categorySlug: category?.slug,
    categoryTitle: category?.title,
    title: service.title,
    description: service.description,
    price: service.price,
    duration: service.duration,
    image: service.image,
    quantity: 1,
  };

  addToCart(cartItem);

  window.dispatchEvent(new Event("cartUpdated"));
};

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      <img
        src={service.image}
        alt={service.title}
        className="h-40 w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />

      <div className="p-6">
        <p className="font-bold text-emerald-600">{category?.title}</p>

        <h3 className="mt-2 text-2xl font-black text-slate-900">
          {service.title}
        </h3>

        <p className="mt-3 text-slate-600">{service.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {service.duration && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              {service.duration}
            </span>
          )}

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
            Warranty:
          </span>
        </div>

        <div className="mt-5 text-3xl font-black text-slate-950">
          ৳{service.price}
          <span className="text-base font-normal text-slate-500"> /</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Add
          </button>

          <Link
            to={`/services/${category?.slug}`}
            className="rounded-xl border border-slate-200 px-5 py-3 text-center font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-600"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;