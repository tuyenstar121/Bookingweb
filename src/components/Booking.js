import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faCouch } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ReservationForm1 from './form/form.js';
import ProductCard from './ProductCard/ProductCard.js';

const ReservationForm = ({ loggedInUser }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date1, setDate1] = useState('2024-06-01');
  const [time, setTime] = useState('10:15');
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const [showTables, setShowTables] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRestaurantInfo, setSelectedRestaurantInfo] = useState(null);
  const [selectedTableInfo, setSelectedTableInfo] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
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
      setShowTables(true);
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
      setShowTables(false);
    } else {
      toast.error(`Table ${tableNumber} is already reserved.`);
    }
  };

  const handleUpdate = async () => {
    if (!user) {
      toast.error('You need to log in to book a reservation.');
      navigate('/login');
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
      const reservationId = response.data;
      toast.success('Reservation booked successfully');
      console.log('hú'+reservationId);
      setShowTables(false);

      await createAdditionalItems(reservationId);
    } catch (error) {
      toast.error('Error booking reservation');
      console.error(error);
    }
  };

  const createAdditionalItems = async (reservationId) => {
    const storedCart = localStorage.getItem('cart');
    const items = storedCart ? JSON.parse(storedCart) : [];

    if (!items.length || !reservationId) {
      return;
    }

    const itemsToAdd = items.map(item => ({
      foodItemId: item.foodItemId,
      reservationId: reservationId,

      quantity: item.quantity
    }));
 console.log(itemsToAdd);
    try {
      await Promise.all(itemsToAdd.map(async (item) => {
        await axios.post('http://localhost:8080/api/order-food-mapping/select-food-item', item);
      }));

      toast.success('Additional items added successfully');
      localStorage.removeItem('cart'); // Clear cart items after adding
    } catch (error) {
      toast.error('Error adding additional items');
      console.error(error);
    }
  };

  
  const handleClearItems = () => {
    localStorage.removeItem('cart');
    setSelectedItems([]);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
        <h1 className="text-center text-2xl font-bold mb-6 text-yellow-600">Reservation Form</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReservationForm1 />
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Reservation Details</h2>
            <form>
              <div className="form-group flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <span role="img" aria-label="adults" className="mr-1">👤</span> Adults:
                  <select
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2 ml-2"
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <span role="img" aria-label="children" className="mr-1">👶</span> Children:
                  <select
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value, 10))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2 ml-2"
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700"><span role="img" aria-label="arrival-time">🕒</span> Arrival Time</label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                />
                <input
                  type="time"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Choose Restaurant:</label>
                <DropdownButton
                  id="dropdown-basic-button"
                  title="Select Restaurant"
                  className="mt-1 block w-full"
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
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    Selected Restaurant: {selectedRestaurantInfo.name} (ID: {selectedRestaurantInfo.id})
                  </p>
                </div>
              )}
              {selectedTableInfo && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    Selected Table: {selectedTableInfo.number} (ID: {selectedTableInfo.id})
                  </p>
                </div>
              )}
              <button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleUpdate}>Update</button>
            </form>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Selected Additional Items</h2>
          <ProductCard selectedItems={selectedItems} onClearItem={handleClearItems} />
        </div>
        {showTables && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative">
              <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" onClick={() => setShowTables(false)}>×</button>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Choose Table:</label>
                <div className="flex flex-wrap gap-2">
                  {availableTables.map((table) => (
                    <button
                      key={table.tableId}
                      type="button"
                      className={`p-2 rounded border ${selectedTable === table.tableId ? 'border-yellow-500' : 'border-gray-300'} ${table.status === 'available' ? 'bg-green-200 hover:bg-green-300' : 'bg-red-200'}`}
                      onClick={() => handleTableClick(table.tableNumber, table.tableId, table.status)}
                      disabled={table.status !== 'available'}
                    >
                      <FontAwesomeIcon icon={table.status === 'available' ? faChair : faCouch} />
                      <span className="ml-2">{table.tableNumber}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReservationForm;
