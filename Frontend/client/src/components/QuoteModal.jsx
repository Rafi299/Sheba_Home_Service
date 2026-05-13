import { servicesData } from "../data/servicesData";

function QuoteModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const quoteData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      message: formData.get("message"),
    };

    console.log("Quote request:", quoteData);
    alert("Quote request submitted successfully.");

    event.currentTarget.reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Request Quote
            </p>
            <h2 className="text-2xl font-black text-slate-900">
              Tell us what you need
            </h2>
          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 hover:bg-slate-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Your name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            required
          />

          <input
            name="phone"
            type="text"
            placeholder="Phone number"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            required
          />

          <select
            name="service"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            required
          >
            <option value="">Select service</option>
            {servicesData.map((service) => (
              <option key={service.id} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>

          <textarea
            name="message"
            rows="4"
            placeholder="Describe your problem"
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
          ></textarea>

          <button className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuoteModal;