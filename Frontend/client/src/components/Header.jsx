import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

import { FaShoppingCart, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "font-bold text-emerald-600 block"
      : "font-medium text-slate-700 hover:text-emerald-600 block";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="container-custom flex min-h-[80px] items-center justify-between px-3 sm:px-0">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-emerald-600 font-black text-white">
            S
          </div>

          <div>
            <h1 className="text-lg sm:text-2xl font-black leading-none text-slate-950">
              Sheba
            </h1>
            <p className="text-xs text-slate-500">Home Service</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/services" className={navLinkClass}>Services</NavLink>
          <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        {/* Right Side (Desktop Only) */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-600"
          >
            <FaShoppingCart />
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

              {user?.role === "admin" ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 rounded-xl border border-emerald-200 px-5 py-3 font-bold text-emerald-700 hover:bg-emerald-50"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-2 rounded-xl border border-emerald-200 px-5 py-3 font-bold text-emerald-700 hover:bg-emerald-50"
                >
                  <FaClipboardList />
                  My Bookings
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600"
              >
                <FaSignOutAlt />
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-slate-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          
          <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/services" className={navLinkClass} onClick={() => setMenuOpen(false)}>Services</NavLink>
          <NavLink to="/blog" className={navLinkClass} onClick={() => setMenuOpen(false)}>Blog</NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={() => setMenuOpen(false)}>Contact</NavLink>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 font-bold"
          >
            <FaShoppingCart />
            Cart ({cartCount})
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role !== "admin" && (
                <Link
                  to="/my-bookings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 font-bold"
                >
                  <FaClipboardList />
                  My Bookings
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="font-bold"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 text-red-500 font-bold"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="font-bold text-emerald-600"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;