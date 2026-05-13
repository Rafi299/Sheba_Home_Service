import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (event) => {
    setFormData((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setIsError(false);

      const response = await api.post("/users/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("storage"));

      setMessage(response.data.message || "Login successful");
      setIsError(false);

      setTimeout(() => {
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }, 700);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 py-20">
      <div className="container-custom">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="text-center">
            <p className="font-bold text-emerald-600">Welcome Back</p>

            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Login
            </h1>

            <p className="mt-3 text-slate-600">
              Login to manage your bookings and services.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-bold text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-5 rounded-2xl px-4 py-3 text-center font-semibold ${
                isError
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-slate-600">
            Do not have an account?{" "}
            <Link to="/register" className="font-bold text-emerald-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;