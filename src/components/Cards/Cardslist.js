import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Card from '../Card2/Card2';
import Cookies from 'js-cookie';
// import './ListCard.css'; // Import the CSS file for styling

const   ListCard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const scrollContainerRef = useRef(null);

  const fetchRestaurants = async () => {
    try {
      const token = Cookies.get('token'); // Lấy mã thông báo JWT từ cookie
      if (!token) {
        throw new Error('No JWT token found');
      }
  
      const response = await axios.get('http://localhost:8080/restaurants', {
        headers: {
          Authorization: `Bearer ${token}` // Thêm tiêu đề Authorization với mã thông báo JWT
        }
      });
  
      const fetchedRestaurants = response.data;
      setRestaurants(fetchedRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -248, // Adjust according to your card width
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 248, // Adjust according to your card width
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className="list-card-app">
      <h2 className="list-header">Trải nghiệm không gian nhà hàng sang trọng cùng chúng tôi</h2>
      <div className="card-list-container">
        <button className="scroll-button left" onClick={scrollLeft} aria-label="Previous slide">
          <span className="splide__arrow__prev__icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-narrow-left" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19 12H5" />
              <path d="M9 16l-4-4" />
              <path d="M9 8l-4 4" />
            </svg>
          </span>
        </button>
        <div className="card-list" ref={scrollContainerRef}>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant, index) => (
              <Card
                key={index}
                imageUrl={restaurant.image}
                title={restaurant.name}
                address={restaurant.address}
                description={restaurant.description}
              />
            ))
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
        <button className="scroll-button right" onClick={scrollRight} aria-label="Next slide">
          <span className="splide__arrow__next__icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-narrow-right" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12h14" />
              <path d="M15 16l4-4" />
              <path d="M15 8l4 4" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

export default ListCard;
