import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const RestaurantSelector = ({ selectedRestaurant, setSelectedRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("http://localhost:8080/restaurants");
      setRestaurants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Error fetching restaurants. Please try again later.");
      setLoading(false);
    }
  };

  const handleSelect = (restaurantId) => {
    setSelectedRestaurant(restaurantId);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <button type="button" className="bg-indigo-500 ..." disabled>
        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
          {/* Spinner SVG content */}
        </svg>
        Processing...
      </button>
    ); // You can replace this with a spinner or loading animation
  }

  if (error) {
    return <p>{error}</p>; // Display error message
  }

  return (
    <div className="flex items-center space-x-4 mb-5">
      <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700">
        Chọn nhà hàng: 
      </label>
      <div className="relative inline-block w-64">
        <button
          type="button"
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {restaurants.find(r => r.restaurantId === selectedRestaurant)?.name || "Chọn nhà hàng"}
        </button>
        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {restaurants.map((restaurant) => (
              <li
                key={restaurant.restaurantId}
                className={`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                  selectedRestaurant === restaurant.restaurantId ? "text-white bg-indigo-600" : "text-gray-900"
                }`}
                onClick={() => handleSelect(restaurant.restaurantId)}
              >
                <span
                  className={`block truncate ${
                    selectedRestaurant === restaurant.restaurantId ? "font-semibold" : "font-normal"
                  }`}
                >
                  {restaurant.name}
                </span>
                {selectedRestaurant === restaurant.restaurantId && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5" aria-hidden="true" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RestaurantSelector;
