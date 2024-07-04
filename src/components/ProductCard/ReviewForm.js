import React, { useState } from 'react';
import { ListGroup, Button, Row, Col, Image, Modal } from 'react-bootstrap';

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`h-8 w-8 cursor-pointer ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onClick={() => handleRatingChange(star)}
      >
        <path d="M9.049.235a.75.75 0 011.902 0l1.847 5.69 5.964-.002a.75.75 0 01.441 1.348l-4.81 3.507 1.847 5.69a.75.75 0 01-1.155.816l-4.81-3.506-4.81 3.506a.75.75 0 01-1.155-.816l1.847-5.69-4.81-3.507a.75.75 0 01.441-1.348l5.964.002L9.049.235z" />
      </svg>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white">
      <div className="mb-4">
        <label className="block text-gray-700 text-lg font-bold mb-2">Rating</label>
        <div className="flex">
          {renderStars()}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-lg font-bold mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          rows="4"
          placeholder="Write your comment here"
        ></textarea>
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit Review
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
