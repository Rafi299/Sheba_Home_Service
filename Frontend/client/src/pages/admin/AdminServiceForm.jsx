import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const emptyServiceOption = {
  title: "",
  description: "",
  price: "",
  duration: "",
  image: "",
};

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function AdminServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: "",
    bannerImage: "",
    features: "",
    isAvailable: true,
  });

  const [services, setServices] = useState([{ ...emptyServiceOption }]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchCategory = async () => {
    try {
      setFetching(true);

      const { data } = await api.get(`/services/admin/${id}`);
      const category = data.category;

      setFormData({
        title: category.title || "",
        slug: category.slug || "",
        shortDescription: category.shortDescription || "",
        description: category.description || "",
        image: category.image || "",
        bannerImage: category.bannerImage || "",
        features: (category.features || []).join(", "),
        isAvailable: Boolean(category.isAvailable),
      });

      setServices(
        category.services?.length
          ? category.services.map((service) => ({
              title: service.title || "",
              description: service.description || "",
              price: service.price || "",
              duration: service.duration || "",
              image: service.image || "",
            }))
          : [{ ...emptyServiceOption }]
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load service");
      setIsError(true);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title" && !isEditMode) {
        updated.slug = createSlug(value);
      }

      return updated;
    });
  };

  const handleServiceChange = (index, event) => {
    const { name, value } = event.target;

    setServices((previous) =>
      previous.map((service, serviceIndex) =>
        serviceIndex === index
          ? {
              ...service,
              [name]: value,
            }
          : service
      )
    );
  };

  const addServiceOption = () => {
    setServices((previous) => [...previous, { ...emptyServiceOption }]);
  };

  const removeServiceOption = (index) => {
    setServices((previous) => {
      if (previous.length === 1) {
        return previous;
      }

      return previous.filter((_, serviceIndex) => serviceIndex !== index);
    });
  };

  const uploadImage = async (file, fieldName) => {
    if (!file) {
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const { data } = await api.post("/upload/image", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((previous) => ({
        ...previous,
        [fieldName]: data.image.url,
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Image upload failed");
    }
  };

  const uploadServiceImage = async (file, index) => {
    if (!file) {
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const { data } = await api.post("/upload/image", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setServices((previous) =>
        previous.map((service, serviceIndex) =>
          serviceIndex === index
            ? {
                ...service,
                image: data.image.url,
              }
            : service
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Image upload failed");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setIsError(false);

      const payload = {
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        description: formData.description,
        image: formData.image,
        bannerImage: formData.bannerImage,
        features: formData.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        services: services.map((service) => ({
          ...service,
          price: Number(service.price),
        })),
        isAvailable: formData.isAvailable,
      };

      if (isEditMode) {
        await api.put(`/services/${id}`, payload);
        setMessage("Service category updated successfully");
      } else {
        await api.post("/services", payload);
        setMessage("Service category created successfully");
      }

      setIsError(false);

      setTimeout(() => {
        navigate("/admin/services");
      }, 700);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <p className="font-bold text-slate-700">Loading service form...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/admin/services"
          className="mb-4 inline-flex font-bold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Services
        </Link>

        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
          {isEditMode ? "Edit Service Category" : "Add Service Category"}
        </h1>

        <p className="mt-2 text-slate-600">
          Manage category details, images, features and service options.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-2xl px-5 py-4 font-semibold ${
            isError
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-5 text-2xl font-black text-slate-900">
            Category Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold text-slate-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-700">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-slate-700">
                Short Description
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-700">
                Category Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  uploadImage(event.target.files?.[0], "image")
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-700">
                Banner Image URL
              </label>
              <input
                type="text"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleChange}
                className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  uploadImage(event.target.files?.[0], "bannerImage")
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-slate-700">
                Features
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Expert technician, Affordable price, Fast booking"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />
              <p className="mt-2 text-sm text-slate-500">
                Separate features with comma.
              </p>
            </div>

            <label className="flex items-center gap-3 font-bold text-slate-700">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="h-5 w-5"
              />
              Service category is active
            </label>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-slate-900">
              Service Options
            </h2>

            <button
              type="button"
              onClick={addServiceOption}
              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Add Option
            </button>
          </div>

          <div className="space-y-5">
            {services.map((service, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-black text-slate-900">
                    Option {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeServiceOption(index)}
                    className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-bold text-slate-700">
                      Service Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={service.title}
                      onChange={(event) => handleServiceChange(index, event)}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-slate-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={service.price}
                      onChange={(event) => handleServiceChange(index, event)}
                      required
                      min="0"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-slate-700">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={service.duration}
                      onChange={(event) => handleServiceChange(index, event)}
                      placeholder="1 hour"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-slate-700">
                      Service Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={service.image}
                      onChange={(event) => handleServiceChange(index, event)}
                      className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        uploadServiceImage(event.target.files?.[0], index)
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block font-bold text-slate-700">
                      Service Description
                    </label>
                    <textarea
                      name="description"
                      value={service.description}
                      onChange={(event) => handleServiceChange(index, event)}
                      required
                      rows="3"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Service"
            : "Create Service"}
        </button>
      </form>
    </div>
  );
}

export default AdminServiceForm;