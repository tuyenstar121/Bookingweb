import React from "react";

const Invoice = ({ reservation, items = [] }) => {
  if (!reservation || !items.length) {
    return <div>Không có dữ liệu hóa đơn!</div>;
  }


  // Tính tổng cộng
  const totalAmount = items?.reduce(
    (total, item) => total + item.foodItem.price * item.quantity,
    0
  );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Hóa đơn</h2>
      </div>
      <div className="mb-4 text-sm">
        <p>
          <strong>KHÁCH HÀNG:</strong> {reservation.user.username}
        </p>
        <p>
          <strong>Thời gian:</strong>{" "}
          {new Date(reservation.reservationDate).toLocaleDateString()}{" "}
          {reservation.reservationTime}
        </p>
      </div>
      <table className="min-w-full table-auto text-left border-collapse mb-6">
        <thead className="bg-yellow-400 text-white">
          <tr>
            <th className="py-2 px-4 border">MÓN</th>
            <th className="py-2 px-4 border">GIÁ</th>
            <th className="py-2 px-4 border">TỔNG</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">
                {item.quantity}x {item.foodItem.name}
              </td>
              <td className="py-2 px-4">
                {item.foodItem.price.toLocaleString()} VND
              </td>
              <td className="py-2 px-4">
                {(item.foodItem.price * item.quantity).toLocaleString()} VND
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right text-xl font-bold">
        <p>TỔNG CỘNG:</p>
        <p className="text-red-500">{totalAmount.toLocaleString()} VND</p>
      </div>
    </div>
  );
};

export default Invoice;
