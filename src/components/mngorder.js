import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";


const reservationsData = [
  { id: 1, name: "John Doe", date: "2023-08-15", time: "18:00", guests: 4, phoneNumber: "123-456-7890", status: "Pending" },
  { id: 2, name: "Jane Smith", date: "2023-08-20", time: "19:30", guests: 2, phoneNumber: "987-654-3210", status: "Pending" },
  // Add more reservations as needed
];

function ReservationManagementTable() {
  const [reservations, setReservations] = useState(reservationsData);
  const [editReservation, setEditReservation] = useState(null);
  const [deleteReservation, setDeleteReservation] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEdit = (reservation) => {
    setEditReservation(reservation);
    setOpenEditDialog(true);
  };

  const handleDelete = (reservation) => {
    setDeleteReservation(reservation);
    setOpenDeleteDialog(true);
  };

  const handleApprove = (reservation) => {
    const updatedReservations = reservations.map((res) =>
      res.id === reservation.id ? { ...res, status: "Approved" } : res
    );
    setReservations(updatedReservations);
  };

  const handleReject = (reservation) => {
    const updatedReservations = reservations.map((res) =>
      res.id === reservation.id ? { ...res, status: "Rejected" } : res
    );
    setReservations(updatedReservations);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditReservation(null);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeleteReservation(null);
  };

  const handleEditSubmit = () => {
    // Implement your edit functionality here
    console.log("Editing reservation:", editReservation);
    handleEditDialogClose();
  };

  const handleDeleteConfirm = () => {
    // Implement your delete functionality here
    console.log("Deleting reservation:", deleteReservation);
    handleDeleteDialogClose();
  };

  return (
    <div className="Table">
      <h3>Reservation Management</h3>
      <TableContainer component={Paper} style={{ boxShadow: "0px 13px 20px 0px #80808029" }}>
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Time</TableCell>
              <TableCell align="left">Guests</TableCell>
              <TableCell align="left">Phone Number</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell align="left">{reservation.name}</TableCell>
                <TableCell align="left">{reservation.date}</TableCell>
                <TableCell align="left">{reservation.time}</TableCell>
                <TableCell align="left">{reservation.guests}</TableCell>
                <TableCell align="left">{reservation.phoneNumber}</TableCell>
                <TableCell align="left">
  <Button
    variant="outlined"
    color="primary"
    onClick={() => handleApprove(reservation)}
    className={reservation.status === "Approved" ? "status-approved" : reservation.status === "Pending" ? "status-pending" : "status-delivered"}
  >
    Approve
  </Button>
  <Button
    variant="outlined"
    color="secondary"
    onClick={() => handleReject(reservation)}
    className={reservation.status === "Approved" ? "status-approved" : reservation.status === "Pending" ? "status-pending" : "status-delivered"}
  >
    Reject
  </Button>
  <Button
    variant="outlined"
    color="primary"
    onClick={() => handleEdit(reservation)}
  >
    Edit
  </Button>
  <Button
    variant="outlined"
    color="secondary"
    onClick={() => handleDelete(reservation)}
  >
    Delete
  </Button>
</TableCell>
                <TableCell align="left">
                  {reservation.status === "Pending" && (
                    <>
                      <Button variant="outlined" color="primary" onClick={() => handleApprove(reservation)}>
                        Approve
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => handleReject(reservation)}>
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(reservation)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(reservation)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Edit Reservation Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Reservation</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={editReservation ? editReservation.name : ""} fullWidth />
          <TextField label="Date" type="date" value={editReservation ? editReservation.date : ""} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Time" type="time" value={editReservation ? editReservation.time : ""} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Guests" type="number" value={editReservation ? editReservation.guests : ""} fullWidth />
          <TextField label="Phone Number" value={editReservation ? editReservation.phoneNumber : ""} fullWidth />
          <TextField label="Status" select value={editReservation ? editReservation.status : ""} fullWidth>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Reservation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Reservation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the reservation for {deleteReservation ? deleteReservation.name : ""}?
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

export default ReservationManagementTable;
