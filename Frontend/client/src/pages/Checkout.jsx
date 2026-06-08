import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OrderSummary from "../components/cart/OrderSummary";
import ManualPaymentBox from "../components/payment/ManualPaymentBox";
import PaymentMethod from "../components/payment/PaymentMethod";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const MAX_CART_QUANTITY = 10;

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [selectedMethod, setSelectedMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  const todayDate = getTodayDate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    serviceDate: "",
    serviceTime: "",
    note: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((previous) => ({
        ...previous,
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const hasInvalidQuantity = cartItems.some(
    (item) => item.quantity > MAX_CART_QUANTITY
  );

  // ─── Cash payment flow (unchanged) ───────────────────────────────────────────
  const handleCashSubmit = async () => {
    const createdBookings = [];

    for (const item of cartItems) {
      const payload = {
        serviceCategory: item.categoryId,
        serviceOptionId: item.serviceId || item.id,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        bookingDate: formData.serviceDate,
        bookingTime: formData.serviceTime,
        quantity: item.quantity || 1,
        note: formData.note,
        paymentMethod: "cash",
        transactionId: "",
        paymentPhone: "",
      };

      const { data } = await api.post("/bookings", payload);
      createdBookings.push(data.booking);
    }

    clearCart();

    navigate("/payment-success", {
      state: {
        bookingId: createdBookings[0]?._id,
        total: cartTotal,
        paymentMethod: "cash",
        bookingCount: createdBookings.length,
      },
    });
  };

  // ─── SSLCommerz payment flow (bkash, nagad, card) ────────────────────────────
  // Note: For multiple cart items, we initiate payment for the first item only.
  // SSLCommerz does not support multiple transactions in one redirect.
  // The full multi-item support requires a backend cart/order model.
  // For now we initiate one payment and redirect to SSLCommerz gateway.
  const handleSSLCommerzSubmit = async () => {
    if (cartItems.length > 1) {
      alert(
        "SSLCommerz payment currently supports one service at a time. Please checkout with one service or use Cash payment for multiple services."
      );
      return;
    }

    const item = cartItems[0];

    const payload = {
      serviceCategory: item.categoryId,
      serviceOptionId: item.serviceId || item.id,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      bookingDate: formData.serviceDate,
      bookingTime: formData.serviceTime,
      quantity: item.quantity || 1,
      note: formData.note,
      paymentMethod: selectedMethod,
    };

    const { data } = await api.post("/payment/initiate", payload);

    if (!data.success || !data.gatewayUrl) {
      throw new Error("Failed to get payment gateway URL.");
    }

    // Clear cart before redirect (booking already created on backend)
    clearCart();

    // Redirect to SSLCommerz gateway page
    window.location.href = data.gatewayUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      alert("Please login before placing an order.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/services");
      return;
    }

    if (hasInvalidQuantity) {
      alert(`Each service quantity must be maximum ${MAX_CART_QUANTITY}.`);
      return;
    }

    if (formData.serviceDate < todayDate) {
      alert("Service date cannot be in the past.");
      return;
    }

    try {
      setLoading(true);

      if (selectedMethod === "cash") {
        await handleCashSubmit();
      } else {
        await handleSSLCommerzSubmit();
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Failed to place booking.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="container-custom grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            Login Required
          </h1>

          <p className="mt-4 text-slate-600">
            Please login before checkout.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Login Now
          </Link>
        </div>
      </section>
    );
  }

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
                value={formData.name}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                name="phone"
                type="text"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                name="serviceDate"
                type="date"
                min={todayDate}
                value={formData.serviceDate}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                name="serviceTime"
                type="time"
                value={formData.serviceTime}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <textarea
              name="address"
              rows="4"
              placeholder="Service address"
              value={formData.address}
              onChange={handleChange}
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              required
            ></textarea>

            <textarea
              name="note"
              rows="3"
              placeholder="Extra note optional"
              value={formData.note}
              onChange={handleChange}
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <PaymentMethod
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />

          <ManualPaymentBox />

          {selectedMethod === "online" && (
  <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
    <p className="font-semibold text-emerald-800">
      🔒 You will be redirected to SSLCommerz Secure Checkout where you can pay using bKash, Nagad, Visa, Mastercard, Rocket and other supported methods.
    </p>
  </div>
)}

          {selectedMethod !== "cash" && cartItems.length > 1 && (
            <div className="rounded-3xl bg-yellow-50 p-5 ring-1 ring-yellow-200">
              <p className="font-semibold text-yellow-800">
                ⚠️ SSLCommerz payment supports one service at a time. Please
                remove extra items from cart or choose Cash payment.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <OrderSummary showCheckoutButton={false} />

          <button
            type="submit"
            disabled={loading || hasInvalidQuantity}
            className="w-full rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {loading
              ? "Processing..."
              : selectedMethod === "cash"
              ? "Place Order"
              : "Proceed to Payment"}
          </button>

          {hasInvalidQuantity && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              Each service quantity must be maximum {MAX_CART_QUANTITY}.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

export default Checkout;