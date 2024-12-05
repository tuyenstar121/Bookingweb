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
import ReservationForm1 from './form/form';
import ProductCard from './ProductCard/ProductCard';

const ReservationForm = ({ loggedInUser }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date1, setDate1] = useState('');
  const [time, setTime] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [user, setUser] = useState(null);
  const [adults, setAdults] = useState(2);
  const [selectedRestaurantInfo, setSelectedRestaurantInfo] = useState(null);
  const [selectedTableInfo, setSelectedTableInfo] = useState(null);

  const navigate = useNavigate();



  useEffect(() => {
    const storedUserId = Cookies.get('userId');
    const token = Cookies.get('token');
    if (storedUserId && token) {
      axios
        .get(`http://localhost:8080/api/users/id/${storedUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const user = response.data;
          setUser(user);
          setPhoneNumber(user.phone);
          setName(user.username);
          setEmail(user.email);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
    fetchTables();
  }, [loggedInUser]);

  useEffect(() => {
    const now = new Date();
    setDate1(now.toISOString().split('T')[0]); // YYYY-MM-DD
    setTime(now.toTimeString().split(' ')[0].substring(0, 5)); // HH:MM
  }, []);

  const fetchTables = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(`http://localhost:8080/tables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tablesWithStatus = response.data.map((table) => ({
        ...table,
        status: table.status.toLowerCase(),
      }));
      setAvailableTables(tablesWithStatus);
      setSelectedTable('');
    } catch (error) {
      console.error('Lỗi lấy dữ liệu bàn:', error);
    }
  };

  const handleTableClick = (tableNumber, tableId, status) => {
    if (status === 'available') {
      setSelectedTableInfo({
        number: tableNumber,
        id: tableId,
      });
      setSelectedTable(tableId);
      toast.success(`Bạn đã chọn bàn số ${tableNumber}.`);
    } else {
      toast.error(`Bàn ${tableNumber} đã được đặt chỗ.`);
    }
  };

  const handleUpdate = async () => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để đặt bàn.');
      navigate('/login');
      return;
    }

    if (!selectedTable || !date1 || !time) {
      toast.error('Vui lòng điền đầy đủ các thông tin.');
      return;
    }


    const requestData = {
      userId: user.userId,
      tableId: selectedTable,
      reservationDate: date1,
      reservationTime: time,
      numberOfGuests: adults,
    };

    const token = Cookies.get('token');
    try {
      const response = await axios.post('http://localhost:8080/api/reservations/book', requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reservationId = response.data;
      toast.success('Đặt bàn thành công.');
      console.log('Reservation ID:', reservationId);
      await createAdditionalItems(reservationId);
    } catch (error) {
      toast.error('Lỗi đặt bàn.');
      console.error(error);
    }
  };

  const createAdditionalItems = async (reservationId) => {
    const storedCart = localStorage.getItem('cart');
    const items = storedCart ? JSON.parse(storedCart) : [];

    if (!items.length || !reservationId) {
      return;
    }

    const itemsToAdd = items.map((item) => ({
      foodItemId: item.foodItemId,
      reservationId,
      quantity: item.quantity,
      description: item.note,
    }));

    const token = Cookies.get('token');
    try {
      await Promise.all(
        itemsToAdd.map(async (item) => {
          await axios.post('http://localhost:8080/api/order-food-mapping/select-food-item', item, {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
      );

      toast.success('Thêm món ăn thành công.');
      localStorage.removeItem('cart'); // Clear cart items after adding
    } catch (error) {
      toast.error('Lỗi thêm món ăn.');
      console.error(error);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
        <h1 className="text-center text-2xl font-bold mb-6 text-yellow-600">Đặt bàn</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReservationForm1 />
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Chi tiết đặt bàn</h2>
            <form>
              <div className="form-group flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <span role="img" aria-label="adults" className="mr-1">👤</span> Số người:
                  <select
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2 ml-2"
                  >
                    {[...Array(20).keys()].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </label>
                {/* <label className="block text-sm font-medium text-gray-700 flex items-center">
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
                </label> */}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  <span role="img" aria-label="arrival-time">🕒</span> Thời gian đến
                </label>
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
              {selectedTableInfo && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    Bàn đã chọn: {selectedTableInfo.number} (ID: {selectedTableInfo.id})
                  </p>
                </div>
              )}
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
              <button
                type="button"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleUpdate}
              >
                Đặt bàn
              </button>
            </form>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Các món ăn đã chọn</h2>
          <ProductCard date={date1}/>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReservationForm;