import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Cookies from "js-cookie";
const Invoice = ({handleCloseInvoice, reservation, items = [], promotionToday }) => {
  const [invoiceExists, setInvoiceExists] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Tiền Mặt");

  useEffect(() => {
    checkInvoice();
  }, []);

  // Function to get discount percentage
  const getDiscountPercentage = (itemId) => {
    const promotion = promotionToday?.find((promo) => promo.foodItemId === itemId);
    console.log("h"+itemId);
    return promotion ? promotion.discountPercentage : 0;
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (item) => {
    const discount = getDiscountPercentage(item.foodItem.foodItemId);
    const price = item.foodItem.price * item.quantity;
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  // Calculate total amount
  const totalAmount = items.reduce((total, item) => total + calculateDiscountedPrice(item), 0);

  const checkInvoice = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/order-food-mapping/invoice-exists", {
        params: { reservationId: reservation.reservationId },
      });
      setInvoiceExists(response.data);
    } catch (error) {
      toast.error("Lỗi khi kiểm tra hóa đơn!");
      console.error("Error checking invoice existence:", error);
    }
  };

  const handleCreateInvoice = async () => {
    if (invoiceExists) {
      toast.info("Hóa đơn đã được tạo trước đó!");
      return;
    }

    try {
      const paymentData = {
        paymentMethod,
        amount: totalAmount,
      };

      const response = await axios.post(
        `http://localhost:8080/api/payments/payment?reservationId=${reservation.reservationId}`,
        paymentData
      );

      if (response.status === 200) {
        toast.success("Hóa đơn đã được tạo thành công!");
        setInvoiceExists(true);
      } else {
        toast.error("Không thể tạo hóa đơn. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      toast.error("Đã xảy ra lỗi khi tạo hóa đơn.");
    }
  };
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  const printInvoice = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    doc.text(removeAccents("HOA ĐON"), doc.internal.pageSize.width / 2, 30, { align: "center" });
  
    doc.setFontSize(12);
    doc.text(`KHACH HANG: ${removeAccents(reservation.user.username)}`, 20, 50);
    doc.text(
      `THOI GIAN: ${new Date(reservation.reservationDate).toLocaleDateString()} ${reservation.reservationTime}`,
      20,
      60
    );
  
    autoTable(doc, {
      startY: 70,
      head: [
        [
          removeAccents("Món"),
          removeAccents("Giá"),
          removeAccents("Giảm giá (%)"),
          removeAccents("Thành tiền"),
        ],
      ],
      body: items.map((item) => [
        removeAccents(`${item.quantity}x ${item.foodItem.name}`),
        `${item.foodItem.price.toLocaleString()} VND`,
        `${getDiscountPercentage(item.foodItem.foodItemId)}%`,
        `${calculateDiscountedPrice(item).toLocaleString()} VND`,
      ]),
      theme: "grid",
      styles: { halign: "center" },
      headStyles: { fillColor: [0, 128, 0] },
      margin: { top: 10, left: 20, right: 20 },
    });
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      `TONG CONG: ${totalAmount.toLocaleString()} VND`,
      20,
      doc.lastAutoTable.finalY + 10
    );
  
    doc.save("hoa_don.pdf");
  };

  const handlePayment = async () => {
      const token = Cookies.get("token");
    if (!invoiceExists) {
      toast.info("Hóa đơn chưa được tạo");
      return;
    }
    try {
      // Gọi API để cập nhật trạng thái thanh toán với header Authorization
      const response = await axios.put(
        `http://localhost:8080/api/payments/updatestatus/${reservation.reservationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Xử lý khi gọi API thành công
      if (response.status === 200) {
        handleCloseInvoice();
        toast.success("Thanh toán thành công!");
      } else {
        toast.error("Cập nhật trạng thái thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
      toast.error("Đã xảy ra lỗi! Vui lòng thử lại sau.");
    }
  
  };
  if (!reservation || !items.length) {
    return <div>Không có dữ liệu hóa đơn!</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <ToastContainer />
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Hóa đơn</h2>
      </div>
      <div className="mb-4 text-sm">
        <p>
          <strong>KHÁCH HÀNG:</strong> {reservation.user.username}
        </p>
        <p>
          <strong>Thời gian:</strong>{" "}
          {new Date(reservation.reservationDate).toLocaleDateString()} {reservation.reservationTime}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Phương thức thanh toán</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="Tiền Mặt">Tiền Mặt</option>
          <option value="Chuyển Khoản">Chuyển Khoản</option>
        </select>
      </div>

      <table className="min-w-full table-auto text-left border-collapse mb-6">
        <thead className="bg-yellow-400 text-white">
          <tr>
            <th className="py-2 px-4 border">MÓN</th>
            <th className="py-2 px-4 border">GIÁ</th>
            <th className="py-2 px-4 border">GIẢM GIÁ (%)</th>
            <th className="py-2 px-4 border">THÀNH TIỀN</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">
                {item.quantity}x {item.foodItem.name}
              </td>
              <td className="py-2 px-4">{item.foodItem.price.toLocaleString()} VND</td>
              <td className="py-2 px-4">{getDiscountPercentage(item.foodItem.foodItemId)}%</td>
              <td className="py-2 px-4">{calculateDiscountedPrice(item).toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-xl font-bold mb-4">
        <p>TỔNG CỘNG:</p>
        <p className="text-red-500">{totalAmount.toLocaleString()} VND</p>
      </div>

      <div className="flex justify-between text-center">
        {!invoiceExists ? (
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={handleCreateInvoice}
          >
            Tạo hóa đơn
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={printInvoice}
          >
            In hóa đơn
          </button>
        )}
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handlePayment}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Invoice;
