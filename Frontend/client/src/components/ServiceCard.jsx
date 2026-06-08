import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const fallbackImage =
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";

function ServiceCard({ service, category }) {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const serviceId = service._id || service.id;
  const serviceTitle = service.title || service.name || "Service";
  const serviceImage =
    service.image || category?.image || category?.bannerImage || fallbackImage;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please login first to add service to cart.");
      navigate("/login");
      return;
    }

    const cartItem = {
      id: serviceId,
      serviceId: serviceId,
      categoryId: category?._id || category?.id,
      categorySlug: category?.slug,
      categoryTitle: category?.title,
      title: serviceTitle,
      description: service.description || "",
      price: service.price || 0,
      duration: service.duration || "",
      image: serviceImage,
      quantity: 1,
    };

    const result = addToCart(cartItem);

    if (!result.success) {
      alert(result.message);
      return;
    }

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="h-40 overflow-hidden bg-gradient-to-br from-emerald-100 to-slate-200">
          <img
            src={serviceImage}
            alt={serviceTitle}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
          />
        </div>

        <div className="p-6">
          <p className="font-bold text-emerald-600">{category?.title}</p>

          <h3 className="mt-2 text-2xl font-black text-slate-900">
            {serviceTitle}
          </h3>

          <p className="mt-3 text-slate-600">
            {service.description || "Professional home service support."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {service.duration && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                {service.duration}
              </span>
            )}

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              Service warranty
            </span>
          </div>

          <div className="mt-5 text-3xl font-black text-slate-950">
            ৳{service.price || 0}
            <span className="text-base font-normal text-slate-500">
              {" "}
              / service
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
            >
              Add
            </button>

            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className="rounded-xl border border-slate-200 px-5 py-3 text-center font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-600"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {isDetailsOpen && (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-slate-950/70 px-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsDetailsOpen(false)}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-slate-100 font-black text-slate-700 hover:bg-red-100 hover:text-red-600"
            >
              ×
            </button>

            <img
              src={serviceImage}
              alt={serviceTitle}
              className="h-72 w-full rounded-3xl object-cover"
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
              }}
            />

            <div className="mt-6">
              <p className="font-bold text-emerald-600">{category?.title}</p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                {serviceTitle}
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                {service.description || "Professional home service support."}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-bold text-slate-500">Price</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">
                    ৳{service.price || 0}
                  </h3>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-bold text-slate-500">Duration</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">
                    {service.duration || "N/A"}
                  </h3>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-emerald-50 p-5">
                <h3 className="font-black text-slate-900">
                  Service Includes
                </h3>

                <ul className="mt-3 space-y-2 text-slate-600">
                  <li>✓ Expert service provider</li>
                  <li>✓ Doorstep service</li>
                  <li>✓ Clear pricing</li>
                  <li>✓ Admin booking confirmation</li>
                </ul>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    setIsDetailsOpen(false);
                  }}
                  className="rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white hover:bg-emerald-700"
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-4 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ServiceCard;