import { useMemo, useState } from "react";

import UserTable from "../../components/admin/UserTable";
import { useAuth } from "../../context/AuthContext";

function AdminUsers() {
  const {
    users,
    toggleUserBlock,
    deleteUser,
    markUserLoggedOut,
  } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const clients = users.filter((user) => user.role === "customer");

  const filteredClients = useMemo(() => {
    const searchValue = searchText.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchValue) ||
        client.email.toLowerCase().includes(searchValue) ||
        client.phone.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "online" && client.isLoggedIn && !client.isBlocked) ||
        (statusFilter === "offline" && !client.isLoggedIn && !client.isBlocked) ||
        (statusFilter === "blocked" && client.isBlocked);

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchText, statusFilter]);

  return (
    <div>
      <div className="mb-8">
        <p className="font-bold text-emerald-600">Clients</p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
          Manage Clients
        </h1>
        <p className="mt-2 text-slate-600">
          View registered clients, login status and control user access.
        </p>
      </div>

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
          <option value="all">All Clients</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <UserTable
        users={filteredClients}
        onToggleBlock={toggleUserBlock}
        onDeleteUser={deleteUser}
        onLogoutUser={markUserLoggedOut}
      />
    </div>
  );
}

export default AdminUsers;