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

export default function FoodManagement() {
  const [foodItems, setFoodItems] = useState([]);
  const [editFoodItem, setEditFoodItem] = useState(null);
  const [deleteFoodItem, setDeleteFoodItem] = useState(null);
  const [newFoodItem, setNewFoodItem] = useState({ name: "", price: "", description: "", categoryId: "" });
  const [openDialog, setOpenDialog] = useState(false);

  const fetchFoodItems = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await fetch("http://localhost:8080/api/food/all", {
        headers: {
          'Authorization': `Bearer ${token}` // Add token to headers
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
      setNewFoodItem({ name: "", price: "", description: "", categoryId: "" });
      setEditFoodItem(null);
      setDeleteFoodItem(null);
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setEditFoodItem(null);
    setDeleteFoodItem(null);
    setNewFoodItem(null);
    setOpenDialog(false);
  };

  const handleEditSubmit = async () => {
    if (!editFoodItem.name || !editFoodItem.price || !editFoodItem.description || !editFoodItem.categoryId) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/food/edit/${editFoodItem.foodItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFoodItem),
      });

      if (response.ok) {
        fetchFoodItems();
        handleDialogClose();
      } else {
        console.error("Error updating food item:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/food/delete/${deleteFoodItem.foodItemId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchFoodItems();
        handleDialogClose();
      } else {
        console.error("Error deleting food item:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  const handleAddSubmit = async () => {
    if (!newFoodItem.name || !newFoodItem.price || !newFoodItem.description || !newFoodItem.categoryId) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/food/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFoodItem),
      });

      if (response.ok) {
        fetchFoodItems();
        handleDialogClose();
      } else {
        console.error("Error adding food item:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-xl font-bold mb-4">Food Management</h3>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => handleDialogOpen(null, "add")}
      >
        Add Food Item
      </button>
      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold">Name</TableCell>
              <TableCell className="font-semibold">Image</TableCell>
              <TableCell className="font-semibold" align="left">Price</TableCell>
              <TableCell className="font-semibold" align="left">Description</TableCell>
              <TableCell className="font-semibold" align="left">Category ID</TableCell>
              <TableCell className="font-semibold" align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodItems.map((foodItem) => (
              <TableRow key={foodItem.foodItemId}>
                <TableCell>{foodItem.name}</TableCell>
                <TableCell>
                  <img
                    src={foodItem.img}
                    alt={foodItem.name}
                    style={{
                      width: "100px",  // Fixed width
                      height: "auto",  // Maintain aspect ratio
                      objectFit: "contain"  // Ensure image fits within dimensions
                    }}
                  />
                </TableCell>
                <TableCell align="left">{foodItem.price}</TableCell>
                <TableCell align="left">{foodItem.description}</TableCell>
                <TableCell align="left">{foodItem.categoryId}</TableCell>
                <TableCell align="left">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                    onClick={() => handleDialogOpen(foodItem, "edit")}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded"
                    onClick={() => handleDialogOpen(foodItem, "delete")}
                  >
                    Delete
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
                label="Name"
                value={editFoodItem.name}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, name: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Price"
                value={editFoodItem.price}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, price: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Description"
                value={editFoodItem.description}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, description: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Category ID"
                value={editFoodItem.categoryId}
                onChange={(e) => setEditFoodItem({ ...editFoodItem, categoryId: e.target.value })}
                fullWidth
                className="mb-3"
              />
            </>
          )}
          {deleteFoodItem && (
            <p>Are you sure you want to delete {deleteFoodItem.name}?</p>
          )}
          {!editFoodItem && !deleteFoodItem && (
            <>
              <TextField
                label="Name"
                value={newFoodItem.name}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, name: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Price"
                value={newFoodItem.price}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, price: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Description"
                value={newFoodItem.description}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, description: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Category ID"
                value={newFoodItem.categoryId}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, categoryId: e.target.value })}
                fullWidth
                className="mb-3"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          {editFoodItem && (
            <Button onClick={handleEditSubmit} color="primary">
              Save
            </Button>
          )}
          {deleteFoodItem && (
            <Button onClick={handleDeleteConfirm} color="secondary">
              Delete
            </Button>
          )}
          {!editFoodItem && !deleteFoodItem && (
            <Button onClick={handleAddSubmit} color="primary">
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
