import { paymentMethods } from "../../data/paymentMethods";

function ManualPaymentBox({ paymentMethod }) {
  const method = paymentMethods.find((item) => item.id === paymentMethod);

  if (paymentMethod !== "bkash" && paymentMethod !== "nagad") {
    return null;
  }

  if (!method) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-2 text-2xl font-black text-slate-900">
        {method.name} Payment
      </h2>

      <p className="mb-5 leading-7 text-slate-600">
        Send money to the merchant number below. Then enter your transaction ID.
      </p>

      <div className="mb-5 rounded-2xl bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-500">
          Merchant Number
        </p>

        <h3 className="mt-1 text-2xl font-black text-emerald-600">
          {method.merchantNumber}
        </h3>
      </div>

      <input
        type="text"
        name="transactionId"
        placeholder="Enter transaction ID"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
      />
    </div>
  );
}

export default ManualPaymentBox;