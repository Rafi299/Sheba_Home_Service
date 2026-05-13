import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      end: true,
    },
    {
      path: "/admin/users",
      label: "Clients",
      end: false,
    },
  ];

  const navClass = ({ isActive }) =>
    isActive
      ? "block rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white"
      : "block rounded-xl px-4 py-3 font-semibold text-slate-300 hover:bg-slate-800 hover:text-white";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 bg-slate-950 p-6 text-white lg:block">
        <Link to="/" className="mb-10 block">
          <h2 className="text-3xl font-black text-emerald-400">Sheba</h2>
          <p className="text-sm text-slate-400">Admin Panel</p>
        </Link>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={navClass}
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            to="/"
            className="block rounded-xl px-4 py-3 font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Visit Website
          </Link>
        </nav>
      </aside>

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                Admin Panel
              </p>
              <h1 className="text-xl font-black text-slate-900">
                Welcome, {user?.name}
              </h1>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/"
                className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
              >
                Website
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </div>

            <button
              onClick={() => setIsOpen((previous) => !previous)}
              className="rounded-xl border border-slate-200 p-2 lg:hidden"
              aria-label="Toggle admin menu"
            >
              <span className="block h-0.5 w-6 bg-slate-800"></span>
              <span className="my-1.5 block h-0.5 w-6 bg-slate-800"></span>
              <span className="block h-0.5 w-6 bg-slate-800"></span>
            </button>
          </div>

          {isOpen && (
            <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
              <nav className="space-y-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "block rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white"
                        : "block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Visit Website
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white"
                >
                  Logout
                </button>
              </nav>
            </div>
          )}
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;