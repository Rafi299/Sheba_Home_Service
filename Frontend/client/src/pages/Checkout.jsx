import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OrderSummary from "../components/cart/OrderSummary";
import ManualPaymentBox from "../components/payment/ManualPaymentBox";
import PaymentMethod from "../components/payment/PaymentMethod";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState("cash");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/services");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const transactionId = formData.get("transactionId") || "";

    if (
      (selectedMethod === "bkash" || selectedMethod === "nagad") &&
      !transactionId.trim()
    ) {
      alert("Please enter your transaction ID.");
      return;
    }

    const bookingId = `SHB-${Date.now()}`;

    const bookingData = {
      bookingId,
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      serviceDate: formData.get("serviceDate"),
      note: formData.get("note"),
      items: cartItems,
      totalAmount: cartTotal,
      paymentMethod: selectedMethod,
      transactionId,
      paymentStatus: selectedMethod === "cash" ? "unpaid" : "pending",
      orderStatus: "pending",
    };

    console.log("Booking data:", bookingData);

    clearCart();

    navigate("/payment-success", {
      state: {
        bookingId,
        total: cartTotal,
        paymentMethod: selectedMethod,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <section className="container-custom grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            Checkout is empty
          </h1>

          <p className="mt-4 text-slate-600">
            Please add at least one service before checkout.
          </p>

          <Link
            to="/services"
            className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Browse Services
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-custom py-16">
      <div className="mb-8">
        <p className="font-bold text-emerald-600">Checkout</p>
        <h1 className="text-4xl font-black text-slate-900">
          Complete Your Booking
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-5 text-2xl font-black text-slate-900">
              Customer Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="name"
                type="text"
                placeholder="Full name"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                name="phone"
                type="text"
                placeholder="Phone number"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email address"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                name="serviceDate"
                type="date"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <textarea
              name="address"
              rows="4"
              placeholder="Service address"
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              required
            ></textarea>

            <textarea
              name="note"
              rows="3"
              placeholder="Extra note optional"
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <PaymentMethod
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />

          <ManualPaymentBox paymentMethod={selectedMethod} />
        </div>

        <div className="space-y-6">
          <OrderSummary showCheckoutButton={false} />

          <button className="w-full rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white hover:bg-emerald-700">
            Place Order
          </button>
        </div>
      </form>
    </section>
  );
}

export default Checkout;