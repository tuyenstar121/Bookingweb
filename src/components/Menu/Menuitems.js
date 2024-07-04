import React from 'react';
import "./Menu.css";

const MenuItems = ({ items, onAddToCart }) => {
  const handleSelectNow = (item) => {
    onAddToCart(item);
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => {
        const { id, name, img, description, price } = item;
        return (
          <article key={id} className="bg-white rounded-lg overflow-hidden shadow-md">
            <img src={img} alt={name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <header className="flex justify-between mb-2">
                <h4 className="text-lg font-semibold">{name}</h4>
                <h4 className="text-lg font-semibold">${price}</h4>
              </header>
              <p className="text-sm text-gray-700 mb-2">{description}</p>
              <button
                className="rounded-lg px-2 py-2 bg-green-600 text-green-100 hover:bg-green-800 duration-200 focus:outline-none"
                onClick={() => handleSelectNow(item)}
              >
                
                Thêm vào giỏ
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default MenuItems;
