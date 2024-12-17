import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Menu from "../components/Menu/menu";
import MenuEdit from "../components/Menu/Menuedit";
// import RestaurantSelector from "./RestaurantSelector";
// import {InvoicePDF} from './InvoicePDF';
import Invoice from "./Invoice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import ConfirmDialog from "./ConfirmDialog";
import MergeTableModal from "./Modal/modal-merge-table";
const CombinedLayout = () => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }); // Đồng bộ với localStorage
  const [tables, setTables] = useState([]);
  const [mergeTables, setMergeTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showMenuTable, setShowMenuTable] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [reservationId, setReservationId] = useState()
  const [reservationDetails, setReservationDetails] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [newTableId, setNewTableId] = useState(null);
  const [switchingTable, setSwitchingTable] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [promotionToday, setPromotionToday] = useState([]);
  const [error, setError] = useState("");
  const [isShowMergeTable, setIsShowMergeTable] = useState(false);
  const restaurantId=1;
  // Đồng bộ hóa giỏ hàng với localStorage
  useEffect(() => {
    if (cart === null) localStorage.removeItem("cart")
    else localStorage.setItem("cart", JSON.stringify(cart) );
  }, [cart]);

  useEffect(()=>{
    if (foodItems?.length > 0){
      const cartTemp = foodItems?.map(item=>{
        let result = item.foodItem;
        result["quantity"] = item.quantity;
        return result
      })
      console.log(cartTemp)
      setCart(cartTemp)
    } else {
      setCart([])
    }
  },[foodItems,tables])

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
    setReservationId(localStorage.getItem("reservationId"))
    fetchPromotionToday();
    fetchTablesByRestaurant(1);
  }, []);
  const fetchPromotionToday = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/promotions/by-date?date=' + new Date().toISOString().split('T')[0]);

      const items = response.data;

      setPromotionToday(items)
    } catch (error) {
      console.error("There was an error fetching the menu items!", error);
      setError("Lỗi tải dữ liệu khuyến mãi");
    }
  };
  const fetchReservationDetails = useCallback(async (reservationId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://localhost:8080/api/reservations/${reservationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { restaurantId, table } = response.data;

      // Update reservation details and other states
      setReservationDetails(response.data); // Save the entire reservation details
      setSelectedRestaurant(restaurantId);
      setSelectedTable({ id: table.id, number: table.tableNumber });

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

    } catch (error) {
      console.error("There was an error fetching the food items!", error);

    }
  };

  const fetchFoodOnTable = async (tableId)=>{
    const token = Cookies.get('token');
    try {
      const response = await axios.get(`http://localhost:8080/api/reservations/by-status-using/${tableId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservationId(response.data.reservationId)
      setReservationDetails(response.data);
      setSelectedTable({ id: tableId, number: response.data?.table?.tableNumber });
      if (response.data.reservationId){
        await fetchFoodItems(response.data.reservationId);
        localStorage.setItem("reservationId", response.data.reservationId);
      } else{
        setFoodItems(null)
        setCart([])
        localStorage.removeItem("reservationId");
        localStorage.removeItem("cart");
      } 
      console.log(response.data);

    } catch (error) {
      console.error("There was an error fetching the food items!", error);

    }
  }
  useEffect(() => {
    if (reservationId) {
      fetchReservationDetails(reservationId);
      fetchFoodItems(reservationId)
    }
  }, [reservationId]);
  const handleBackToTableSelection = () => {
    setShowMenuTable(false);
    setSelectedTable(null);
  };
  // Xử lý thêm/xóa món ăn trong giỏ hàng


  const toggleSwitchingTable = () => {
    setSwitchingTable(!switchingTable);
    handleBackToTableSelection()
    if (!switchingTable) toast.info("Chọn bàn mới để chuyển đến.");
  };
  const executeSwitchTable = async () => {
    setShowConfirmDialog(false);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `http://localhost:8080/api/reservations/change-table/${reservationId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { newTableId },
        }
      );

      if (response.status === 200) {
        toast.success("Chuyển bàn thành công!");
        const updatedReservation = response.data.updatedReservation;
        
        setSelectedTable({
          id: updatedReservation.table.tableId,
          number: updatedReservation.table.tableNumber,
        });
        
        fetchTablesByRestaurant(1);
      } else {
        toast.error("Không thể chuyển bàn!");
      }
    } catch (error) {
      console.error("Error switching tables:", error);
      toast.error("Đã xảy ra lỗi khi chuyển bàn!");
    }
  };
  const handleSwitchTable = async () => {
    setShowConfirmDialog(true);
  };
  const handleTableClick = async(table) => {
    if (switchingTable) {
      if (table.status === "available") {
        
        setSelectedTable({ id: table.tableId, number: table.tableNumber });
        console.log(selectedTable); 
        setNewTableId(table.tableId);
        handleSwitchTable(table.tableId); // Gọi API đổi bàn
      } else {
        toast.warn("Bàn này đã có khách. Vui lòng chọn bàn trống!");
      }
    } else {
        await fetchFoodOnTable(table.tableId)
        setSelectedTable({ id: table.tableId, number: table.tableNumber });
        setShowMenuTable(true);
    }
  };
 
  const handlePaymentClick = () => setShowInvoice(true);
  const handleCloseInvoice = () => setShowInvoice(false);

  const handleMergeTable = async (newTable) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `http://localhost:8080/api/reservations/merge-table/${reservationId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { newTableId : newTable.tableId },
        }
      );
      if (response.status === 200) {
        const updatedReservation = response.data;
        console.log(selectedTable)
        setSelectedTable({
          id: newTable.tableId,
          number: newTable.tableNumber,
        });
        await fetchTablesByRestaurant(1);
        await fetchFoodOnTable(newTable.tableNumber)
        setIsShowMergeTable(false)
        setMergeTables(
          [...mergeTables, 
            {
              "mainTable":newTable.tableNumber,
              "mainTableId":newTable.tableId,
              "subTable":selectedTable.number,
              "subTableId":selectedTable.id
            }])
        alert("Gộp bàn thành công!");
      } else {
        alert("Không thể gộp bàn!");
      }
    } catch (error) {
      console.error("Error switching tables:", error);
      alert("Đã xảy ra lỗi khi gộp bàn!");
    }
  }


  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left-Side: Menu */}
      <div className="w-full md:w-2/3 p-4 bg-gray-50 overflow-auto">
        <Menu cart={cart} setCart={setCart}/>
      </div>

      {/* Right-Side: Cart and Table Management */}
      <div className="w-full md:w-1/3 p-4 bg-gray-50 overflow-auto">

        {reservationId && (
          <div className="bg-blue-100 p-4 rounded mb-4">
            <h3 className="text-lg font-bold">
              Đơn đặt bàn: {reservationId}
            </h3>
            <h2 className="text-xl font-bold mb-4">
              {reservationDetails?.table ? (
                <p>Bàn: {reservationDetails.table.tableNumber}</p>
              ) : (
                <p>Chưa có thông tin bàn</p>
              )}
            </h2>
          </div>
        )}
        {!showMenuTable ? (
          <div>
            <h2 className="text-xl font-bold">Chọn bàn</h2>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {tables?.map((table) => {

                const mergedEntry = mergeTables.find(
                  (entry) =>
                    entry.mainTable === table.tableNumber || entry.subTable === table.tableNumber
                );
                // Nếu là mainTable, xuất ra subTable + mainTable
                const displayTableNumber =
                  mergedEntry?.mainTable === table.tableNumber
                    ? `${mergedEntry.subTable} + ${mergedEntry.mainTable}`
                    : table.tableNumber;

                // Nếu là subTable thì vô hiệu hóa onClick và ẩn giao diện
                const isSubTable = mergedEntry?.subTable === table.tableNumber;

                return(
                <div
                  key={table.tableId}
                  className={`w-full h-24 border rounded-lg shadow-md flex flex-col ${isSubTable?'cursor-not-allowed':"cursor-pointer"}`}
                  onClick={() => !isSubTable && handleTableClick(table)}
                >
                  <div className="flex-1 flex items-center justify-center bg-white rounded-t-lg">
                    <span className="text-lg font-bold">{displayTableNumber}</span>
                  </div>
                  <div
                    className={`flex-1.1 flex items-center justify-center rounded-b-lg ${table.status === "available" ? "bg-green-500" : "bg-gray-400"
                      }`}
                  >
                    <span className="text-white font-medium">
                      {table.status === "available" ? "Bàn trống" : "Có khách"}
                    </span>
                  </div>
                </div>
              )})}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Bàn: {selectedTable?.number}
            </h2>
            <MenuEdit reservationId={reservationId} promotionToday={promotionToday} tableId={selectedTable?.id} fetchFoodOnTable={fetchFoodOnTable} fetchTablesByRestaurant={fetchTablesByRestaurant}/>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleBackToTableSelection}
            >
              Trở về danh sách bàn
            </button>
          </div>
        )}

        <div className="flex space-x-4 mt-4">
         
          <button
            className="flex items-center px-3 py-2 bg-green-500 text-white font-bold rounded-full shadow-lg hover:shadow-green-600 transition duration-300"
            onClick={handlePaymentClick}
          >
            <i className="fas fa-shopping-cart mr-1"></i> Thanh toán
          </button>
          <button onClick={()=>setIsShowMergeTable(!isShowMergeTable)} className="flex items-center px-3 py-2 bg-yellow-600 text-white font-bold rounded-full shadow-lg hover:shadow-yellow-700 transition duration-300">
            <i className="fas fa-compress-alt mr-1"></i> Gộp bàn
          </button>
          <button
            className={`flex items-center px-3 py-2 ${switchingTable ? "bg-red-500" : "bg-purple-600"
              } text-white font-bold rounded-full shadow-lg hover:shadow-purple-800 transition duration-300`}
            onClick={toggleSwitchingTable}
          >
            <i className="fas fa-arrows-alt mr-1"></i> {switchingTable ? "Hủy chuyển bàn" : "Chuyển bàn"}
          </button>
        </div>
      </div>
      {showConfirmDialog && (
        <ConfirmDialog
          title="Xác nhận chuyển bàn"
          message={`Bạn có chắc chắn muốn chuyển đến bàn ${selectedTable?.number}?`}
          onConfirm={executeSwitchTable}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
      {/* Invoice Modal */}
      <Dialog open={showInvoice} onClose={handleCloseInvoice} maxWidth="md" fullWidth>
        <DialogTitle>Hóa Đơn</DialogTitle>
        <DialogContent>
          <Invoice 
            handleCloseInvoice={handleCloseInvoice} 
            reservation={reservationDetails} 
            items={foodItems} 
            promotionToday={promotionToday}
            mergeTables={mergeTables}
            setMergeTables={setMergeTables}
            fetchFoodOnTable={fetchFoodOnTable}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoice} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <MergeTableModal 
        setIsShowMergeTable={setIsShowMergeTable} 
        isShowMergeTable={isShowMergeTable}
        selectedTable={reservationDetails?.table}
        tables={tables}
        handleMergeTable={handleMergeTable}
      />
    </div>
  );
};

export default CombinedLayout;
