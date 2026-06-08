import { useEffect, useState } from "react";

import CategoryCard from "../components/CategoryCard";
import SectionTitle from "../components/SectionTitle";
import api from "../services/api";

const servicesBanner =
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80";

function Services() {
  const [searchText, setSearchText] = useState("");
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await api.get("/services");

        setServiceCategories(response.data.categories || []);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Failed to load service categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCategories();
  }, []);

  const filteredServices = serviceCategories.filter((category) => {
    const value = searchText.toLowerCase();

    return (
      category.title?.toLowerCase().includes(value) ||
      category.shortDescription?.toLowerCase().includes(value)
    );
  });

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="absolute inset-0">
          <img
            src={servicesBanner}
            alt="Home service tools banner"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-slate-950/75"></div>
        </div>

        <div className="container-custom relative text-center">
          <p className="mb-4 font-bold text-emerald-400">Services</p>

          <h1 className="text-5xl font-black tracking-tight text-white">
            Find the right service
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Browse service categories and book the service you need.
          </p>
        </div>
      </section>

      <section className="container-custom py-20">
        <SectionTitle
          label="All Categories"
          title="Our service categories"
          description="Search and choose from available home service categories."
        />

        <div className="mx-auto mb-10 max-w-2xl">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search services..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm outline-none focus:border-emerald-500"
          />
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <h3 className="text-2xl font-black text-slate-900">
              Loading services...
            </h3>
          </div>
        )}

        {!loading && message && (
          <div className="rounded-3xl bg-red-50 p-10 text-center shadow-sm ring-1 ring-red-200">
            <h3 className="text-2xl font-black text-red-700">{message}</h3>
          </div>
        )}

        {!loading && !message && filteredServices.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((category) => (
              <CategoryCard
                key={category._id || category.id}
                category={category}
              />
            ))}
          </div>
        ) : null}

        {!loading && !message && filteredServices.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <h3 className="text-2xl font-black text-slate-900">
              No service found
            </h3>
            <p className="mt-2 text-slate-600">
              Try searching with another keyword.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default Services;