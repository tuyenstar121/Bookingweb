import React from "react";

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 text-center">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={onConfirm}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
