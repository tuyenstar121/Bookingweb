import React, { useState } from "react";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { name, price, quantity, totalPrice } = item;

  return (
    <tr className="border-b">
      <td className="p-4">{name}</td>
      <td className="p-4 flex items-center justify-center">
        <button
          className="bg-red-500 text-white px-2 rounded"
          onClick={() => onUpdateQuantity(item, -1)}
        >
          -
        </button>
        <input
          type="number"
          className="w-12 mx-2 text-center border rounded"
          value={quantity}
          readOnly
        />
        <button
          className="bg-green-500 text-white px-2 rounded"
          onClick={() => onUpdateQuantity(item, 1)}
        >
          +
        </button>
      </td>
      <td className="p-4">{price.toFixed(3)}</td>
      <td className="p-4">{totalPrice.toFixed(3)}</td>
      <td className="p-4">
        <button
          className="bg-gray-300 p-2 rounded"
          onClick={() => onRemove(item)}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Bánh cuốn", price: 42.5, quantity: 2 },
    { id: 2, name: "Salad", price: 50.0, quantity: 1 },
    { id: 3, name: "Pizza chay", price: 120.0, quantity: 1 },
    { id: 4, name: "Nước cam", price: 50.0, quantity: 2 },
    { id: 5, name: "Bánh phô mai", price: 70.0, quantity: 2 },
  ]);

  const updateQuantity = (item, delta) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + delta) }
        : cartItem
    );
    setCartItems(updatedCart);
  };

  const removeItem = (item) => {
    const updatedCart = cartItems.filter((cartItem) => cartItem.id !== item.id);
    setCartItems(updatedCart);
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="container mx-auto p-4">
      <table className="w-full text-center table-auto border-collapse">
        <thead>
          <tr className="bg-yellow-500 text-white">
            <th className="p-4">Món ăn</th>
            <th className="p-4">Số lượng</th>
            <th className="p-4">Giá</th>
            <th className="p-4">Tổng</th>
            <th className="p-4">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={{
                ...item,
                totalPrice: item.price * item.quantity,
              }}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <strong>Tổng cộng: {getTotal().toFixed(3)} VND</strong>
      </div>
    </div>
  );
};

export default Cart;
