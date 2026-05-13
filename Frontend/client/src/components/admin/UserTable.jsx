import { Link } from "react-router-dom";

function UserStatusBadge({ user }) {
  if (user.isBlocked) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
        Blocked
      </span>
    );
  }

  if (user.isLoggedIn) {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
        Online
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
      Offline
    </span>
  );
}

function formatDate(value) {
  if (!value) {
    return "Never";
  }

  return new Date(value).toLocaleString();
}

function UserActions({ user, onToggleBlock, onDeleteUser, onLogoutUser }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to={`/admin/users/${user.id}`}
        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
      >
        View
      </Link>

      <button
        onClick={() => onToggleBlock(user.id)}
        className={`rounded-lg px-3 py-2 text-xs font-bold ${
          user.isBlocked
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
        }`}
      >
        {user.isBlocked ? "Unblock" : "Block"}
      </button>

      <button
        onClick={() => onLogoutUser(user.id)}
        disabled={!user.isLoggedIn}
        className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Logout
      </button>

      <button
        onClick={() => {
          const confirmDelete = window.confirm(
            `Are you sure you want to delete ${user.name}?`
          );

          if (confirmDelete) {
            onDeleteUser(user.id);
          }
        }}
        className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-200"
      >
        Delete
      </button>
    </div>
  );
}

function UserTable({ users, onToggleBlock, onDeleteUser, onLogoutUser }) {
  if (users.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <h3 className="text-2xl font-black text-slate-900">No users found</h3>
        <p className="mt-2 text-slate-500">
          No client matched your search or filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Client
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Phone
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Registered
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Last Login
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-5">
                  <div>
                    <h3 className="font-black text-slate-900">{user.name}</h3>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </td>

                <td className="px-6 py-5 text-slate-600">{user.phone}</td>

                <td className="px-6 py-5">
                  <UserStatusBadge user={user} />
                </td>

                <td className="px-6 py-5 text-sm text-slate-600">
                  {formatDate(user.createdAt)}
                </td>

                <td className="px-6 py-5 text-sm text-slate-600">
                  {formatDate(user.lastLogin)}
                </td>

                <td className="px-6 py-5">
                  <UserActions
                    user={user}
                    onToggleBlock={onToggleBlock}
                    onDeleteUser={onDeleteUser}
                    onLogoutUser={onLogoutUser}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {user.name}
                </h3>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>

              <UserStatusBadge user={user} />
            </div>

            <div className="mb-5 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-bold">Phone:</span> {user.phone}
              </p>
              <p>
                <span className="font-bold">Registered:</span>{" "}
                {formatDate(user.createdAt)}
              </p>
              <p>
                <span className="font-bold">Last Login:</span>{" "}
                {formatDate(user.lastLogin)}
              </p>
            </div>

            <UserActions
              user={user}
              onToggleBlock={onToggleBlock}
              onDeleteUser={onDeleteUser}
              onLogoutUser={onLogoutUser}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default UserTable;