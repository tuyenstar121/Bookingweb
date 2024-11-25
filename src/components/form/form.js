import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReservationForm = ({ loggedInUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUserId = Cookies.get('userId');
    const token = Cookies.get('token'); // Lấy mã thông báo từ cookie

    if (storedUserId) {
      axios.get(`http://localhost:8080/api/users/id/${storedUserId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Thêm mã thông báo vào tiêu đề
        }
      })
        .then(response => {
          const user = response.data;
          setFormData({
            name: user.username,
            phone: user.phone,
            email: user.email,
            notes: '',
          });
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          setError('Error fetching user data');
        })
        .finally(() => {
          setLoading(false); // Đặt trạng thái tải xong
        });
    } else {
      setLoading(false); // Đặt trạng thái tải xong nếu không có userId
    }
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    console.log('Form submitted:', formData);
    toast.success('Đã gửi biểu mẫu thành công!');
    // Add your form submission logic here (e.g., send data to server)
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Thông Tin Người Đặt</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên liên lạc <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
            placeholder="Nhập tên liên hệ"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
            placeholder="Nhập Email"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Ghi chú</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
            placeholder="Nhập ghi chú"
          />
        </div>
        <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
          Cập nhật
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ReservationForm;
