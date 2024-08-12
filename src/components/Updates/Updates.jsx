import React, { useState, useEffect } from "react";
import "./Updates.css";
import { formatDistanceToNow, parseISO } from 'date-fns'; // Import parseISO to handle date strings
import Cookies from 'js-cookie';
const Updates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    // Function to fetch top 5 comments
    const fetchUpdates = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No JWT token found');
        }

        const response = await fetch("http://localhost:8080/api/reviews", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUpdates(data);
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    fetchUpdates();
  }, []);
  return (
    <div className="Updates">
      {updates.map((update) => (
        <div key={update.reviewId} className="update">
          <img src="https://i.imgur.com/TiJSX9j.jpeg" alt="profile" />
          <div className="noti">
            <div style={{ marginBottom: "0.5rem" }}>
              <span>Rating: {update.rating}</span>
              <span> Comment: {update.comment}</span>
            </div>
            <span>{formatDistanceToNow(parseISO(update.createdAt))} ago</span> {/* Use parseISO to correctly parse the date */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Updates;
