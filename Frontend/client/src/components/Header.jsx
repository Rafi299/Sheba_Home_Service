import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "font-bold text-emerald-600"
      : "font-medium text-slate-700 hover:text-emerald-600";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="container-custom flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 font-black text-white">
            S
          </div>

          <div>
            <h1 className="text-2xl font-black leading-none text-slate-950">
              Sheba
            </h1>
            <p className="text-xs text-slate-500">Home Service</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>

          <NavLink to="/blog" className={navLinkClass}>
            Blog
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-600"
          >
            Cart

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <span className="hidden font-bold text-slate-700 sm:inline">
                Hi, {user?.name}
              </span>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="rounded-xl border border-emerald-200 px-5 py-3 font-bold text-emerald-700 hover:bg-emerald-50"
                >
                  Dashboard
                </Link>
              )}
              {user?.role !== "admin" && (
  <Link
    to="/my-bookings"
    className="rounded-xl border border-emerald-200 px-5 py-3 font-bold text-emerald-700 hover:bg-emerald-50"
  >
    My Bookings
  </Link>
)}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;