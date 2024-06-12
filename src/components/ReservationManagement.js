import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import RestaurantSelector from "./RestaurantSelector";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import classNames from "classnames";
import { ChevronDownIcon } from '@heroicons/react/16/solid';

function ReservationManagementTable() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null); // Changed to filterStatus to avoid conflict

  useEffect(() => {
    fetchReservations();
  }, [selectedRestaurant, sortBy, filterStatus]); // Ensure filterStatus is included in dependencies

  const fetchReservations = async () => {
    let url = "http://localhost:8080/api/reservations/list";
    if (selectedRestaurant) {
      url = `http://localhost:8080/api/reservations/by-restaurant?restaurantId=${selectedRestaurant}`;
    }

    try {
      const response = await axios.get(url);
      let updatedReservations = response.data;

      // Apply sorting by date if sortBy state is set
      if (sortBy === "date") {
        updatedReservations.sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));
      }

      // Apply filtering by status if filterStatus state is set
      if (filterStatus) {
        updatedReservations = updatedReservations.filter(reservation => reservation.status === filterStatus);
      }

      setReservations(updatedReservations);
    } catch (error) {
      console.error("There was an error fetching the reservations!", error);
      setError("There was an error fetching the reservations.");
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };

  const handleApproveBooked = async (reservationId) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/reservations/approve/${reservationId}`);
      const updatedReservations = reservations.map((res) =>
        res.reservationId === reservationId ? { ...res, status: "Confirmed" } : res
      );
      setReservations(updatedReservations);
      alert(response.data);
    } catch (error) {
      console.error("There was an error approving the reservation!", error);
      setError("There was an error approving the reservation.");
    }
  };

  const handleCancelBooked = async (reservationId) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/reservations/cancel/${reservationId}`);
      const updatedReservations = reservations.map((res) =>
        res.reservationId === reservationId ? { ...res, status: "Cancelled" } : res
      );
      setReservations(updatedReservations);
      alert(response.data);
    } catch (error) {
      console.error("There was an error cancelling the reservation!", error);
      setError("There was an error cancelling the reservation.");
    }
  };

  const handleApproveConfirmed = async (reservationId) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/reservations/complete/${reservationId}`);
      const updatedReservations = reservations.map((res) =>
        res.reservationId === reservationId ? { ...res, status: "Completed" } : res
      );
      setReservations(updatedReservations);
      alert(response.data);
    } catch (error) {
      console.error("There was an error completing the reservation!", error);
      setError("There was an error completing the reservation.");
    }
  };

  const sortByDate = () => {
    setSortBy("date");
  };

  const resetTable = () => {
    setSelectedRestaurant("");
    setSortBy(null);
    setFilterStatus(null);
    setReservations([]);
    setError("");
  };
  const filterByStatus = (status) => {
    setFilterStatus(status);
  };

  return (
    <div className="container mt-4">
      <div className="admin-top">
        <h3>Reservation Management</h3>
        <RestaurantSelector
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
        />
        <div className="control-buttons">
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Options
              <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </MenuButton>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                      onClick={() => sortByDate()}
                    >
                      Sort by Date
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                      onClick={() => filterByStatus("Confirmed")}
                    >
                      Filter by Confirmed
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                      onClick={() => filterByStatus("Cancelled")}
                    >
                      Filter by Cancelled
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                      onClick={() => filterByStatus("Booked")}
                    >
                      Filter by Booked
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={()=>resetTable()}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block w-full px-4 py-2 text-left text-sm'
                      )}
                    >
                      See all
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>

      {error && <p className="alert alert-danger">{error}</p>}
      <TableContainer component={Paper} className="table-container mt-4">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Time</TableCell>
              <TableCell align="left">Guests</TableCell>
              <TableCell align="left">Phone Number</TableCell>
              <TableCell align="left">Restaurant Name</TableCell>
              <TableCell align="left">Table Number</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation, index) => (
              <TableRow key={reservation.reservationId}>
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell align="left">{reservation.reservationId}</TableCell>
                <TableCell align="left">{reservation.user.username}</TableCell>
                <TableCell align="left">{formatDate(reservation.reservationDate)}</TableCell>
                <TableCell align="left">{reservation.reservationTime}</TableCell>
                <TableCell align="left">{reservation.numGuests}</TableCell>
                <TableCell align="left">{reservation.user.phone}</TableCell>
                <TableCell align="left">{reservation.table.restaurants.name}</TableCell>
                <TableCell align="left">{reservation.table.tableNumber}</TableCell>
                <TableCell align="left">
                  <span className={`badge bg-${reservation.status.toLowerCase()}`}>
                    {reservation.status}
                  </span>
               
                  </TableCell>

<TableCell align="left">
  {reservation.status === "Booked" && (
    <div className="btn-group">
      <IconButton className="btn btn-success" onClick={() => handleApproveBooked(reservation.reservationId)}>
        <CheckIcon />
      </IconButton>
      <IconButton className="btn btn-danger" onClick={() => handleCancelBooked(reservation.reservationId)}>
        <CloseIcon />
      </IconButton>
    </div>
  )}
  {reservation.status === "Confirmed" && (
    <IconButton className="btn btn-success" onClick={() => handleApproveConfirmed(reservation.reservationId)}>
      <CheckIcon />
    </IconButton>
  )}
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</div>
);
}

export default ReservationManagementTable;
