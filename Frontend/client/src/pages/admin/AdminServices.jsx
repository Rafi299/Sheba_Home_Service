import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminServices() {
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { data } = await api.get("/services/admin/all");

      setCategories(data.categories || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load service categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/services/${categoryId}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete service");
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await api.put(`/services/${category._id}`, {
        isAvailable: !category.isAvailable,
      });

      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const value = searchText.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        category.title?.toLowerCase().includes(value) ||
        category.slug?.toLowerCase().includes(value) ||
        category.shortDescription?.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isAvailable) ||
        (statusFilter === "inactive" && !category.isAvailable);

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchText, statusFilter]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <p className="font-bold text-slate-700">Loading services...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-bold text-emerald-600">Services</p>
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
            Manage Services
          </h1>
          <p className="mt-2 text-slate-600">
            Add, edit, delete and control service categories.
          </p>
        </div>

        <Link
          to="/admin/services/new"
          className="rounded-xl bg-emerald-600 px-5 py-3 text-center font-bold text-white hover:bg-emerald-700"
        >
          Add New Service
        </Link>
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
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by title, slug or description..."
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        >
          <option value="all">All Services</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <h3 className="text-2xl font-black text-slate-900">
            No service found
          </h3>
          <p className="mt-2 text-slate-500">
            No service matched your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="grid gap-5 lg:grid-cols-[180px_1fr_auto]">
                <img
                  src={category.image || category.bannerImage}
                  alt={category.title}
                  className="h-36 w-full rounded-2xl object-cover lg:w-44"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-900">
                      {category.title}
                    </h2>

                    {category.isAvailable ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-slate-500">
                    /{category.slug}
                  </p>

                  <p className="mt-3 text-slate-600">
                    {category.shortDescription}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(category.services || []).map((service) => (
                      <span
                        key={service._id}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
                      >
                        {service.title} - {service.price} BDT
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:flex-col">
                  <Link
                    to={`/admin/services/${category._id}/edit`}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-800"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleToggleStatus(category)}
                    className={`rounded-xl px-4 py-3 text-sm font-bold ${
                      category.isAvailable
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                  >
                    {category.isAvailable ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => handleDelete(category._id)}
                    className="rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminServices;