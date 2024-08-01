import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

const dishes = [
  { id: 1, name: "Spaghetti Carbonara", price: 12.99, description: "Classic Italian pasta dish", image: "spaghetti.jpg" },
  { id: 2, name: "Grilled Salmon", price: 16.99, description: "Freshly grilled salmon with herbs", image: "salmon.jpg" },
  { id: 3, name: "Caesar Salad", price: 8.99, description: "Crispy romaine lettuce with Caesar dressing", image: "caesar.jpg" },
  // ... more dishes
];

export default function DishManagement() {
  const [editDish, setEditDish] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleEdit = (dish) => {
    setEditDish(dish);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditDish(null);
  };

  const handleEditSubmit = () => {
    // Implement your edit functionality here
    console.log("Editing dish:", editDish);
    handleEditDialogClose();
  };

  return (
    <div className="Dish">
      <h3>Dish Management</h3>
      <TableContainer component={Paper} style={{ boxShadow: "0px 13px 20px 0px #80808029" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dishes.map((dish) => (
              <TableRow key={dish.id}>
                <TableCell>
                  <img src={dish.image} alt={dish.name} style={{ maxWidth: "50px", maxHeight: "50px" }} />
                </TableCell>
                <TableCell>{dish.name}</TableCell>
                <TableCell align="left">${dish.price.toFixed(2)}</TableCell>
                <TableCell align="left">{dish.description}</TableCell>
                <TableCell align="left">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(dish)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Edit Dish Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Dish</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editDish ? editDish.name : ""}
            fullWidth
          />
          <TextField
            label="Price"
            value={editDish ? editDish.price : ""}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
