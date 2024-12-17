import React from "react";

const Foodmenu = ({ foodItems = [] }) => {
  const totalAmount = foodItems.reduce(
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
          </tr>
        </thead>
        <tbody>
          {foodItems.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                Không có món ăn trong giỏ hàng.
              </td>
            </tr>
          ) : (
            foodItems.map((item) => (
              <tr key={item.foodItem.foodItemId} className="border border-gray-300">
                <td className="border border-gray-300 p-2">
                  <img
                    src={item.foodItem.img || "/placeholder-image.png"} // Default placeholder if image is missing
                    alt={item.foodItem.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="border border-gray-300 p-2">{item.foodItem.name}</td>
                <td className="border border-gray-300 p-2">{item.quantity}</td>
                <td className="border border-gray-300 p-2">
                  {item.foodItem.price.toLocaleString()} đ
                </td>
                <td className="border border-gray-300 p-2">
                  {item.description || "Không có ghi chú"}
                </td>
                <td className="border border-gray-300 p-2">
                  {(item.quantity * item.foodItem.price).toLocaleString()} đ
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
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Foodmenu     ;
