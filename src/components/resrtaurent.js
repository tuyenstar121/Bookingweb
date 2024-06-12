import React, { useState } from "react";
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

const initialRestaurants = [
  { id: 1, name: "Restaurant A", address: "Address A" },
  { id: 2, name: "Restaurant B", address: "Address B" },
  { id: 3, name: "Restaurant C", address: "Address C" },
];

export default function RestaurantManagementTable() {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [editRestaurant, setEditRestaurant] = useState(null);
  const [deleteRestaurant, setDeleteRestaurant] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEdit = (restaurant) => {
    setEditRestaurant(restaurant);
    setOpenEditDialog(true);
  };

  const handleDelete = (restaurant) => {
    setDeleteRestaurant(restaurant);
    setOpenDeleteDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditRestaurant(null);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeleteRestaurant(null);
  };

  const handleEditSubmit = () => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((rest) =>
        rest.id === editRestaurant.id ? editRestaurant : rest
      )
    );
    handleEditDialogClose();
  };

  const handleDeleteConfirm = () => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.filter((rest) => rest.id !== deleteRestaurant.id)
    );
    handleDeleteDialogClose();
  };

  return (
    <div className="container mt-4">
      <h3>Restaurant Management</h3>
      <TableContainer component={Paper} style={{ boxShadow: "0px 13px 20px 0px #80808029" }}>
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Address</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell>{restaurant.name}</TableCell>
                <TableCell align="left">{restaurant.address}</TableCell>
                <TableCell align="left">
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(restaurant)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(restaurant)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Edit Restaurant Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Restaurant</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editRestaurant ? editRestaurant.name : ""}
            onChange={(e) => setEditRestaurant({ ...editRestaurant, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            value={editRestaurant ? editRestaurant.address : ""}
            onChange={(e) => setEditRestaurant({ ...editRestaurant, address: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Restaurant Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Restaurant</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {deleteRestaurant ? deleteRestaurant.name : ""}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
