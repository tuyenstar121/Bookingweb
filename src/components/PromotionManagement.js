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
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import UploadImage from "./Common/UploadImage";

export default function PromotionManager() {
  const [promotions, setPromotions] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [editPromotion, setEditPromotion] = useState(null);
  const [deletePromotion, setDeletePromotion] = useState(null);
  const [newPromotion, setNewPromotion] = useState({ name: "", discountPercentage: "", description: "", image: "", foodIds: "", startDate: "", endDate: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPromotions = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await fetch("http://localhost:8080/api/promotions", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPromotions(data);
      console.log(promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

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
      console.error("Error fetching food items:", error);
    }
  }, []);

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  const handleDialogOpen = (promotion, action) => {
    if (action === "edit") {
      setEditPromotion(promotion);
      setNewPromotion(null);
    } else if (action === "delete") {
      setDeletePromotion(promotion);
      setNewPromotion(null);
    } else if (action === "add") {
      setNewPromotion({ name: "", discountPercentage: "", description: "", startDate: "", endDate: "" });
      setEditPromotion(null);
      setDeletePromotion(null);
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setEditPromotion(null);
    setDeletePromotion(null);
    setNewPromotion({ name: "", discountPercentage: "", description: "", startDate: "", endDate: "" });
    setOpenDialog(false);
  };

  const handleEditSubmit = async () => {
    if (!editPromotion?.name || !editPromotion?.discountPercentage || !editPromotion?.description || !editPromotion?.startDate || !editPromotion?.endDate) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }

      const response = await fetch(`http://localhost:8080/api/promotions/${editPromotion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editPromotion),
      });

      if (response.ok) {
        fetchPromotions();
        handleDialogClose();
      } else {
        const errorData = await response.json();
        console.error("Error updating promotion:", errorData.message || response.statusText);
        alert(`Failed to update promotion: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating promotion:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:8080/api/promotions/${deletePromotion.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (response.ok) {
        fetchPromotions();
        handleDialogClose();
      } else {
        const errorData = await response.json();
        console.error("Error deleting promotion:", errorData.message || response.statusText);
        alert(`Failed to delete promotion: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleAddSubmit = async () => {
    const { name, discountPercentage, description, image, foodIds, startDate, endDate } = newPromotion;

    if (!name || !discountPercentage || !description || !startDate || !endDate || !image || !foodIds) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = Cookies.get('token');

      const response = await fetch("http://localhost:8080/api/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newPromotion),
      });

      if (response.ok) {
        fetchPromotions();
        handleDialogClose();
      } else {
        const errorData = await response.json();
        console.error("Error adding promotion:", errorData.message || response.statusText);
        alert(`Failed to add promotion: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error adding promotion:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-xl font-bold mb-4">Quản lý chương trình khuyến mãi</h3>
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
        Thêm chương trình mới
      </button>
      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold">Tên</TableCell>
              <TableCell className="font-semibold" align="left">Giảm giá (%)</TableCell>
              <TableCell className="font-semibold" align="left">Mô tả</TableCell>
              <TableCell className="font-semibold" align="left">Ngày bắt đầu</TableCell>
              <TableCell className="font-semibold" align="left">Ngày kết thúc</TableCell>
              <TableCell className="font-semibold" align="left">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions
              .filter((promotion) => {
                return promotion.name.toLowerCase().includes(search.toLowerCase())
                  || promotion.discountPercentage.toString().toLowerCase().includes(search.toLowerCase())
                  || promotion.description.toLowerCase().includes(search.toLowerCase());
              })
              .map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>{promotion.name}</TableCell>
                  <TableCell align="left">{promotion.discountPercentage}</TableCell>
                  <TableCell align="left">{promotion.description}</TableCell>
                  <TableCell align="left">{promotion.startDate}</TableCell>
                  <TableCell align="left">{promotion.endDate}</TableCell>
                  <TableCell align="left">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                      onClick={() => handleDialogOpen(promotion, "edit")}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded"
                      onClick={() => handleDialogOpen(promotion, "delete")}
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
          {editPromotion ? "Sửa chương trình khuyến mãi" : deletePromotion ? "Xóa chương trình khuyến mãi" : "Thêm chương trình khuyến mãi"}
        </DialogTitle>
        <DialogContent>
          {editPromotion && (
            <>
              <TextField
                label="Tên"
                value={editPromotion.name || ""}
                onChange={(e) => setEditPromotion({ ...editPromotion, name: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                type="number"
                label="Giảm giá (%)"
                value={editPromotion.discountPercentage || ""}
                onChange={(e) => setEditPromotion({ ...editPromotion, discountPercentage: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Mô tả"
                value={editPromotion.description || ""}
                onChange={(e) => setEditPromotion({ ...editPromotion, description: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <DatePicker
                label="Ngày bắt đầu"
                value={dayjs(editPromotion.startDate) || ""}
                onChange={(e) => setEditPromotion({ ...editPromotion, startDate: dayjs(e).format('YYYY-MM-DD') })}
                fullWidth
                className="mb-3"
                sx={{ width: '100%' }}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={dayjs(editPromotion.endDate) || ""}
                onChange={(e) => setEditPromotion({ ...editPromotion, endDate: dayjs(e).format('YYYY-MM-DD') })}
                fullWidth
                className="mb-3"
                sx={{ width: '100%' }}
              />
              <UploadImage
                defaultImage={editPromotion.image}
                onChange={(url) => {
                  setEditPromotion({ ...editPromotion, image: url })
                }}
              />
            </>
          )}
          {deletePromotion && (
            <p>Bạn có chắc chắn xóa chương trình khuyến mãi {deletePromotion?.name}?</p>
          )}
          {!editPromotion && !deletePromotion && (
            <>
              <TextField
                label="Tiêu đề"
                value={newPromotion.name || ""}
                onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                type="number"
                label="Giảm giá (%)"
                value={newPromotion.discountPercentage || ""}
                onChange={(e) => setNewPromotion({ ...newPromotion, discountPercentage: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Mô tả"
                value={newPromotion.description || ""}
                onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <DatePicker
                label="Ngày bắt đầu"
                value={dayjs(newPromotion.startDate) || ""}
                onChange={(e) => setNewPromotion({ ...newPromotion, startDate: dayjs(e).format('YYYY-MM-DD') })}
                sx={{ width: '100%' }}
                className="mb-3"
              />
              <DatePicker
                label="Ngày kết thúc"
                value={dayjs(newPromotion.endDate) || ""}
                onChange={(e) => setNewPromotion({ ...newPromotion, endDate: dayjs(e).format('YYYY-MM-DD') })}
                sx={{ width: '100%' }}
                className="mb-3"
              />
              <Autocomplete
                fullWidth
                multiple
                disablePortal
                options={foodItems?.map(foodItem => ({ ...foodItem, label: foodItem.name }))}
                renderInput={(params) => <TextField {...params} label="Món ăn áp dụng khuyến mãi" />}
                onChange={(_, value) => setNewPromotion({ ...newPromotion, foodIds: value?.map(item => item?.foodItemId) })}
              />
              <UploadImage onChange={(url) => { setNewPromotion({ ...newPromotion, image: url }) }} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hủy
          </Button>
          {editPromotion && (
            <Button onClick={handleEditSubmit} color="primary">
              Lưu
            </Button>
          )}
          {deletePromotion && (
            <Button onClick={handleDeleteConfirm} color="secondary">
              Xóa
            </Button>
          )}
          {!editPromotion && !deletePromotion && (
            <Button onClick={handleAddSubmit} color="primary">
              Thêm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
