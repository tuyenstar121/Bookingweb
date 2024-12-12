import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import MenuTable from "../components/Menu/MenuTable";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import RestaurantSelector from "./RestaurantSelector";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import classNames from "classnames";
import { ChevronDownIcon } from '@heroicons/react/16/solid';

import { useDisclosure } from '@chakra-ui/react';
import { FiX, FiEdit } from "react-icons/fi"; // Biểu tượng từ React-Icons
import { useNavigate } from "react-router-dom";
function ReservationManagementTable() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { onOpen } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState("");
  const [currentReservation, setCurrentReservation] = useState(null);
  
  const navigate = useNavigate();

  const status = {
    Booked : "Chờ xác nhận",
    Confirmed: "Đã tiếp nhận",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy"
  }

  // useEffect(()=>{
  //   const now = new Date();
  //   setSelectedDate(now.toISOString().split('T')[0]);
  // },[])
  useEffect(() => {
    // Lọc dữ liệu dựa trên searchQuery
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = reservations.filter((reservation) => {
      return (
        reservation.user.username.toLowerCase().includes(lowerQuery) ||
        reservation.user.phone.toLowerCase().includes(lowerQuery)
      );
    });
    setFilteredReservations(filtered);
  }, [searchQuery, reservations]);
  useEffect(() => {
    fetchReservations();
  }, [selectedRestaurant, sortBy, filterStatus]);
  const fetchReservations = async () => {
    let url = "http://localhost:8080/api/reservations/list";
   

    const token = Cookies.get('token');
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let updatedReservations = response.data;

      if (sortBy === "date") {
        updatedReservations.sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate));
      }

      if (filterStatus) {
        updatedReservations = updatedReservations.filter(reservation => reservation.status === filterStatus);
      }

      setReservations(updatedReservations);
    } catch (error) {
      console.error("There was an error fetching the reservations!", error);
      setError("There was an error fetching the reservations.");
    }
  };

  const fetchFoodItems = async (reservationId) => {
    const token = Cookies.get('token');
    setCurrentReservation(reservationId);
    try {
      const response = await axios.get(`http://localhost:8080/api/order-food-mapping/reservation/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoodItems(response.data);
      console.log(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error("There was an error fetching the food items!", error);
      setError("There was an error fetching the food items.");
    }
  };

  const calculateTotalPrice = () => {
    return foodItems.reduce((total, food) => total + (food.foodItem.price * food.quantity), 0).toFixed(2);
  };

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };

  const handleApproveBooked = async (reservationId) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(`http://localhost:8080/api/reservations/approve/${reservationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedReservations = reservations.map((res) =>
        res.reservationId === reservationId ? { ...res, status: "Confirmed" } : res
      );
      setReservations(updatedReservations);
      alert(response.data);
    } catch (error) {
      console.error("There was an error approving the reservation!", error);
      setError("There was an error approving the reservation.");
    }
  };

  const handleCancelBooked = async (reservationId) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(`http://localhost:8080/api/reservations/cancel/${reservationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedReservations = reservations.map((res) =>
        res.reservationId === reservationId ? { ...res, status: "Cancelled" } : res
      );
      setReservations(updatedReservations);
      alert(response.data);
    } catch (error) {
      console.error("There was an error cancelling the reservation!", error);
      setError("There was an error cancelling the reservation.");
    }
  };

  const handleApproveConfirmed = async (reservationId) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(`http://localhost:8080/api/reservations/complete/${reservationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedReservations = reservations.map((res) =>
        res.reservationId === reservationId ? { ...res, status: "Completed" } : res
      );
      setReservations(updatedReservations);
      alert(response.data);
    } catch (error) {
      console.error("There was an error completing the reservation!", error);
      setError("There was an error completing the reservation.");
    }
  };

  const sortByDate = () => {
    setSortBy("date");
  };
  const resetTable = () => {
    setSelectedRestaurant("");
    setSortBy(null);
    setFilterStatus(null);
    setReservations([]);
    setError("");
  };
  const fetchReservationsByDate = async () => {
    const token = Cookies.get("token"); // Lấy token từ cookie
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reservations/by-date?date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Thêm JWT vào header
        }
      );
      setReservations(response.data); // Cập nhật danh sách reservation
    } catch (error) {
      console.error("Error fetching reservations by date:", error);
      setError("Error fetching reservations by date"); // Thông báo lỗi
    }
  };
  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected); // Cập nhật ngày
  };

  // Tự động gọi API khi ngày thay đổi
  useEffect(() => {
    if (selectedDate) {
      fetchReservationsByDate();
    }
  }, [selectedDate]);
  const filterByStatus = (status) => {
    setFilterStatus(status);
  };
  const handleEditFood = () => {
    console.log(foodItems);
    if (foodItems.length > 0) {
      const cartItems = foodItems.map((item) => ({
        foodItemId: item.foodItem.foodItemId,
        img:item.foodItem.img,
        name: item.foodItem.name,
        price: item.foodItem.price,
        quantity: item.quantity,
      }));
      localStorage.setItem("cart", JSON.stringify(cartItems)); // Lưu vào localStorage
      
    } else {
      localStorage.removeItem("cart");
    }
    localStorage.setItem("reservationId", currentReservation); // Lưu Reservation ID để sử dụng sau nếu cần
      navigate("/nv"); // Chuyển hướng sang trang chỉnh sửa
  };

  // const filteredReservations = reservations.filter((reservation) => {
  //   const lowerQuery = searchQuery.toLowerCase();
  //   return (
    
  //     reservation.user.username.toLowerCase().includes(lowerQuery) ||
  //     reservation.user.phone.toLowerCase().includes(lowerQuery)
  //   );
  // });


  const handleDialogClose = () => {
    setOpenDialog(false);
    setFoodItems([]);
  };
  return (
    <div className="container">
    
      <div className="admin-top">
        <div className="control-buttons">
         
          
          <div className="relative w-1/3">
            <input
              type="text"
              value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
              className="form-control w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg"
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </span>
          
        </div>
        <div >
        <label htmlFor="date" className="mr-2">Chọn ngày</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Lọc
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </MenuButton>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                      onClick={() => sortByDate()}
                    >
                      Sắp xếp theo ngày
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                      onClick={() => filterByStatus("Confirmed")}
                    >
                    Lọc trạng thái {status["Confirmed"]}
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                      onClick={() => filterByStatus("Cancelled")}
                    >
                         Lọc trạng thái {status["Cancelled"]}
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                      onClick={() => filterByStatus("Booked")}
                    >
                          Lọc trạng thái {status["Booked"]}
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                      onClick={() => filterByStatus("Completed")}
                    >
                          Lọc trạng thái {status["Completed"]}
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => resetTable()}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block w-full px-4 py-2 text-left text-sm'
                      )}
                    >
                  Xem tất cả
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>

      {error && <p className="alert alert-danger">{error}</p>}
      <TableContainer component={Paper} className="table-container mt-4">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell align="left">Ngày</TableCell>
              <TableCell align="left">Giờ</TableCell>
              <TableCell align="left">Số khách</TableCell>
              <TableCell align="left">Số điện thoại</TableCell>
              {/* <TableCell align="left">Tên nhà hàng</TableCell> */}
              <TableCell align="left">Tên bàn</TableCell>
              <TableCell align="left">Trạng thái</TableCell>
              <TableCell align="left">Hành động</TableCell>
              <TableCell align="left">Món ăn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation, index) => (
              <TableRow key={reservation.reservationId}>
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell align="left">{reservation.reservationId}</TableCell>
                <TableCell align="left">{reservation.user.username}</TableCell>
                <TableCell align="left">{formatDate(reservation.reservationDate)}</TableCell>
                <TableCell align="left">{reservation.reservationTime}</TableCell>
                <TableCell align="left">{reservation.numGuests}</TableCell>
                <TableCell align="left">{reservation.user.phone}</TableCell>
                {/* <TableCell align="left">{reservation.table.restaurants?.name}</TableCell> */}
                <TableCell align="left">{reservation.table.tableNumber}</TableCell>
                <TableCell align="left">
                  <span
                    className={`badge px-2 py-1 rounded-full text-white ${reservation.status === "Booked"
                      ? "bg-blue-500"
                      : reservation.status === "Confirmed"
                        ? "bg-green-500"
                        : reservation.status === "Cancelled"
                          ? "bg-red-500"
                          : reservation.status === "Completed"
                            ? "bg-gray-500"
                            : "bg-yellow-500"
                      }`}
                  >
                    {status[reservation.status]}
                  </span>
                </TableCell>

                <TableCell align="left">
                  {reservation.status === "Booked" && (
                    <div className="flex space-x-2">
                      <IconButton
                        className="bg-green-500 text-green hover:bg-green-600"
                        onClick={() => handleApproveBooked(reservation.reservationId)}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        className="bg-red-500 text-red hover:bg-red-600"
                        onClick={() => handleCancelBooked(reservation.reservationId)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  )}
                  {reservation.status === "Confirmed" && (
                    <IconButton
                      className="bg-green-500 text-black hover:bg-green-600"
                      onClick={() => handleApproveConfirmed(reservation.reservationId)}
                    >
                      <CheckIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align="left">
                  <Button onClick={() => fetchFoodItems(reservation.reservationId)}>
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle className="text-xl font-semibold">Món ăn</DialogTitle>
        <DialogContent>
          {foodItems.length > 0 ? (
            <div className="max-w-full overflow-x-auto">
              <MenuTable foodItems={foodItems} />

            </div>
          ) : (
            <p className="text-gray-500">Chưa có món ăn nào</p>
          )}
        </DialogContent>


        <DialogActions className="flex justify-end gap-4">
  {/* Close Button */}
  <Button
    variant="contained"
    color="primary"
    onClick={handleDialogClose}
    startIcon={<FiX className="text-lg" />} // Biểu tượng Close
  >
    Hủy
  </Button>

  {/* Edit Button - chỉ hiển thị nếu trạng thái là "Confirmed" */}
  {reservations.find((res) => res.reservationId === currentReservation)?.status === "Confirmed" && (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleEditFood} // Đã gói trong hàm
      startIcon={<FiEdit className="text-lg" />} // Biểu tượng Edit
    >
      Edit
    </Button>
  )}
</DialogActions>


      </Dialog>

    </div>
  );
}

export default ReservationManagementTable;