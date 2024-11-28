import React, { useState, useEffect } from "react";

const MenuTable = ({ foodItems = [] }) => {
  const [items, setItems] = useState(
    foodItems.map((item, index) => ({
      ...item,
      key: item.foodItem.foodItemId || `temp-${index}`, // Unique key based on foodItemId
    }))
  );

  useEffect(() => {
    // Update items whenever foodItems changes
    setItems(
      foodItems.map((item, index) => ({
        ...item,
        key: item.foodItem.foodItemId || `temp-${index}`,
      }))
    );
  }, [foodItems]);

  const handleQuantityChange = (key, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const handleDelete = (key) => {
    setItems((prevItems) => prevItems.filter((item) => item.key !== key));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.foodItem.price,
    0
  );

  return (
    <div className="p-4">
      <table className="table-auto border-collapse border border-gray-300 w-full text-center">
        <thead className="bg-yellow-500 text-white">
          <tr>
            <th className="border border-gray-300 p-2">Hình ảnh</th>
            <th className="border border-gray-300 p-2">Món ăn</th>
            <th className="border border-gray-300 p-2">Số lượng</th>
            <th className="border border-gray-300 p-2">Giá</th>
            <th className="border border-gray-300 p-2">Ghi chú</th>
            <th className="border border-gray-300 p-2">Tổng</th>
            <th className="border border-gray-300 p-2">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">
                Không có món ăn trong giỏ hàng.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.key} className="border border-gray-300">
                <td className="border border-gray-300 p-2">
                  <img
                    src={item.foodItem.img || "/placeholder-image.png"} // Default placeholder if image is missing
                    alt={item.foodItem.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="border border-gray-300 p-2">{item.foodItem.name}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      className="text-red-500 font-bold"
                      onClick={() => handleQuantityChange(item.key, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="text-green-500 font-bold"
                      onClick={() => handleQuantityChange(item.key, 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  {item.foodItem.price.toLocaleString()} đ
                </td>
                <td className="border border-gray-300 p-2">
                  {item.description || "Không có ghi chú"} {/* Default message if description is missing */}
                </td>
                <td className="border border-gray-300 p-2">
                  {(item.quantity * item.foodItem.price).toLocaleString()} đ
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="text-black hover:text-red-600"
                    onClick={() => handleDelete(item.key)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5" className="text-right font-bold p-2">
              Tổng cộng:
            </td>
            <td className="font-bold text-red-500 p-2">
              {totalAmount === 0 ? "0 đ" : totalAmount.toLocaleString()} {/* Handle empty cart */}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MenuTable;
