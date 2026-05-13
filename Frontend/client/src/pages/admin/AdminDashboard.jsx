import { Link } from "react-router-dom";

import StatCard from "../../components/admin/StatCard";
import UserTable from "../../components/admin/UserTable";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const {
    users,
    toggleUserBlock,
    deleteUser,
    markUserLoggedOut,
  } = useAuth();

  const clients = users.filter((user) => user.role === "customer");
  const onlineClients = clients.filter((user) => user.isLoggedIn);
  const blockedClients = clients.filter((user) => user.isBlocked);
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-bold text-emerald-600">Overview</p>
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Monitor registered clients and their login activity.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="rounded-xl bg-emerald-600 px-5 py-3 text-center font-bold text-white hover:bg-emerald-700"
        >
          Manage Clients
        </Link>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={clients.length}
          description="All registered customer accounts."
        />

        <StatCard
          title="Online Clients"
          value={onlineClients.length}
          description="Clients currently marked as logged in."
        />

        <StatCard
          title="Blocked Clients"
          value={blockedClients.length}
          description="Clients blocked by admin."
        />

        <StatCard
          title="Active Clients"
          value={clients.length - blockedClients.length}
          description="Clients who can login and book services."
        />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Recent Clients
            </h2>
            <p className="mt-1 text-slate-500">
              Latest registered customer accounts.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="font-bold text-emerald-600 hover:text-emerald-700"
          >
            View All →
          </Link>
        </div>

        <UserTable
          users={recentClients}
          onToggleBlock={toggleUserBlock}
          onDeleteUser={deleteUser}
          onLogoutUser={markUserLoggedOut}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;