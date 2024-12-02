import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import "./Menu.css";

const MenuItems = ({ items, onAddToCart, promotionToday }) => {
  const handleSelectNow = (item) => {
    onAddToCart(item);
  };

  const getDiscountPercentage = (itemId) => {
    const promotion = promotionToday.find(promo => promo.foodItemId === itemId);
    return promotion ? promotion.discountPercentage : null;
  };

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
      {items.map((item) => {
        const { foodItemId, name, img, description, price } = item;
        const discountPercentage = getDiscountPercentage(foodItemId);
        return (
          <article key={foodItemId} className="relative flex flex-col bg-white rounded-lg overflow-hidden shadow-lg border">
            <img src={img} alt={name} className="w-full h-36 object-cover" />
            <div className="flex flex-col flex-grow p-2">
              <header className="flex flex-col  items-center mb-1">
                <div>
                  <span className="text-lg  font-semibold">{name}</span>
                </div>
                <div>
                  <span className="text-lg  font-semibold">{price} VND</span>
                </div>
              </header>
              <p className="text-sm text-gray-700 mb-2 flex-grow">{description}</p>
              <div className="mt-auto">
                <button
                  className="w-full flex items-center justify-center rounded-lg px-2 py-2 bg-green-600 text-green-100 hover:bg-green-800 duration-200 focus:outline-none"
                  onClick={() => handleSelectNow(item)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
            {discountPercentage !== null && (
              <div className='absolute right-0 top-0 bg-[#e81313] w-[79px] h-[41px] rounded-bl-[32px] flex items-center'>
                <div className="pl-2 text-center text-white text-2xl font-bold font-['Source Sans Pro'] leading-relaxed flex items-center">
                  - {discountPercentage}
                </div>
                <div className=" text-white text-2xl font-bold font-['Source Sans Pro'] leading-[28.80px] flex items-center">
                  %
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default MenuItems;
