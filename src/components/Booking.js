import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faCouch } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router for navigation
import ReservationForm1 from './form/form.js';

const ReservationForm = ({ loggedInUser }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const [showTables, setShowTables] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [date1, setDate1] = useState('2024-06-01');
  const [time, setTime] = useState('10:15');
  const [selectedRestaurantInfo, setSelectedRestaurantInfo] = useState(null);
  const [selectedTableInfo, setSelectedTableInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = Cookies.get('userId');
    fetchRestaurants();

    if (storedUserId) {
      axios.get(`http://localhost:8080/api/users/id/${storedUserId}`)
        .then(response => {
          const user = response.data;
          setUser(user);
          setPhoneNumber(user.phone);
          setName(user.username);
          setEmail(user.email);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    }
  }, [loggedInUser]);

  const fetchTablesByRestaurant = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:8080/tables/by-restaurant/${restaurantId}`);
      const tablesWithStatus = response.data.map((table) => ({
        ...table,
        status: table.status.toLowerCase(),
      }));
      setAvailableTables(tablesWithStatus);
      setSelectedTable('');
      setShowTables(true); // Show tables after fetching
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restaurants');
      const fetchedRestaurants = response.data;
      setRestaurants(fetchedRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleRestaurantSelect = (eventKey, event) => {
    const restaurantName = event.target.textContent;
    setSelectedRestaurantInfo({
      id: eventKey,
      name: restaurantName
    });
    setSelectedRestaurant(eventKey);
    fetchTablesByRestaurant(eventKey);
  };

  const handleTableClick = (tableNumber, tableId, status) => {
    if (status === 'available') {
      setSelectedTableInfo({
        number: tableNumber,
        id: tableId
      });
      setSelectedTable(tableId);
      toast.success(`You have selected table ${tableNumber} at ${selectedRestaurantInfo.name}.`);
      setShowTables(false); // Close the popup after selecting a table
    } else {
      toast.error(`Table ${tableNumber} is already reserved.`);
    }
  };

  const handleUpdate = async () => {
    if (!user) {
      toast.error('You need to log in to book a reservation.');
      navigate('/login'); // Redirect to login page
      return;
    }

    if (!selectedTable || !date1 || !time) {
      toast.error('Please fill all required fields');
      return;
    }

    const requestData = {
      userId: user.userId,
      tableId: selectedTable,
      reservationDate: date1,
      reservationTime: time,
      numberOfGuests: adults + children
    };

    try {
      const response = await axios.post('http://localhost:8080/api/reservations/book', requestData);
      toast.success('Reservation booked successfully');
      setShowTables(false);
    } catch (error) {
      toast.error('Error booking reservation');
      console.error(error);
    }
  };

  return (
    <div className="reservation-form">
      <h2>Reservation Form</h2>
      <div className="form-container">
        <div className="image-container">
          <ReservationForm1 />
        </div>
        <div className="booking-form">
          <h2>Thông tin đặt chỗ</h2>
          <div className="form-group">
            <label>
              <span role="img" aria-label="adults">👤</span> Người lớn:
              <select value={adults} onChange={(e) => setAdults(parseInt(e.target.value, 10))}>
                {[...Array(10).keys()].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </label>
            <label>
              <span role="img" aria-label="children">👶</span> Trẻ em:
              <select value={children} onChange={(e) => setChildren(parseInt(e.target.value, 10))}>
                {[...Array(10).keys()].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              <span role="img" aria-label="arrival-time">🕒</span> Thời gian đến
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="restaurant">Choose Restaurant:</label>
            <DropdownButton
              id="dropdown-basic-button"
              title="Select Restaurant"
              onSelect={handleRestaurantSelect}
            >
              {restaurants.map((restaurant) => (
                <Dropdown.Item key={restaurant.restaurantId} eventKey={restaurant.restaurantId}>
                  {restaurant.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          {selectedRestaurantInfo && (
            <div className="form-group">
                        <p>
                Selected Restaurant: {selectedRestaurantInfo.name} (ID: {selectedRestaurantInfo.id})
              </p>
            </div>
          )}
          {selectedTableInfo && (
            <div className="form-group">
              <p>
                Selected Table: {selectedTableInfo.number} (ID: {selectedTableInfo.id})
              </p>
            </div>
          )}
          <button className="update-button" onClick={handleUpdate}>Cập nhật</button>
          <div className="action-buttons">
            <button className="secondary-button">Sản phẩm chọn kèm</button>
          </div>
          {showTables && (
            <div className="overlay">
              <div className="popup">
                <button className="close-popup" onClick={() => setShowTables(false)}>×</button>
                <div className="form-group">
                  <label htmlFor="table" className="label-bold">Choose Table:</label>
                  <div className="table-buttons fade-in" style={{ animationDuration: "2s", animationName: "fadeIn" }}>
                    {availableTables.map((table) => (
                      <button
                        key={table.tableId}
                        type="button"
                        className={`table-button ${selectedTable === table.tableId ? 'active' : ''} ${table.status}`}
                        onClick={() => handleTableClick(table.tableNumber, table.tableId, table.status)}
                        style={{ animationDelay: `${table.tableId * 0.1}s` }}
                        disabled={table.status !== 'available'}
                      >
                        <FontAwesomeIcon icon={table.status === 'available' ? faChair : faCouch} />
                        <span className="button-text">
                          {table.tableNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReservationForm;
