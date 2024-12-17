import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuTable from "../Menu/Foodmenu";
import { Modal } from '@mui/material'; // Sử dụng Material UI 
const Payment = () => {
  // Dữ liệu mẫu cho biểu đồ
  const [payments, setPayments] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [thisWeekRevenue, setThisWeekRevenue] = useState(0);
  const [lastWeekRevenue, setLastWeekRevenue] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0); // Trang hiện tại
  const rowsPerPage = 6; // Số hàng mỗi trang
  const [completedCount, setCompletedCount] = useState(0);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [revenueDifference, setRevenueDifference] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [openPopup, setOpenPopup] = useState(false); // State để mở/đóng Modal
  // Lấy dữ liệu thanh toán từ API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/payments/all'); // Thay thế với URL API của bạn
        setPayments(response.data);
        calculateCompletedCount(response.data);
        calculateInvoiceCounts(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thanh toán:', error);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchPayments1 = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/payments/last-7-days'); // Thay thế với URL API của bạn
        setTransactionData(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thanh toán:', error);
      }
    };

    fetchPayments1();
  }, []);
  const calculateCompletedCount = (paymentsData) => {

    const count = paymentsData.filter(
      (payment) => payment.paymentStatus === "Thanh Cong"
    ).length; // Count the number of "completed" payments
    setCompletedCount(count);
  };
  const calculateInvoiceCounts = (paymentsData) => {
    // Tổng số lượng hóa đơn
    const totalInvoices = paymentsData.length;
  
    // Số lượng hóa đơn chờ thanh toán
    const pendingInvoices = paymentsData.filter(
      (payment) => payment.paymentStatus === "Cho Xu Ly"
    ).length;
  
    // Cập nhật state
    setTotalInvoices(totalInvoices);       // Tổng số lượng hóa đơn
    setPendingInvoices(pendingInvoices);   // Số lượng hóa đơn chờ thanh toán
  };
  
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/payments/monthly-revenue"); // Replace with your actual API endpoint
        const { currentMonthRevenue, lastMonthRevenue } = response.data;

        setCurrentRevenue(currentMonthRevenue);
        const difference = currentMonthRevenue - lastMonthRevenue;
        setRevenueDifference(difference);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenue();
  }, []);
  useEffect(() => {
    const fetchWeeklyRevenues = async () => {
      try {
        // Gọi API để lấy doanh thu tuần này và tuần trước
        const response = await axios.get("http://localhost:8080/api/payments/weekly");

        const { totalThisWeek, totalLastWeek } = response.data;

        setThisWeekRevenue(totalThisWeek);
        setLastWeekRevenue(totalLastWeek);

        // Tính phần trăm thay đổi
        if (totalLastWeek > 0) {
          const change = ((totalThisWeek - totalLastWeek) / totalLastWeek) * 100;
          setPercentageChange(change.toFixed(2));
        } else {
          setPercentageChange(totalThisWeek > 0 ? 100 : 0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy doanh thu tuần:", error);
      }
    };

    fetchWeeklyRevenues();
  }, []);

  const fetchMenuItems = async (reservationId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/payments/food-items/${reservationId}`
      ); // Thay thế với URL API của bạn
      setMenuItems(response.data); 
      setOpenPopup(true); /// Lưu danh sách món ăn vào state
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
    }
  };
  // Dữ liệu hóa đơn chưa thanh toán

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = payments.slice(indexOfFirstRow, indexOfLastRow);

  // Tổng số trang
  const totalPages = Math.ceil(payments.length / rowsPerPage);

  // Chuyển trang
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 min-h-screen">
      {/* Tiêu đề */}
      <div className="mb-6 text-gray-500">
        <span className="font-light">Trang chủ</span> <span className="font-bold">- Thanh toán</span>
      </div>

      {/* Lưới chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tổng quan ví */}
        <div className="bg-gray-100  p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Doanh thu tháng này</h3>
          <div className="p-4 bg-black shadow-md rounded-md">
            <h2 className="text-4xl font-bold text-blue-500">
              {formatCurrency(currentRevenue)}
            </h2>
            <p
              className={`text-sm mt-2 ${revenueDifference >= 0 ? "text-green-500" : "text-red-500"
                }`}
            >
              Tháng này {revenueDifference >= 0 ? "+" : "-"}{" "}
              {formatCurrency(Math.abs(revenueDifference))}
            </p>
          </div>
          <div className="mt-6">
            <p className="text-sm font-semibold">{pendingInvoices} đang chờ thanh toán</p>
            <div className="h-1 w-full bg-purple-200 rounded mt-1">
              <div className="h-full w-1/2 bg-purple-500 rounded"></div>
            </div>
            <p className="text-sm font-semibold mt-2">{totalInvoices} Tổng số hóa đơn</p>
            <div className="h-1 w-full bg-green-200 rounded mt-1">
              <div className="h-full w-3/4 bg-green-500 rounded"></div>
            </div>
          </div>
        </div>

        {/* Biểu đồ giao dịch tuần trước */}
        <div className="  p-6 rounded-lg shadow-md col-span-2">
          <h3 className="text-lg font-semibold mb-4">Giao dịch 7 ngày gần nhất</h3>
          {/* Biểu đồ cho giao dịch tuần trước */}
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={transactionData}>
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#8884d8"
                strokeWidth={2}
                name="Doanh thu (VND)"
              />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="paymentDate" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }).format(value/1000)
                }
                // Định dạng theo tiền Việt Nam
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }).format(value)
                }
              />

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Thống kê: Phải thu, Phải trả, Ví, Hóa đơn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Phải thu */}

        {/* Phải trả */}

        {/* Ví */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold mb-2">Doanh thu tuần này</h4>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-500">
              {thisWeekRevenue.toLocaleString()} VND
            </span>
            <p className={`text-xs ${percentageChange >= 0 ? "text-green-400" : "text-red-400"}`}>
              {percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`}
            </p>
          </div>
        </div>
        {/* Tổng hóa đơn */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold mb-2">Tổng hóa đơn</h4>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-purple-500">{completedCount} </span>
            <p className="text-xs text-gray-400">Hóa đơn đã hoàn tất</p>
          </div>
        </div>
      </div>

      {/* Bảng giao dịch trước đó */}
      <div className="bg-white mt-8 p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-4">Giao dịch trước đó</h4>
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-gray-500">
              <th className="p-2">Mã đơn đặt bànbàn</th>
              <th className="p-2">Ngày</th>
              <th className="p-2">Phương thức thanh toán</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Số tiền</th>
              <th className="p-2">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((payment) => (
              <tr key={payment.paymentId} className="border-t">
                <td className="p-2 flex items-center">
                  
                  {payment.reservationId}
                </td>
                <td className="p-2">
                  {new Date(payment.paymentDate).toLocaleDateString("en-GB")}
                </td>
                <td className="p-2">{payment.paymentMethod}</td>
                <td className="p-2">{payment.paymentStatus}</td>
                <td className="p-2">{payment.amount.toLocaleString()} VND</td>
                <td className="p-2">
                  <button  onClick={() => fetchMenuItems(payment.paymentId)}
                    className="text-blue-500">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal open={openPopup} onClose={() => setOpenPopup(false)}>
        <div className="bg-white p-6 rounded-lg w-3/4 mx-auto mt-20 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Danh sách món ăn</h2>
          <MenuTable foodItems={menuItems} />
          <button
            onClick={() => setOpenPopup(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Đóng
          </button>
        </div>
      </Modal>
        {/* Phân trang */}
        <div className="flex justify-end mt-4">
          <button
            className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              className={`px-3 py-1 mx-1 rounded ${currentPage === page + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </button>
          ))}
          <button
            className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Tiếp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
