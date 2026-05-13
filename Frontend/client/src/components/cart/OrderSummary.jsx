import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function OrderSummary({ showCheckoutButton = true }) {
  const { cartItems, cartCount, cartTotal } = useCart();

  const serviceCharge = cartTotal > 0 ? 0 : 0;
  const discount = 0;
  const grandTotal = cartTotal + serviceCharge - discount;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-6 text-2xl font-black text-slate-900">
        Order Summary
      </h2>

      <div className="space-y-4 text-slate-600">
        <div className="flex justify-between">
          <span>Total Items</span>
          <span className="font-bold text-slate-900">{cartCount}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-slate-900">৳{cartTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Service Charge</span>
          <span className="font-bold text-slate-900">৳{serviceCharge}</span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>
          <span className="font-bold text-emerald-600">-৳{discount}</span>
        </div>
      </div>

      <div className="my-6 border-t border-slate-200"></div>

      <div className="mb-6 flex justify-between text-xl font-black text-slate-900">
        <span>Total</span>
        <span>৳{grandTotal}</span>
      </div>

      {cartItems.length > 0 && showCheckoutButton && (
        <Link
          to="/checkout"
          className="block rounded-xl bg-emerald-600 px-5 py-3 text-center font-bold text-white hover:bg-emerald-700"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}

export default OrderSummary;