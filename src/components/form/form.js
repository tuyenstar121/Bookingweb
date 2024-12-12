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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUserId = Cookies.get('userId');
    const token = Cookies.get('token');

    if (storedUserId) {
      axios.get(`http://localhost:8080/api/users/id/${storedUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          const user = response.data;
          setFormData({
            name: user.username || '',
            phone: user.phone || '',
            email: user.email || '',
            notes: '',
          });
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          setError('Không thể tải thông tin người dùng, vui lòng thử lại sau');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
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
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '', // Reset lỗi khi người dùng thay đổi
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Kiểm tra tên
    if (!formData.name.trim()) {
      newErrors.name = 'Tên không được để trống hoặc chỉ chứa khoảng trắng.';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Tên phải có ít nhất 2 ký tự.';
    }

    // Kiểm tra số điện thoại
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống hoặc chỉ chứa khoảng trắng.';
    } else if (!/^\d{9,15}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải chỉ chứa số và có độ dài từ 10-11 ký tự.';
    }

    // Kiểm tra email
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống hoặc chỉ chứa khoảng trắng.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Địa chỉ email không hợp lệ.';
    }

    return newErrors;
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Vui lòng sửa các lỗi bên dưới.');
      return;
    }
    const storedUserId = Cookies.get('userId');
    const token = Cookies.get('token');
    axios.put(`http://localhost:8080/api/users/${storedUserId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        toast.success('Cập nhật thông tin thành công!');
      })
      .catch((error) => {
        console.error('Error updating user information:', error);
        toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      });

    // Add your form submission logic here
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Thông Tin Người Đặt</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên liên lạc <span className="text-red-500">*</span>
          </label>
          <input
            disabled="disabled"
            type="text"
            id="name"
            name="name"
            disabled
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2`}
            placeholder="Nhập tên liên hệ"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2`}
            placeholder="Nhập số điện thoại"
            required
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2`}
            placeholder="Nhập Email"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Ghi chú
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
            placeholder="Nhập ghi chú"
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Cập nhật
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ReservationForm;
