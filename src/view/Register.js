import React, { useState } from "react";
import Axios from "axios";
import "../style/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmpwd: "",
    mobile: "",
    address: "",
    dob: "",
    email: "",
  });

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Check if passwords match when typing
    if (e.target.name === "confirmpwd") {
      setPasswordMismatch(e.target.value !== formData.password);
    }
  };

  const handleRegister = async (e) => {
  
    e.preventDefault();

    if (passwordMismatch) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const response = await Axios.post("http://localhost:8080/auth/register", {
        username: formData.username,
        password: formData.password,
        mobile: formData.mobile,
        address: formData.address,
        d: formData.dob,
        email: formData.email,
        role: 'user',
      });

      console.log("Registration successful:", response.data);
      // You can redirect the user to a success page or show a success message
    } catch (error) {
      console.error("Registration failed:", error.response.data);
      // You can display an error message to the user
    }
  };

  return (

    <div className="background">
      <div className="home">
      <h2>Register</h2>
      
      <form onSubmit={handleRegister} className="form-grid">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmpwd"
            value={formData.confirmpwd}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          {passwordMismatch && <p className="error-message">Passwords do not match</p>}
        </div>
      <div className="form-group">
        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
        />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
      </div>
      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
      </div>

   
   
    
    </form>
    <div className="buton">
    <button type="submit" onClick={handleRegister}>Register</button>

      <a href="/login">Sign in</a>
</div>
</div>
  </div>
);
  }

export default Register;
