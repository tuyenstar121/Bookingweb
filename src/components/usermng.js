import React, { useState, useEffect, useCallback } from "react";
import "./Table.css";
import {
  TextField,
} from "@mui/material";
import Cookies from 'js-cookie';

export default function UserManagementTable() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('')
  const fetchUsers = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }

      const response = await fetch("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data.");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDialogOpen = (user, action) => {
    if (action === "edit") {
      setEditUser(user);
    } else if (action === "delete") {
      setDeleteUser(user);
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setEditUser(null);
    setDeleteUser(null);
    setOpenDialog(false);
  };

  const handleEditSubmit = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }

      const response = await fetch(`http://localhost:8080/api/users/${editUser.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editUser),
      });

      if (response.ok) {
        fetchUsers();
        handleDialogClose();
      } else {
        throw new Error('Error updating user');
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }

      const response = await fetch(`http://localhost:8080/api/users/${deleteUser.userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUsers();
        handleDialogClose();
      } else {
        throw new Error('Error deleting user');
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <h3 className="text-2xl font-bold">Quản lý người dùng</h3>
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          onChange={(e) => { setSearch(e.target.value) }}
          className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-500"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Tên</th>
              <th className="py-2 px-4 border-b">SĐT</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Quyền</th>
              <th className="py-2 px-4 border-b">Ảnh</th>
              <th className="py-2 px-4 border-b">Ngày sinh</th>
              <th className="py-2 px-4 border-b">Giới tính</th>
              <th className="py-2 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.filter((user) => {
              return user.email.toLowerCase().includes(search.toLowerCase())
                || user.phone.toLowerCase().includes(search.toLowerCase())
                || user.username.toLowerCase().includes(search.toLowerCase())
            }).map((user) => (
              <tr key={user.userId}>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.phone}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <img
                    src={user.img}
                    alt={user.username}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover"
                    }}
                  />
                </td>
                <td className="py-2 px-4 border-b">{user.dateOfBirth}</td>
                <td className="py-2 px-4 border-b">{user.gender}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleDialogOpen(user, "edit")}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDialogOpen(user, "delete")}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                {editUser ? "Edit User" : deleteUser ? "Delete User" : ""}
              </h2>
            </div>
            <div className="mb-4">
              {editUser && (
                <>
                  <TextField
                    label="Name"
                    value={editUser.username}
                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                    fullWidth
                    className="mb-3"
                  />
                  <TextField
                    label="Phone Number"
                    value={editUser.phone}
                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                    fullWidth
                    className="mb-3"
                  />
                  <TextField
                    label="Email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    fullWidth
                    className="mb-3"
                  />
                  <div className="mb-3">
                    <label className="block mb-2">Role</label>
                    <select
                      value={editUser.role}
                      onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  <TextField
                    label="Image URL"
                    value={editUser.img}
                    onChange={(e) => setEditUser({ ...editUser, img: e.target.value })}
                    fullWidth
                    className="mb-3"
                  />
                  <TextField
                    label="Date of Birth"
                    type="date"
                    value={editUser.dateOfBirth}
                    onChange={(e) => setEditUser({ ...editUser, dateOfBirth: e.target.value })}
                    fullWidth
                    className="mb-3"
                    InputLabelProps={{ shrink: true }}
                  />
                  <div className="mb-3">
                    <label className="block mb-2">Gender</label>
                    <select
                      value={editUser.gender}
                      onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </>
              )}
              {deleteUser && <p>Are you sure you want to delete {deleteUser.username}?</p>}
            </div>
            <div className="flex justify-end space-x-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleDialogClose}>
                Cancel
              </button>
              {editUser && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleEditSubmit}>
                  Save
                </button>
              )}
              {deleteUser && (
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteConfirm}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
