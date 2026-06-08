import { Link } from "react-router-dom";

function UserStatusBadge({ user }) {
  if (user.isBlocked) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
        Blocked
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
      Active
    </span>
  );
}

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString();
}

function UserActions({ user, onToggleBlock, onDeleteUser }) {
  const userId = user._id;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to={`/admin/users/${userId}`}
        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
      >
        View
      </Link>

      <button
        onClick={() => onToggleBlock(userId)}
        className={`rounded-lg px-3 py-2 text-xs font-bold ${
          user.isBlocked
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
        }`}
      >
        {user.isBlocked ? "Unblock" : "Block"}
      </button>

      <button
        onClick={() => {
          const confirmDelete = window.confirm(
            `Are you sure you want to delete ${user.name}?`
          );

          if (confirmDelete) {
            onDeleteUser(userId);
          }
        }}
        className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-200"
      >
        Delete
      </button>
    </div>
  );
}

function UserTable({ users, onToggleBlock, onDeleteUser }) {
  if (users.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <h3 className="text-2xl font-black text-slate-900">No users found</h3>
        <p className="mt-2 text-slate-500">
          No user matched your search or filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
        <table className="w-full min-w-[850px] text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                User
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Phone
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Address
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Registered
              </th>
              <th className="px-6 py-4 text-sm font-black text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50">
                <td className="px-6 py-5">
                  <div>
                    <h3 className="font-black text-slate-900">{user.name}</h3>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </td>

                <td className="px-6 py-5 text-slate-600">
                  {user.phone || "N/A"}
                </td>

                <td className="px-6 py-5 text-slate-600">
                  {user.address || "N/A"}
                </td>

                <td className="px-6 py-5">
                  <UserStatusBadge user={user} />
                </td>

                <td className="px-6 py-5 text-sm text-slate-600">
                  {formatDate(user.createdAt)}
                </td>

                <td className="px-6 py-5">
                  <UserActions
                    user={user}
                    onToggleBlock={onToggleBlock}
                    onDeleteUser={onDeleteUser}
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
            key={user._id}
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
                <span className="font-bold">Phone:</span> {user.phone || "N/A"}
              </p>
              <p>
                <span className="font-bold">Address:</span>{" "}
                {user.address || "N/A"}
              </p>
              <p>
                <span className="font-bold">Registered:</span>{" "}
                {formatDate(user.createdAt)}
              </p>
            </div>

            <UserActions
              user={user}
              onToggleBlock={onToggleBlock}
              onDeleteUser={onDeleteUser}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default UserTable;