import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    maxCartQuantity,
  } = useCart();

  const itemId = item.id || item._id;
  const itemTitle = item.title || item.name;

  const handleIncrease = () => {
    const result = increaseQuantity(itemId);

    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <div className="grid gap-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-[120px_1fr_auto]">
      <div className="h-28 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-slate-200">
        {item.image && (
          <img
            src={item.image}
            alt={itemTitle}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold text-emerald-600">
          {item.categoryTitle}
        </p>

        <h3 className="text-xl font-black text-slate-900">{itemTitle}</h3>

        <p className="mt-2 text-sm text-slate-500">
          Duration: {item.duration || "N/A"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Maximum quantity: {maxCartQuantity}
        </p>

        <button
          onClick={() => removeFromCart(itemId)}
          className="mt-4 text-sm font-semibold text-red-500 hover:text-red-600"
        >
          Remove
        </button>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 md:items-end">
        <div className="text-left md:text-right">
          <p className="text-2xl font-black text-slate-900">৳{item.price}</p>
          <p className="text-sm text-slate-500">per service</p>
        </div>

        <div>
          <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
            <button
              onClick={() => decreaseQuantity(itemId)}
              disabled={item.quantity <= 1}
              className="px-4 py-2 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              -
            </button>

            <span className="border-x border-slate-200 px-4 py-2 font-bold">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrease}
              disabled={item.quantity >= maxCartQuantity}
              className="px-4 py-2 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          {item.quantity >= maxCartQuantity && (
            <p className="mt-2 text-xs font-semibold text-red-500">
              Max limit reached
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartItem;