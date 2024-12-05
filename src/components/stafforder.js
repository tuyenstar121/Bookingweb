import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Menu from "../components/Menu/menu";
import MenuEdit from "../components/Menu/Menuedit";
import RestaurantSelector from "./RestaurantSelector";
import Invoice from "./Invoice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const CombinedLayout = () => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }); // Đồng bộ với localStorage
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showMenuTable, setShowMenuTable] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const reservationId = localStorage.getItem("reservationId");
  const [reservationDetails, setReservationDetails] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái tải

  // Đồng bộ hóa giỏ hàng với localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Lấy danh sách bàn theo nhà hàng
  const fetchTablesByRestaurant = useCallback(async (restaurantId) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://localhost:8080/tables/by-restaurant/${restaurantId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Không thể lấy danh sách bàn!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchTablesByRestaurant(selectedRestaurant);
    }
  }, [selectedRestaurant, fetchTablesByRestaurant]);

  // Lấy thông tin đặt bàn
  const fetchReservationDetails = useCallback(async (id) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://localhost:8080/api/reservations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { restaurantId, table } = response.data;
      setSelectedRestaurant(restaurantId);
      setSelectedTable({ id: table.id, number: table.tableNumber });
      setReservationDetails(response.data);
    } catch (error) {
      console.error("Error fetching reservation details:", error);
      toast.error("Không thể lấy thông tin đặt bàn!");
    }
  }, []);
  const fetchFoodItems = async (reservationId) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(`http://localhost:8080/api/order-food-mapping/reservation/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoodItems(response.data);
      console.log(response.data);

    } catch (error) {
      console.error("There was an error fetching the food items!", error);
    
    }
  };
  useEffect(() => {
    if (reservationId) {
      fetchReservationDetails(reservationId);
      fetchFoodItems(reservationId)
    }
  }, [reservationId, fetchReservationDetails]);
  const handleBackToTableSelection = () => {
    setShowMenuTable(false);
    setSelectedTable(null);
  };
  // Xử lý thêm/xóa món ăn trong giỏ hàng
  const updateCart = useCallback((updatedCart) => {
    setCart(updatedCart);
  }, []);

  const incrementQuantity = useCallback(
    (id) => {
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      updateCart(updatedCart);
    },
    [cart, updateCart]
  );

  const decrementQuantity = useCallback(
    (id) => {
      const updatedCart = cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      updateCart(updatedCart);
    },
    [cart, updateCart]
  );

  const removeFromCart = useCallback(
    (id) => {
      const updatedCart = cart.filter((item) => item.id !== id);
      updateCart(updatedCart);
    },
    [cart, updateCart]
  );

  // Xử lý chọn bàn
  const handleTableClick = (table) => {
    if (table.status === "available") {
      setSelectedTable({ id: table.id, number: table.tableNumber });
      setShowMenuTable(true);
    } else {
      toast.warn("Bàn này đã có khách!");
    }
  };

  const handlePaymentClick = () => setShowInvoice(true);
  const handleCloseInvoice = () => setShowInvoice(false);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left-Side: Menu */}
      <div className="w-full md:w-2/3 p-4 bg-gray-50 overflow-auto">
        <Menu />
      </div>

      {/* Right-Side: Cart and Table Management */}
      <div className="w-full md:w-1/3 p-4 bg-gray-50 overflow-auto">
        <RestaurantSelector setSelectedRestaurant={setSelectedRestaurant} />
        {reservationId && (
  <div className="bg-blue-100 p-4 rounded mb-4">
    <h3 className="text-lg font-bold">
      Đơn đặt bàn: {reservationId}
    </h3>
    <p>Nhà hàng đã chọn: {selectedRestaurant}</p>
  </div>
)}
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
                    className={`flex-1 flex items-center justify-center rounded-b-lg ${
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
            <MenuEdit
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

        <div className="flex space-x-4 mt-4">
          <button className="flex items-center px-3 py-2 bg-gray-700 text-white font-bold rounded-full shadow-lg hover:shadow-gray-800 transition duration-300">
            <i className="fas fa-print mr-1"></i> In hóa đơn
          </button>
          <button
            className="flex items-center px-3 py-2 bg-green-500 text-white font-bold rounded-full shadow-lg hover:shadow-green-600 transition duration-300"
            onClick={handlePaymentClick}
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
        <DialogTitle>Hóa Đơn</DialogTitle>
        <DialogContent>
          <Invoice reservation={reservationDetails} items={foodItems}/>
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
