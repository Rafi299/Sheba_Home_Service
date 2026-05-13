import { paymentMethods } from "../../data/paymentMethods";

function PaymentMethod({ selectedMethod, setSelectedMethod }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-5 text-2xl font-black text-slate-900">
        Payment Method
      </h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`block rounded-2xl border p-4 transition ${
              selectedMethod === method.id
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 bg-white"
            } ${
              !method.active
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:border-emerald-300"
            }`}
          >
            <div className="flex gap-4">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                disabled={!method.active}
                onChange={(event) => setSelectedMethod(event.target.value)}
                className="mt-1"
              />

              <div>
                <h3 className="font-bold text-slate-900">{method.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {method.description}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethod;