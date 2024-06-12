import React, { useState, useEffect, useCallback } from "react";
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
import "./Table.css";

export default function UserManagementTable() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
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

  const handleEditSubmit = () => {
    // Implement your edit functionality here
    console.log("Editing user:", editUser);
    handleDialogClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${deleteUser.userId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        console.log("User deleted:", deleteUser.userId);
        fetchUsers(); // Fetch updated user data
        handleDialogClose();
      } else {
        console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>User Management</h3>
      <TableContainer component={Paper} className="table-container mt-4">
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Phone Number</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Role</TableCell>
              <TableCell align="left">Address</TableCell>
              <TableCell align="left">Birth Date</TableCell>
              <TableCell align="left">Gender</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.username}</TableCell>
                <TableCell align="left">{user.phone}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">{user.role}</TableCell>
                <TableCell align="left">{user.address}</TableCell>
                <TableCell align="left">{user.dateOfBirth}</TableCell>
                <TableCell align="left">{user.gender}</TableCell>
                <TableCell align="left">
                  <Button
                    variant="contained"
                    className="btn btn-primary me-2"
                    onClick={() => handleDialogOpen(user, "edit")}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    className="btn btn-danger"
                    onClick={() => handleDialogOpen(user, "delete")}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Edit/Delete User Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {editUser ? "Edit User" : deleteUser ? "Delete User" : ""}
        </DialogTitle>
        <DialogContent>
          {editUser && (
            <>
              <TextField
                label="Name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
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
              <TextField
                label="Role"
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Address"
                value={editUser.address}
                onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Birth Date"
                value={editUser.dateOfBirth}
                onChange={(e) => setEditUser({ ...editUser, dateOfBirth: e.target.value })}
                fullWidth
                className="mb-3"
              />
              <TextField
                label="Gender"
                value={editUser.gender}
                onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
                fullWidth
                className="mb-3"
              />
            </>
          )}
          {deleteUser && (
            <p>Are you sure you want to delete {deleteUser.name}?</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button className="btn btn-secondary" onClick={handleDialogClose}>
            Cancel
          </Button>
          {editUser && (
            <Button className="btn btn-primary" onClick={handleEditSubmit}>
              Save
            </Button>
          )}
          {deleteUser && (
            <Button className="btn btn-danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
