import React, { useState } from 'react';
import './password.css'
const PasswordManagementForm = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password update form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Quản lý mật khẩu</h3>
      <div className="form-group">
        <label htmlFor="oldPassword">Mật khẩu cũ</label>
        <input
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          placeholder="Nhập mật khẩu cũ"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="newPassword">Mật khẩu mới</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Nhập mật khẩu mới"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Nhập lại mật khẩu mới"
          required
        />
      </div>
      <button type="submit" className="submit-button">Cập nhật</button>
    </form>
  );
};

export default PasswordManagementForm;
