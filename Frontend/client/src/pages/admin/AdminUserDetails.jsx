import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function formatDate(value) {
  if (!value) {
    return "Never";
  }

  return new Date(value).toLocaleString();
}

function AdminUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    users,
    toggleUserBlock,
    deleteUser,
    markUserLoggedOut,
  } = useAuth();

  const selectedUser = users.find((user) => user.id === id);

  if (!selectedUser) {
    return (
      <section className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            Client not found
          </h1>

          <p className="mt-3 text-slate-600">
            The client you are looking for does not exist.
          </p>

          <Link
            to="/admin/users"
            className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Back to Clients
          </Link>
        </div>
      </section>
    );
  }

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedUser.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    deleteUser(selectedUser.id);
    navigate("/admin/users");
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/admin/users"
          className="mb-4 inline-flex font-bold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Clients
        </Link>

        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
          Client Details
        </h1>

        <p className="mt-2 text-slate-600">
          View and control this client account.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100 text-3xl font-black text-emerald-700">
              {selectedUser.name.charAt(0).toUpperCase()}
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
                ) : selectedUser.isLoggedIn ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Online
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    Offline
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Phone</p>
              <h3 className="mt-1 font-black text-slate-900">
                {selectedUser.phone}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Role</p>
              <h3 className="mt-1 font-black capitalize text-slate-900">
                {selectedUser.role}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Registered</p>
              <h3 className="mt-1 font-black text-slate-900">
                {formatDate(selectedUser.createdAt)}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Last Login</p>
              <h3 className="mt-1 font-black text-slate-900">
                {formatDate(selectedUser.lastLogin)}
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
              onClick={() => toggleUserBlock(selectedUser.id)}
              className={`w-full rounded-xl px-5 py-3 font-bold ${
                selectedUser.isBlocked
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {selectedUser.isBlocked ? "Unblock Client" : "Block Client"}
            </button>

            <button
              onClick={() => markUserLoggedOut(selectedUser.id)}
              disabled={!selectedUser.isLoggedIn}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Force Logout
            </button>

            <button
              onClick={handleDelete}
              className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
            >
              Delete Client
            </button>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Blocking a client stops them from logging in. Force logout only
            changes demo login status in frontend localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminUserDetails;