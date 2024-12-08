import React, { useState, useEffect, useCallback } from "react";
import Cookies from 'js-cookie';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from "@mui/material";
import UploadImage from "./Common/UploadImage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getCategoryById = (id, options) => {
  console.log({ id, options });
  return options?.filter((option) => option.categoryId === id)
}

export default function FoodManagement() {
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editFoodItem, setEditFoodItem] = useState(null);
  const [deleteFoodItem, setDeleteFoodItem] = useState(null);
  const [newFoodItem, setNewFoodItem] = useState({ name: "", price: "", description: "", categoryId: "", img: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState('');
  const fetchFoodItems = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await fetch("http://localhost:8080/api/food/all", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
    }
  }, []);
  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  const fetchCategories = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await fetch("http://localhost:8080/api/categories", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục món ăn:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDialogOpen = (foodItem, action) => {
    if (action === "edit") {
      setEditFoodItem(foodItem);
      setNewFoodItem(null);
    } else if (action === "delete") {
      setDeleteFoodItem(foodItem);
      setNewFoodItem(null);
    } else if (action === "add") {
      setNewFoodItem({ name: "", price: "", description: "", categoryId: "", img: "" });
      setEditFoodItem(null);
      setDeleteFoodItem(null);
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setEditFoodItem(null);
    setDeleteFoodItem(null);
    setNewFoodItem({ name: "", price: "", description: "", categoryId: "", img: "" }); // Reset to initial state
    setOpenDialog(false); // Close the dialog
  };

  const handleEditSubmit = async () => {
    if (!editFoodItem?.name || !editFoodItem?.price || !editFoodItem?.description || !editFoodItem?.category?.categoryId) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Không tìm thấy JWT token');
      }

      const updatedFoodItem = {
        ...editFoodItem,
        categoryId: editFoodItem.category.categoryId,  // Flattening the category object
      };
      const response = await fetch(`http://localhost:8080/api/food/edit/${editFoodItem.foodItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFoodItem),
      });

      if (response.ok) {
        fetchFoodItems();
        handleDialogClose();
        toast('Sửa thành công !')
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi cập nhật món ăn:", errorData.message || response.statusText);
        alert(`Cập nhật món ăn không thành công: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn:", error);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:8080/api/food/delete/${deleteFoodItem.foodItemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (response.ok) {
        fetchFoodItems();
        handleDialogClose();
        toast('Xóa thành công !')
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi xóa món ăn:", errorData.message || response.statusText);
        alert(`Xóa món ăn không thành công: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Lỗi khi xóa món ăn:", error);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  };

  const handleAddSubmit = async () => {
    const { name, img, price, description, categoryId } = newFoodItem;

    // Kiểm tra các trường hợp còn thiếu thông tin
    if (!name || !img || !price || !description || !categoryId) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const token = Cookies.get('token');

      // Gửi yêu cầu POST để thêm món ăn mới
      const response = await fetch("http://localhost:8080/api/food/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newFoodItem, categoryId: categoryId.categoryId }),
      });

      if (response.ok) {
        fetchFoodItems();  // Làm mới danh sách món ăn
        handleDialogClose();  // Đóng hộp thoại
        toast('Thêm thành công !')
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi thêm món ăn:", errorData.message || response.statusText);
        alert(`Thêm món ăn không thành công: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Lỗi khi thêm món ăn:", error);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-xl font-bold mb-4">Quản lý Món Ăn</h3>
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          onChange={(e) => { setSearch(e.target.value) }}
          className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-500"
        />
      </div>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => handleDialogOpen(null, "add")}
      >
        Thêm Món Ăn
      </button>

      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold">Tên Món</TableCell>
              <TableCell className="font-semibold">Hình Ảnh</TableCell>
              <TableCell className="font-semibold" align="left">Giá</TableCell>
              <TableCell className="font-semibold" align="left">Mô Tả</TableCell>
              <TableCell className="font-semibold" align="left">Danh Mục</TableCell>
              <TableCell className="font-semibold" align="left">Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodItems
              .filter(foodItem => foodItem && foodItem.category)
              .filter((foodItem) => {
                return foodItem.name.toLowerCase().includes(search.toLowerCase())
                  || foodItem.price.toString().toLowerCase().includes(search.toLowerCase())
              })
              .map((foodItem) => (
                <TableRow key={foodItem.foodItemId}>
                  <TableCell>{foodItem.name}</TableCell>
                  <TableCell>
                    {foodItem.img ? (
                      <img
                        src={foodItem.img}
                        alt={foodItem.name}
                        style={{
                          width: "100px",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span>Không có hình ảnh</span>
                    )}
                  </TableCell>
                  <TableCell align="left">{foodItem.price}</TableCell>
                  <TableCell align="left">{foodItem.description}</TableCell>
                  <TableCell align="left">{foodItem.category.name}</TableCell>
                  <TableCell align="left">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                      onClick={() => handleDialogOpen(foodItem, "edit")}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded"
                      onClick={() => handleDialogOpen(foodItem, "delete")}
                    >
                      Xóa
                    </button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {editFoodItem ? "Chỉnh Sửa Món Ăn" : deleteFoodItem ? "Xóa Món Ăn" : "Thêm Món Ăn"}
        </DialogTitle>
        <DialogContent>
          {editFoodItem && (
            <>
              <TextField
                label="Tên Món"
                value={editFoodItem.name || ""}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, name: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Giá"
                value={editFoodItem.price || ""}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, price: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Mô Tả"
                value={editFoodItem.description || ""}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, description: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <Autocomplete
                disablePortal
                defaultValue={{ ...editFoodItem?.category, label: editFoodItem?.category.name }}
                options={categories?.map((category, i) => ({ ...category, label: category.name }))}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Danh Mục" />}
                onChange={(e, newValue) => setEditFoodItem({ ...editFoodItem, category: newValue })}
              />
              <UploadImage
                defaultImage={editFoodItem.img}
                onChange={(url) => {
                  setEditFoodItem({ ...editFoodItem, img: url })
                }}
              />
            </>
          )}
          {deleteFoodItem && (
            <p>Bạn có chắc chắn muốn xóa món {deleteFoodItem?.name}?</p>
          )}
          {!editFoodItem && !deleteFoodItem && (
            <>
              <TextField
                label="Tên Món"
                value={newFoodItem.name || ""}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, name: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Giá"
                value={newFoodItem.price || ""}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, price: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Mô Tả"
                value={newFoodItem.description || ""}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, description: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <Autocomplete
                disablePortal
                options={categories?.map((category, i) => ({ ...category, label: category.name }))}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Danh Mục" />}
                onChange={(e, newValue) => setNewFoodItem({ ...newFoodItem, categoryId: newValue })}
              />
              <UploadImage
                defaultImage={newFoodItem.img}
                onChange={(url) => {
                  setNewFoodItem({ ...newFoodItem, img: url })
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hủy
          </Button>
          {editFoodItem && (
            <Button onClick={handleEditSubmit} color="primary">
              Lưu
            </Button>
          )}
          {deleteFoodItem && (
            <Button onClick={handleDeleteConfirm} color="secondary">
              Xóa
            </Button>
          )}
          {!editFoodItem && !deleteFoodItem && (
            <Button onClick={handleAddSubmit} color="primary">
              Thêm
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
}
