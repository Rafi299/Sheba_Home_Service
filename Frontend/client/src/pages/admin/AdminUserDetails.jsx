import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString();
}

function AdminUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { data } = await api.get(`/users/${id}`);

      setSelectedUser(data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    try {
      await api.put(`/users/${id}/block`, {
        isBlocked: !selectedUser.isBlocked,
      });

      fetchUserDetails();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user status");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedUser.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      navigate("/admin/users");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <p className="font-bold text-slate-700">Loading user details...</p>
      </div>
    );
  }

  if (!selectedUser || message) {
    return (
      <section className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            User not found
          </h1>

          <p className="mt-3 text-slate-600">
            {message || "The user you are looking for does not exist."}
          </p>

          <Link
            to="/admin/users"
            className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Back to Users
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/admin/users"
          className="mb-4 inline-flex font-bold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Users
        </Link>

        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
          User Details
        </h1>

        <p className="mt-2 text-slate-600">
          View and control this user account.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100 text-3xl font-black text-emerald-700">
              {selectedUser.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-900">
                {selectedUser.name}
              </h2>

              <p className="text-slate-500">{selectedUser.email}</p>

              <div className="mt-3">
                {selectedUser.isBlocked ? (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                    Blocked
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Phone</p>
              <h3 className="mt-1 font-black text-slate-900">
                {selectedUser.phone || "N/A"}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Role</p>
              <h3 className="mt-1 font-black capitalize text-slate-900">
                {selectedUser.role}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 md:col-span-2">
              <p className="text-sm font-bold text-slate-500">Address</p>
              <h3 className="mt-1 font-black text-slate-900">
                {selectedUser.address || "N/A"}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Registered</p>
              <h3 className="mt-1 font-black text-slate-900">
                {formatDate(selectedUser.createdAt)}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Updated</p>
              <h3 className="mt-1 font-black text-slate-900">
                {formatDate(selectedUser.updatedAt)}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-5 text-2xl font-black text-slate-900">
            Admin Actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={handleToggleBlock}
              className={`w-full rounded-xl px-5 py-3 font-bold ${
                selectedUser.isBlocked
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {selectedUser.isBlocked ? "Unblock User" : "Block User"}
            </button>

            <button
              onClick={handleDelete}
              className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
            >
              Delete User
            </button>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Blocking a user stops them from logging in. Admin account cannot
            block or delete itself from the backend.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminUserDetails;