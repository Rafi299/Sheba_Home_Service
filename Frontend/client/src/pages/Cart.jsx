import { Link } from "react-router-dom";

import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="container-custom grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-4 text-slate-600">
            Add services to cart before checkout.
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
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-bold text-emerald-600">Cart</p>
          <h1 className="text-4xl font-black text-slate-900">
            Selected Services
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="rounded-xl border border-red-200 px-5 py-3 font-bold text-red-500 hover:bg-red-50"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <OrderSummary />
      </div>
    </section>
  );
}

export default Cart;