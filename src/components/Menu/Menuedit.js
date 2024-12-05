import React, { useState, useEffect } from "react";

const Menuedit = (onRemove, onIncrement, onDecrement) => {
  const [foodItems, setFoodItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const updateCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setFoodItems(JSON.parse(storedCart));
      }
    };

    // Kiểm tra sự thay đổi trong localStorage mỗi giây
    const intervalId = setInterval(updateCart, 1000);

    // Cleanup khi component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleAddToCart = (newItem) => {
    const currentCart = foodItems.slice();
    const existingItem = currentCart.find(
      (item) => item.foodItemId === newItem.foodItemId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...newItem, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    setFoodItems(currentCart); // Cập nhật state ngay lập tức
  };

  const totalAmount = foodItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
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
          {foodItems.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">
                Không có món ăn trong giỏ hàng.
              </td>
            </tr>
          ) : (
            foodItems.map((item) => (
              <tr key={item.foodItemId} className="border border-gray-300">
                <td className="border border-gray-300 p-2">
                  <img
                    src={item.img || "/placeholder-image.png"} // Default placeholder if image is missing
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="border border-gray-300 p-2">{item.name}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      className="text-red-500 font-bold"
                      onClick={() => onDecrement(item.foodItemId)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="text-green-500 font-bold"
                      onClick={() => onIncrement(item.foodItemId)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  {item.price.toLocaleString()} đ
                </td>
                <td className="border border-gray-300 p-2">
                  {item.description || "Không có ghi chú"}
                </td>
                <td className="border border-gray-300 p-2">
                  {(item.quantity * item.price).toLocaleString()} đ
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="text-black hover:text-red-600"
                    onClick={() => onRemove(item.foodItemId)}
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
              {totalAmount === 0 ? "0 đ" : totalAmount.toLocaleString()} đ
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Menuedit;
