import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { TextField } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            if (!token) throw new Error('Không tìm thấy JWT token');

            const response = await fetch("http://localhost:8080/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Lỗi kết nối mạng');

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
            setError("Không thể tải dữ liệu người dùng.");
            toast.error("Không thể tải dữ liệu người dùng.");
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
            if (!token) throw new Error('Không tìm thấy JWT token');

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
                toast.success("Cập nhật người dùng thành công!");
            } else throw new Error('Lỗi khi cập nhật người dùng');
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            setError("Không thể cập nhật người dùng.");
            toast.error("Không thể cập nhật người dùng.");
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) throw new Error('Không tìm thấy JWT token');

            const response = await fetch(`http://localhost:8080/api/users/${deleteUser.userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchUsers();
                handleDialogClose();
                toast.success("Xóa người dùng thành công!");
            } else throw new Error('Lỗi khi xóa người dùng');
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            setError("Không thể xóa người dùng.");
            toast.error("Không thể xóa người dùng.");
        }
    };

    return (
        <div className="p-6 min-h-screen w-3/4 mx-auto">
            <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
            <div className="mb-4 p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-end mb-4">
                    <div className="flex items-end gap-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng"
                            className="border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                    </div>
                </div>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="bg-white shadow rounded-lg p-4">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b text-left">Tên</th>
                            <th className="px-4 py-2 border-b text-left">Vai trò</th>
                            <th className="px-4 py-2 border-b text-left">Số điện thoại</th>
                            <th className="px-4 py-2 border-b text-left">Giới tính</th>
                            <th className="px-4 py-2 border-b text-left">Hành động</th>
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
                                    <button onClick={() => handleDialogOpen(user, "edit")} className="text-blue-500 hover:underline">Chỉnh sửa</button>
                                    <button onClick={() => handleDialogOpen(user, "delete")} className="text-red-500 hover:underline">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-gray-500">Hiển thị {users.length} người dùng</span>
                </div>
                {openDialog && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg max-w-md w-full">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold">
                                    {editUser ? "Chỉnh sửa người dùng" : deleteUser ? "Xóa người dùng" : ""}
                                </h2>
                            </div>
                            <div className="mb-4">
                                {editUser && (
                                    <>
                                        <TextField
                                            label="Tên"
                                            value={editUser.username}
                                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                            fullWidth
                                            className="mb-3"
                                        />
                                        <TextField
                                            label="Số điện thoại"
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
                                            <label className="block mb-2">Vai trò</label>
                                            <select
                                                value={editUser.role}
                                                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                                className="w-full p-2 border rounded"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="User">User</option>
                                                <option value="User">Staff</option>
                                            </select>
                                        </div>
                                        <TextField
                                            label="URL hình ảnh"
                                            value={editUser.img}
                                            onChange={(e) => setEditUser({ ...editUser, img: e.target.value })}
                                            fullWidth
                                            className="mb-3"
                                        />
                                        <div className="mb-3">
                                            <label className="block mb-2">Giới tính</label>
                                            <select
                                                value={editUser.gender || ""}
                                                onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
                                                className="w-full p-2 border rounded"
                                            >
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                {deleteUser && (
                                    <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-4">
                                <button onClick={handleDialogClose} className="bg-gray-300 text-white px-4 py-2 rounded">
                                    Hủy
                                </button>
                                {editUser && (
                                    <button onClick={handleEditSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                                        Lưu
                                    </button>
                                )}
                                {deleteUser && (
                                    <button onClick={handleDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded">
                                        Xóa
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer></ToastContainer>
        </div>
    );
}
