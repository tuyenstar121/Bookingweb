import React from 'react';
import './Card2.css'; // Import the CSS file for styling

const Card = ({ imageUrl, title, address, description }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt={title} />
      <div className="content1">
        <button className="recommended">Được đề xuất</button>
        <h2 className="title1">{title}</h2>
        <p className="address">
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 10.8a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z"></path>
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 21s-8-7.68-8-12.2a8 8 0 1 1 16 0C20 13.32 12 21 12 21z"></path>
          </svg>
          {address}
        </p>
        <button className="reserve-button">Đặt bàn giữ chỗ</button>
        <p className="description">
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M8 6h13M8 12h13M8 18h13M5 6h.01M5 12h.01M5 18h.01"></path>
          </svg>
          {description}
        </p>
        
      </div>
    </div>
  );
};

export default Card;
