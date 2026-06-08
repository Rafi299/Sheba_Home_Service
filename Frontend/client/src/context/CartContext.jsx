import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const MAX_CART_QUANTITY = 10;

function getCartKey(user) {
  const userId = user?._id || user?.id;

  if (userId) {
    return `sheba_cart_${userId}`;
  }

  return "sheba_cart_guest";
}

function getStoredCart(cartKey) {
  try {
    const cart = localStorage.getItem(cartKey);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cartKey, setCartKey] = useState(() => getCartKey(user));
  const [cartItems, setCartItems] = useState(() =>
    getStoredCart(getCartKey(user))
  );

  useEffect(() => {
    const newCartKey = getCartKey(user);

    setCartKey(newCartKey);
    setCartItems(getStoredCart(newCartKey));
  }, [user?._id, user?.id]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const addToCart = (service) => {
    let wasLimitReached = false;

    setCartItems((previousItems) => {
      const serviceId = service.id || service._id;

      const existingItem = previousItems.find(
        (item) => (item.id || item._id) === serviceId
      );

      if (existingItem) {
        if (existingItem.quantity >= MAX_CART_QUANTITY) {
          wasLimitReached = true;
          return previousItems;
        }

        return previousItems.map((item) =>
          (item.id || item._id) === serviceId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousItems, { ...service, id: serviceId, quantity: 1 }];
    });

    return {
      success: !wasLimitReached,
      message: wasLimitReached
        ? `You can add maximum ${MAX_CART_QUANTITY} quantity for one service.`
        : "Service added to cart.",
    };
  };

  const removeFromCart = (id) => {
    setCartItems((previousItems) =>
      previousItems.filter((item) => (item.id || item._id) !== id)
    );
  };

  const increaseQuantity = (id) => {
    let wasLimitReached = false;

    setCartItems((previousItems) =>
      previousItems.map((item) => {
        if ((item.id || item._id) !== id) {
          return item;
        }

        if (item.quantity >= MAX_CART_QUANTITY) {
          wasLimitReached = true;
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );

    return {
      success: !wasLimitReached,
      message: wasLimitReached
        ? `Maximum ${MAX_CART_QUANTITY} quantity allowed for one service.`
        : "Quantity updated.",
    };
  };

  const decreaseQuantity = (id) => {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        (item.id || item._id) === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    maxCartQuantity: MAX_CART_QUANTITY,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}