function SectionTitle({
  label,
  title,
  description,
  align = "center",
  className = "",
}) {
  const alignment = align === "left" ? "text-left" : "text-center mx-auto";

  return (
    <div className={`mb-10 max-w-3xl ${alignment} ${className}`}>
      {label && (
        <p className="mb-3 inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
          {label}
        </p>
      )}

      <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
      )}
    </div>
  );
}

export default SectionTitle;