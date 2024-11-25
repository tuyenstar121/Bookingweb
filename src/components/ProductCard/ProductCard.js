import React, { useState, useEffect } from 'react';
import Cart from '../../view/cart';
import { useNavigate } from 'react-router-dom';

const ProductCard = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate()
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Check if selectedItem exists and has the necessary properties
  if (!cart || cart.length === 0) {
    return (
      <div className="flex items-center justify-between p-4 bg-white rounded shadow-md max-w-sm">
        <div>Giỏ hàng trống</div>
        <button
          className="text-white border bg-orange-500 border-red-600 rounded px-2 py-1 hover:bg-red-600 hover:text-white transition"
          onClick={()=>navigate("/menu")}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sản phẩm trong giỏ hàng</h2>
        <button
          className="text-red-600 border border-red-600 rounded px-2 py-1 hover:bg-red-600 hover:text-white transition"
          onClick={()=>setIsCartOpen(!isCartOpen)}
        >
          Thay đổi
        </button>
      </div>
      {cart.map((item, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <div>{item.name}({item.quantity})</div>
          <span className="font-semibold">{item.price} VND</span>
        </div>
      ))}
      <div className="flex justify-between items-center mb-2">
        <div className='font-bold'>Tổng cộng:</div>
        <span className="font-semibold">{totalAmount} VND</span>
      </div>
      {
        isCartOpen && <Cart cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}/>
      }
    </div>
  );
};

export default ProductCard;
