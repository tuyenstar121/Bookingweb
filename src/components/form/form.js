import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './form.css';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserId = Cookies.get('userId');

    if (storedUserId) {
      axios.get(`http://localhost:8080/api/users/id/${storedUserId}`)
        .then(response => {
          const user = response.data;
          setUser(user);
          setFormData((prevData) => ({
            ...prevData,
            name: user.username,
            phone: user.phone,
            email: user.email,
          }));
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Thông tin người đặt</h3>
      <div className="form-group">
        <label htmlFor="name">Tên liên lạc <span className="required">*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nhập tên liên hệ"
          className="input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nhập số điện thoại"
          className="input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email <span className="required">*</span></label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập Email"
          className="input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Ghi chú</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Nhập ghi chú"
          className="textarea"
        />
      </div>

    </form>
  );
};

export default ReservationForm;
