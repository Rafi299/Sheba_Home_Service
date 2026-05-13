function StatCard({ title, value, description }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-semibold text-slate-500">{title}</p>

      <h3 className="mt-3 text-4xl font-black text-slate-900">{value}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default StatCard;