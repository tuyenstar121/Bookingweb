import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Ensure js-cookie is imported

const Menuedit = ({ reservationId ,promotionToday }) => { // Fix to receive reservationId as a prop
  const [foodItems, setFoodItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orderItems, setOrderItems] = useState([]); // State to hold current order data

  useEffect(() => {
    const updateCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setFoodItems(JSON.parse(storedCart));
      }
    };

   

    if (reservationId) {
      fetchOrderItems(reservationId); // Fetch data when reservationId is available
    }

    // Check for changes in localStorage every second
    const intervalId = setInterval(updateCart, 1000);

    // Cleanup when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [reservationId]); // Dependency on reservationId to refetch order items if changed
  const fetchOrderItems = async (reservationId) => { // Fetch food items based on reservationId
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/order-food-mapping/reservation/${reservationId}`, // Use reservationId correctly
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrderItems(response.data);

    } catch (error) {
      console.error("There was an error fetching the food items!", error);
    }
  };
  const incrementQuantity = (id) => {
    const updatedCart = foodItems.map((item) =>
      item.foodItemId === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setFoodItems(updatedCart); // Update cart state
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  const decrementQuantity = (id) => {
    const updatedCart = foodItems.map((item) =>
      item.foodItemId === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setFoodItems(updatedCart); // Update cart state
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  const removeFromCart = (id) => {
    const updatedCart = foodItems.filter((item) => item.foodItemId !== id);
    setFoodItems(updatedCart); // Update cart state
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  const syncOrderWithCart = async () => {
    try {
      const updatedItems = foodItems.map((item) => ({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        price: item.price,
        reservationId: reservationId,
        note: item.note || "Không có ghi chú", // Set note or default
      }));
  
      // Lọc các mục cần thêm
      const addedItems = updatedItems.filter(
        (cartItem) =>
          !orderItems.some(
            (orderItem) => orderItem.foodItem.foodItemId === cartItem.foodItemId
          )
      );
  
      // Cập nhật các mục đã tồn tại và gán mappingId
      const updatedItemsList = updatedItems
        .map((cartItem) => {
          const matchingOrderItem = orderItems.find(
            (orderItem) => orderItem.foodItem.foodItemId === cartItem.foodItemId
          );
  
          if (matchingOrderItem) {
            return {
              ...cartItem,
              mappingId: matchingOrderItem.mappingid,
            };
          }
  
          return null;
        })
        .filter((item) => item !== null); // Lọc ra các mục không hợp lệ
  
      // Lọc các mục cần xóa
      const removedItems = orderItems
        .filter(
          (orderItem) =>
            !updatedItems.some(
              (cartItem) => cartItem.foodItemId === orderItem.foodItem.foodItemId
            )
        )
    
      console.log("Thêm: ", JSON.stringify(addedItems));
      console.log("Cập nhật: ", JSON.stringify(updatedItemsList));
      console.log("Xóa: ", removedItems.map((item) => item.mappingid));
     
      // Gửi thay đổi lên backend
      const response = await axios.post(
        "http://localhost:8080/api/order-food-mapping/batch-process",
        {
          toCreate: addedItems,
          toUpdate: updatedItemsList,
          toDelete: removedItems.map((item) => item.mappingid), // Gửi mappingId để xóa
        }
      );
  
      if (response.status === 200) {
        alert("Order updated successfully!");
      } else {
        alert("Failed to update order.");
      }
    } catch (error) {
      console.error("Error syncing order with cart:", error);
      alert("Error syncing order with cart.");
    }
  };
  
  

  const totalAmount = foodItems.reduce((total, item) => {
    const promotion = promotionToday.find(
      (promo) => promo.foodItemId === item.foodItemId
    );
    const price = promotion
      ? item.price - item.price * (promotion.discountPercentage / 100)
      : item.price;
    return total + price * item.quantity;
  }, 0);

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
        foodItems.map((item) => {
          const promotion = promotionToday.find(
            (promo) => promo.foodItemId === item.foodItemId
          );
          const discountedPrice = promotion
            ? item.price - item.price * (promotion.discountPercentage / 100)
            : item.price;

          return (
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
                    onClick={() => decrementQuantity(item.foodItemId)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="text-green-500 font-bold"
                    onClick={() => incrementQuantity(item.foodItemId)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                {promotion ? (
                  <>
                    <span className="line-through text-red-500">
                      {item.price.toLocaleString()} đ
                    </span>
                    <br />
                    <span className="text-green-500">
                      {discountedPrice.toLocaleString()} đ
                    </span>
                  </>
                ) : (
                  <span>{item.price.toLocaleString()} đ</span>
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {item.note || "Không có ghi chú"}
              </td>
              <td className="border border-gray-300 p-2">
                {(item.quantity * discountedPrice).toLocaleString()} đ
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  className="text-black hover:text-red-600"
                  onClick={() => removeFromCart(item.foodItemId)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          );
        })
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

      {/* Submit Button */}
      <div className="mt-4 text-right">
        <button
          onClick={syncOrderWithCart}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu Giỏ Hàng
        </button>
      </div>
    </div>
  );
};

export default Menuedit;
