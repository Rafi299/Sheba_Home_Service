import { useEffect, useMemo, useState } from "react";

import UserTable from "../../components/admin/UserTable";
import api from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { data } = await api.get("/users");

      setUsers(data.users || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const targetUser = users.find((user) => user._id === userId);

      if (!targetUser) {
        return;
      }

      await api.put(`/users/${userId}/block`, {
        isBlocked: !targetUser.isBlocked,
      });

      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const clients = users.filter((user) => user.role === "user");

  const filteredClients = useMemo(() => {
    const searchValue = searchText.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        client.name?.toLowerCase().includes(searchValue) ||
        client.email?.toLowerCase().includes(searchValue) ||
        client.phone?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !client.isBlocked) ||
        (statusFilter === "blocked" && client.isBlocked);

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchText, statusFilter]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <p className="font-bold text-slate-700">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="font-bold text-emerald-600">Users</p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
          Manage Users
        </h1>
        <p className="mt-2 text-slate-600">
          View registered users and control account access.
        </p>
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
          placeholder="Search by name, email or phone..."
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <UserTable
        users={filteredClients}
        onToggleBlock={handleToggleBlock}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}

export default AdminUsers;