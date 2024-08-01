import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
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
          <article key={id} className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md">
            <img src={img} alt={name} className="w-full h-48 object-cover" />
            <div className="flex flex-col flex-grow p-4">
              <header className="flex justify-between mb-2">
                <h4 className="text-lg font-semibold">{name}</h4>
                <h4 className="text-lg font-semibold">${price}</h4>
              </header>
              <p className="text-sm text-gray-700 mb-2 flex-grow">{description}</p>
              <div className="mt-auto">
                <button
                  className="w-full flex items-center justify-center rounded-lg px-2 py-2 bg-green-600 text-green-100 hover:bg-green-800 duration-200 focus:outline-none"
                  onClick={() => handleSelectNow(item)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default MenuItems;
