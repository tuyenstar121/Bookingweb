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
} from "@mui/material";

export default function PromotionManager() {
  const [foodItems, setFoodItems] = useState([]);
  const [editFoodItem, setEditFoodItem] = useState(null);
  const [deleteFoodItem, setDeleteFoodItem] = useState(null);
  const [newFoodItem, setNewFoodItem] = useState({ name: "", price: "", description: "", categoryId: "", img: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState('')

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
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }

      const updatedFoodItem = {
        ...editFoodItem,
        categoryId: editFoodItem.category.categoryId,  // Flattening the category object
      };
      console.log(JSON.stringify(updatedFoodItem));
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
      } else {
        const errorData = await response.json();
        console.error("Error updating food item:", errorData.message || response.statusText);
        alert(`Failed to update food item: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating food item:", error);
      alert(`An error occurred: ${error.message}`);
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
      } else {
        const errorData = await response.json();
        console.error("Error deleting food item:", errorData.message || response.statusText);
        alert(`Failed to delete food item: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting food item:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleAddSubmit = async () => {
    const { name, img, price, description, categoryId } = newFoodItem;

    // Validation: Ensure all fields are filled
    if (!name || !img || !price || !description || !categoryId) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = Cookies.get('token');

      // Send the POST request to add a new food item
      const response = await fetch("http://localhost:8080/api/food/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newFoodItem),
      });

      // Handle the response
      if (response.ok) {
        console.log("Food item added successfully");
        fetchFoodItems();  // Refresh the food items list
        handleDialogClose();  // Close the dialog
      } else {
        const errorData = await response.json();
        console.error("Error adding food item:", errorData.message || response.statusText);
        alert(`Failed to add food item: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error adding food item:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-xl font-bold mb-4">Quản lý món ăn</h3>
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
        Thêm món mới
      </button>
      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold">Tên</TableCell>
              <TableCell className="font-semibold">Hình ảnh</TableCell>
              <TableCell className="font-semibold" align="left">Giá</TableCell>
              <TableCell className="font-semibold" align="left">Mô tả</TableCell>
              <TableCell className="font-semibold" align="left">Danh mục</TableCell>
              <TableCell className="font-semibold" align="left">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodItems
              .filter(foodItem => foodItem && foodItem.category) // Filter out items with null category
              .filter((foodItem) => {
                return foodItem.name.toLowerCase().includes(search.toLowerCase())
                  || foodItem.price.toString().toLowerCase().includes(search.toLowerCase())
                  || foodItem.category.name.toLowerCase().includes(search.toLowerCase())
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
                      <span>Chưa có hình</span>
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
                      Sửa
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
          {editFoodItem ? "Edit Food Item" : deleteFoodItem ? "Delete Food Item" : "Add Food Item"}
        </DialogTitle>
        <DialogContent>
          {editFoodItem && (
            <>
              <TextField
                label="Tên"
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
                label="Mô tả"
                value={editFoodItem.description || ""}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, description: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="ID Danh mục"
                value={editFoodItem.category?.categoryId || ""}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, category: { ...editFoodItem.category, categoryId: e.target.value } })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="URL hình ảnh"
                value={editFoodItem.img || ""}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, img: e.target.value })}
                fullWidth
                className="mb-3"
              />
            </>
          )}
          {deleteFoodItem && (
            <p>Bạn có chắc chắn xóa {deleteFoodItem?.name}?</p>
          )}
          {!editFoodItem && !deleteFoodItem && (
            <>
              <TextField
                label="Tên"
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
                label="Mô tả"
                value={newFoodItem.description || ""}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, description: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="ID danh mục"
                value={newFoodItem.categoryId || ""}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, categoryId: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="URL hình ảnh"
                value={newFoodItem.img || ""}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, img: e.target.value })}
                fullWidth
                className="mb-3"
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
    </div>
  );
}
