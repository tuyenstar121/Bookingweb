import React, { useState, useEffect } from 'react';
import Cart from '../../view/cart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({date}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [promotionToday, setPromotionToday] = useState([]);

  const navigate = useNavigate();

  const fetchPromotionByDate = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/promotions/by-date?date=' + date);
      const items = response.data;
      setPromotionToday(items);
    } catch (error) {
      console.error("There was an error fetching the promotions!", error);
    }
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    console.log(date)
    console.log(promotionToday)
    fetchPromotionByDate();
  }, [date]);

  const calculateDiscountedPrice = (item) => {
    const promotion = promotionToday.find(promo => promo.foodItemId === item.foodItemId);
    if (promotion) {
      return item.price - (item.price * (promotion.discountPercentage / 100));
    }
    return item.price;
  };

  const totalAmount = cart.reduce((total, item) => {
    return total + calculateDiscountedPrice(item) * item.quantity;
  }, 0);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex items-center justify-between p-4 bg-white rounded shadow-md max-w-sm">
        <div>Giỏ hàng trống</div>
        <button
          className="text-white border bg-orange-500 border-red-600 rounded px-2 py-1 hover:bg-red-600 hover:text-white transition"
          onClick={() => navigate("/menu")}
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
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          Thay đổi
        </button>
      </div>
      {cart.map((item, index) => {
        const discountedPrice = calculateDiscountedPrice(item);
        return (
          <div key={index} className="flex justify-between items-center mb-2">
            <div>{item.name}({item.quantity})</div>
            <div>
              {discountedPrice < item.price ? (
                <div>
                  <span className="line-through text-red-500">{item.price} VND</span> <span>{discountedPrice} VND</span>
                </div>
              ) : (
                <span className="font-semibold">{item.price} VND</span>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex justify-between items-center mb-2">
        <div className='font-bold'>Tổng cộng:</div>
        <span className="font-semibold">{totalAmount} VND</span>
      </div>
      {isCartOpen && <Cart cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} promotionToday={promotionToday} />}
    </div>
  );
};

export default ProductCard;
