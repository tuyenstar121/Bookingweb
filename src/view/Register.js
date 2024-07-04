import React, { useState } from "react";
import Axios from "axios";

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
        dob: formData.dob,
        email: formData.email,
        role: "user",
      });

      console.log("Registration successful:", response.data);
      // Redirect or show success message
    } catch (error) {
      console.error("Registration failed:", error.response.data);
      // Display error message to user
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng ký</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Tên đăng nhập:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tên đăng nhập"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmpwd" className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu:
            </label>
            <input
              type="password"
              id="confirmpwd"
              name="confirmpwd"
              value={formData.confirmpwd}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu"
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 ${
                passwordMismatch ? "border-red-500" : ""
              }`}
              required
            />
            {passwordMismatch && (
              <p className="text-red-500 text-xs mt-1">Mật khẩu không khớp</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Số điện thoại:
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
   
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Đăng ký
            </button>
            <a href="/login" className="text-sm text-gray-600 hover:underline">
              Đã có tài khoản? Đăng nhập
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
