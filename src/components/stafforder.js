import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Menu from "../components/Menu/menu";
import MenuTable from "../components/Menu/MenuTable";
import RestaurantSelector from "./RestaurantSelector";
import Invoice from "./Invoice";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material"; // Material-UI imports

const CombinedLayout = () => {
  const [cart, setCart] = useState([]); // Danh sách món ăn
  const [tables, setTables] = useState([]); // Danh sách bàn
  const [selectedTable, setSelectedTable] = useState(null); // Bàn đang chọn (id & number)
  const [showMenuTable, setShowMenuTable] = useState(false); // Hiển thị MenuTable
  const [selectedRestaurant, setSelectedRestaurant] = useState(""); // Nhà hàng đang chọn
  const [showInvoice, setShowInvoice] = useState(false); // Hiển thị hóa đơn
  const reservationId = localStorage.getItem("reservationId"); // Lấy reservationId từ localStorage

  // Fetch tables when a restaurant is selected
  useEffect(() => {
    if (selectedRestaurant) {
      fetchTablesByRestaurant(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  // Auto-fetch food items if reservationId exists
  useEffect(() => {
    if (reservationId) {
      setShowMenuTable(true); // Hiển thị MenuTable
      fetchFoodItems(reservationId); // Gọi API lấy danh sách món ăn
    }
  }, [reservationId]);

  // Fetch tables based on restaurant id
  const fetchTablesByRestaurant = async (restaurantId) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No JWT token found");
      }

      const response = await axios.get(
        `http://localhost:8080/tables/by-restaurant/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Không thể lấy danh sách bàn!");
    }
  };

  // Fetch food items based on reservationId
  const fetchFoodItems = async (reservationId) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No JWT token found");
      }

      const response = await axios.get(
        `http://localhost:8080/api/order-food-mapping/reservation/${reservationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật danh sách món ăn
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching food items:", error);
      toast.error("Không thể lấy danh sách món ăn!");
    }
  };

  const handleTableClick = (table) => {
    if (table.status === "available") {
      setSelectedTable({ id: table.id, number: table.tableNumber });
      setShowMenuTable(true);
    } else {
      toast.warn("Bàn này đã có khách!");
    }
  };

  const handleBackToTableSelection = () => {
    setShowMenuTable(false);
    setSelectedTable(null);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const incrementQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handlePaymentClick = () => {
    setShowInvoice(true); // Hiển thị hóa đơn khi nhấn thanh toán
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false); // Đóng hóa đơn
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left-Side: Menu */}
      <div className="w-full md:w-2/3 p-4 bg-gray-50">
        <Menu />
      </div>

      {/* Right-Side: Cart and Table Management */}
      <div className="w-full md:w-1/3 p-4 bg-gray-50">
        <RestaurantSelector setSelectedRestaurant={setSelectedRestaurant} />

        {/* Table Selection */}
        {!showMenuTable ? (
          <div>
            <h2 className="text-xl font-bold">Chọn bàn</h2>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`w-full h-24 border rounded-lg shadow-md flex flex-col ${
                    table.status === "available" ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  onClick={() => handleTableClick(table)}
                >
                  <div className="flex-1 flex items-center justify-center bg-white rounded-t-lg">
                    <span className="text-lg font-bold">{table.tableNumber}</span>
                  </div>
                  <div
                    className={`flex-1.04 flex items-center justify-center rounded-b-lg ${
                      table.status === "available" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    <span className="text-white font-medium">
                      {table.status === "available" ? "Bàn trống" : "Có khách"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Bàn: {selectedTable?.number}
            </h2>
            <MenuTable
              foodItems={cart}
              onRemove={removeFromCart}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleBackToTableSelection}
            >
              Trở về danh sách bàn
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-4">
          <button className="flex items-center px-3 py-2 bg-gray-700 text-white font-bold rounded-full shadow-lg hover:shadow-gray-800 transition duration-300">
            <i className="fas fa-print mr-1"></i> In hóa đơn
          </button>
          <button
            className="flex items-center px-3 py-2 bg-green-500 text-white font-bold rounded-full shadow-lg hover:shadow-green-600 transition duration-300"
            onClick={handlePaymentClick} // Handle payment click to show invoice
          >
            <i className="fas fa-shopping-cart mr-1"></i> Thanh toán
          </button>
          <button className="flex items-center px-3 py-2 bg-yellow-600 text-white font-bold rounded-full shadow-lg hover:shadow-yellow-700 transition duration-300">
            <i className="fas fa-compress-alt mr-1"></i> Gộp bàn
          </button>
          <button className="flex items-center px-3 py-2 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-purple-800 transition duration-300">
            <i className="fas fa-arrows-alt mr-1"></i> Chuyển bàn
          </button>
        </div>
      </div>

      {/* Invoice Modal */}
      <Dialog open={showInvoice} onClose={handleCloseInvoice} maxWidth="md" fullWidth>
        <DialogTitle>Hóa đơn</DialogTitle>
        <DialogContent>
          <Invoice />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoice} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CombinedLayout;
