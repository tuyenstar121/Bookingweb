import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordManagementForm = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTogglePassword = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new password and confirmation password match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu mới và nhập lại mật khẩu không khớp.');
      return;
    }

    try {
      const userId = Cookies.get('userId');
      const token = Cookies.get('token');

      const response = await axios.post('http://localhost:8080/auth/change-password', {
        userid: userId,  // Use userId from cookies
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Thay đổi mật khẩu thành công.');
    } catch (error) {
      toast.error(error.response?.data || 'Lỗi');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-2xl font-bold mb-6">Quản lý mật khẩu</h3>
        <div className="mb-4 relative">
          <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Mật khẩu cũ
          </label>
          <input
            type={showPasswords.oldPassword ? "text" : "password"}
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Nhập mật khẩu cũ"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <FontAwesomeIcon
            icon={showPasswords.oldPassword ? faEyeSlash : faEye}
            onClick={() => handleTogglePassword('oldPassword')}
            className="absolute top-2 right-3 cursor-pointer"
          />
        </div>
        <div className="mb-4 relative">
          <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Mật khẩu mới
          </label>
          <input
            type={showPasswords.newPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Nhập mật khẩu mới"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <FontAwesomeIcon
            icon={showPasswords.newPassword ? faEyeSlash : faEye}
            onClick={() => handleTogglePassword('newPassword')}
            className="absolute top-2 right-3 cursor-pointer"
          />
        </div>
        <div className="mb-6 relative">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Nhập lại mật khẩu
          </label>
          <input
            type={showPasswords.confirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu mới"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
          <FontAwesomeIcon
            icon={showPasswords.confirmPassword ? faEyeSlash : faEye}
            onClick={() => handleTogglePassword('confirmPassword')}
            className="absolute top-2 right-3 cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cập nhật
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PasswordManagementForm;
