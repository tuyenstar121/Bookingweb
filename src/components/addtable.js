import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, Select, MenuItem, InputLabel } from "@mui/material";

function AddTableForm({ open, onClose, onAdd }) {
  const [tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Available"); // Mặc định trạng thái là "Available"

  const handleAdd = () => {
    // Validate inputs
    if (tableName.trim() === "" || capacity.trim() === "") {
      return;
    }

    // Create new table object
    const newTable = {
      tableName,
      capacity: parseInt(capacity),
      status,
    };

    // Call the parent onAdd function
    onAdd(newTable);

    // Reset form fields
    setTableName("");
    setCapacity("");
    setStatus("Available");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Table</DialogTitle>
      <DialogContent>
        <TextField label="Table Name" value={tableName} onChange={(e) => setTableName(e.target.value)} fullWidth />
        <TextField label="Capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} fullWidth />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Occupied">Occupied</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTableForm;

