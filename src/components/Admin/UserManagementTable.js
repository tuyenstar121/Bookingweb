import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { TextField } from "@mui/material";

export default function UserManagementTable() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

   
    const fetchUsers = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            if (!token) throw new Error('No JWT token found');

            const response = await fetch("http://localhost:8080/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');

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
        if (action === "edit") setEditUser(user);
        else if (action === "delete") setDeleteUser(user);
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
            if (!token) throw new Error('No JWT token found');

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
            } else throw new Error('Error updating user');
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Failed to update user.");
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) throw new Error('No JWT token found');

            const response = await fetch(`http://localhost:8080/api/users/${deleteUser.userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchUsers();
                handleDialogClose();
            } else throw new Error('Error deleting user');
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Failed to delete user.");
        }
    };

    return (
        <div className="p-6 min-h-screen w-3/4 mx-auto  ">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="mb-4 p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-end gap-4">
            <input
              type="text"
              placeholder="Search User"
              className="border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500">
              Add User
            </button>
          </div>
        </div>
        </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="bg-white shadow rounded-lg p-4">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b text-left">Name</th>
                            <th className="px-4 py-2 border-b text-left">Role</th>
                            <th className="px-4 py-2 border-b text-left">Phone</th>
                            <th className="px-4 py-2 border-b text-left">Gender</th>
                            <th className="px-4 py-2 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userId} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b flex items-center">
                                    <img src={user.img || 'https://via.placeholder.com/40'} alt={user.username} className="w-10 h-10 rounded-full mr-3" />
                                    <div>
                                        <div className="font-semibold">{user.username}</div>
                                        <div className="text-gray-500 text-sm">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-b">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            user.role === 'Admin' ? 'bg-gray-800 text-white' : 'bg-green-500 text-white'
                                        }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border-b">{user.phone || 'N/A'}</td>
                                <td className="px-4 py-2 border-b">{user.gender || 'N/A'}</td>
                                <td className="px-4 py-2 border-b flex items-center space-x-4">
                                    <button onClick={() => handleDialogOpen(user, "edit")} className="text-blue-500 hover:underline">Edit</button>
                                    <button onClick={() => handleDialogOpen(user, "delete")} className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-gray-500">Showing {users.length} of total Users</span>
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
                                        <div className="mb-3">
                                            <label className="block mb-2">Gender</label>
                                            <select
                                                value={editUser.gender || ""}
                                                onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
                                                className="w-full p-2 border rounded"
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                {deleteUser && (
                                    <p>Are you sure you want to delete this user?</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button onClick={handleDialogClose} className="text-gray-500">Cancel</button>
                                {editUser && (
                                    <button onClick={handleEditSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                                )}
                                {deleteUser && (
                                    <button onClick={handleDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
