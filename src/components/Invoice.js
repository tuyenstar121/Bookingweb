import React from "react";

const Invoice = () => {
  const invoiceData = {
    customerName: "NGUYEN HUY GIAP",
    time: "16:20:20",
    items: [
      { name: "Bánh cuốn", quantity: 2, price: 42500, total: 85000 },
      { name: "Salad", quantity: 1, price: 50000, total: 50000 },
      { name: "Pizza chay", quantity: 1, price: 120000, total: 120000 },
      { name: "Nước cam", quantity: 2, price: 50000, total: 100000 },
      { name: "Bánh phở mai", quantity: 2, price: 70000, total: 140000 },
    ],
    totalAmount: 495000,
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Hóa đơn</h2>
      </div>
      <div className="mb-4 text-sm">
        <p><strong>KHÁCH HÀNG:</strong> {invoiceData.customerName}</p>
        <p><strong>Thời gian:</strong> {invoiceData.time}</p>
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
          {invoiceData.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">{item.quantity}x {item.name}</td>
              <td className="py-2 px-4">{item.price.toLocaleString()} VND</td>
              <td className="py-2 px-4">{item.total.toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          <p>TỔNG CỘNG:</p>
          <p className="text-red-500">{invoiceData.totalAmount.toLocaleString()} VND</p>
        </div>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            In hóa đơn
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
