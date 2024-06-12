import React, { useState } from 'react';


import '../style/search.css';


const Search = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const handleCheckInDateChange = (e) => {
    setCheckInDate(e.target.value);
  };

  const handleCheckOutDateChange = (e) => {
    setCheckOutDate(e.target.value);
  };

  const handleGuestsChange = (e) => {
    setGuests(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form submission, fetch available rooms based on inputs
  };

  return (
    <div className="search-container">
     
      <h1>Hotel Booking</h1>
      <form onSubmit={handleFormSubmit}>
         <label htmlFor="location">Địa điểm:
        <select id="location">
          <option value="Hanoi">Hà Nội</option>
          <option value="HoChiMinh">Hồ Chí Minh</option>
          <option value="Danang">Đà Nẵng</option>
      
        </select>
        </label>
        <label>
          Check-in date:
          <input type="date" value={checkInDate} onChange={handleCheckInDateChange} />
        </label>
        <br />
        <label>
          Check-out date:
          <input type="date" value={checkOutDate} onChange={handleCheckOutDateChange} />
        </label>
        <br />
        <label>
          Guests:
          <input type="number" value={guests} onChange={handleGuestsChange} />
        </label>
        <br />
        <button type="submit">Search</button>
      </form>
      {/* TODO: Render list of available rooms */}
    </div>
  );
};

export default Search;
