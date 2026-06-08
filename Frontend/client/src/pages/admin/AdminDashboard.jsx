import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StatCard from "../../components/admin/StatCard";
import UserTable from "../../components/admin/UserTable";
import api from "../../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    paidBookings: 0,
    pendingPayments: 0,
    unpaidBookings: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [usersResponse, statsResponse] = await Promise.all([
        api.get("/users"),
        api.get("/bookings/admin/stats"),
      ]);

      setUsers(usersResponse.data.users || []);
      setStats(statsResponse.data.stats || {});
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      await api.put(`/users/${userId}/block`, {
        isBlocked: !currentStatus,
      });

      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const clients = users.filter((item) => item.role === "user");
  const blockedClients = clients.filter((item) => item.isBlocked);
  const activeClients = clients.filter((item) => !item.isBlocked);

  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <p className="font-bold text-slate-700">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-bold text-emerald-600">Overview</p>
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Monitor users, bookings, payments, and revenue.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="rounded-xl bg-emerald-600 px-5 py-3 text-center font-bold text-white hover:bg-emerald-700"
        >
          Manage Users
        </Link>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl bg-red-50 px-5 py-4 font-semibold text-red-700">
          {message}
        </div>
      )}

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={clients.length}
          description="All registered user accounts."
        />

        <StatCard
          title="Active Users"
          value={activeClients.length}
          description="Users who can login and book services."
        />

        <StatCard
          title="Blocked Users"
          value={blockedClients.length}
          description="Users blocked by admin."
        />

        <StatCard
          title="Total Revenue"
          value={`${stats.totalRevenue || 0} BDT`}
          description="Revenue from paid bookings."
        />
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings || 0}
          description="All booking requests."
        />

        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings || 0}
          description="Bookings waiting for admin action."
        />

        <StatCard
          title="Completed Bookings"
          value={stats.completedBookings || 0}
          description="Successfully completed bookings."
        />

        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments || 0}
          description="bKash/Nagad payments waiting verification."
        />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Recent Users
            </h2>
            <p className="mt-1 text-slate-500">
              Latest registered user accounts.
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
  onToggleBlock={(userId) => {
    const targetUser = users.find((item) => item._id === userId);
    if (targetUser) {
      handleToggleBlock(userId, targetUser.isBlocked);
    }
  }}
  onDeleteUser={handleDeleteUser}
/>
      </div>
    </div>
  );
}

export default AdminDashboard;