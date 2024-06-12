import React, { useState, useEffect } from "react";
import axios from "axios";

const RestaurantSelector = ({ selectedRestaurant, setSelectedRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
    // Optional cleanup function
    return () => {
      // Perform cleanup if needed
    };
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restaurants');
      setRestaurants(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Error fetching restaurants. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a spinner or loading animation
  }

  if (error) {
    return <p>{error}</p>; // Display error message
  }

  return (
    <div className="mb-4">
      <label htmlFor="restaurant">Choose Restaurant:</label>
      <select
        id="restaurant"
        className="form-select w-40"
        value={selectedRestaurant}
        onChange={(e) => setSelectedRestaurant(e.target.value)}
      >
        <option value="">Select Restaurant</option>
        {restaurants.map((restaurant) => (
          <option key={restaurant.restaurantId} value={restaurant.restaurantId}>
            {restaurant.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RestaurantSelector;
