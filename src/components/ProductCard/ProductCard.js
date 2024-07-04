import React, { useState, useEffect } from 'react';

const ProductCard = ({ onClearItem }) => {
  const [selectedItem, setSelectedItem] = useState([]);

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setSelectedItem(JSON.parse(storedCart));
    }
  }, []);

  // Check if selectedItem exists and has the necessary properties
  if (!selectedItem || selectedItem.length === 0) {
    return (
      <div className="p-4 bg-white rounded shadow-md max-w-sm">
        <p>Giỏ hàng trống</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sản phẩm trong giỏ hàng</h2>
        <button
          className="text-red-600 border border-red-600 rounded px-2 py-1 hover:bg-red-600 hover:text-white transition"
          onClick={onClearItem}
        >
          Thay đổi
        </button>
      </div>
      {selectedItem.map((item, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <p>{item.name}({item.quantity})</p>
          <span className="font-semibold">{item.price}$</span>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
