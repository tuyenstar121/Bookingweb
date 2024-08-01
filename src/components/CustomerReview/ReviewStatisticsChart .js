import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import RestaurantSelector from "../RestaurantSelector"; // Adjust the import path if necessary

const ReviewStatisticsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  useEffect(() => {
    if (selectedRestaurant) {
      const fetchReviewStatistics = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8080/api/reviews/statistics/${encodeURIComponent(selectedRestaurant)}`);
          const aggregatedData = aggregateReviewsByRating(response.data);
          setData(aggregatedData);
        } catch (error) {
          console.error('Error fetching review statistics:', error);
          setData([]); // Set to empty array if there is an error
        } finally {
          setLoading(false);
        }
      };

      fetchReviewStatistics();
    }
  }, [selectedRestaurant]);

  const aggregateReviewsByRating = (reviews) => {
    const aggregatedData = reviews.reduce((acc, review) => {
      const { rating, numberOfReviews } = review;
      if (!acc[rating]) {
        acc[rating] = 0;
      }
      acc[rating] += numberOfReviews;
      return acc;
    }, {});

    return Object.keys(aggregatedData).map(rating => ({
      rating: parseInt(rating),
      numberOfReviews: aggregatedData[rating],
    }));
  };

  const chartOptions = {
    chart: {
      id: 'review-statistics',
    },
    xaxis: {
      categories: data.map(stat => `Rating ${stat.rating}`),
    },
    yaxis: {
      title: {
        text: 'Number of Reviews',
      },
    },
    title: {
      text: 'Review Statistics by Rating',
      align: 'center',
    },
  };

  const chartSeries = [
    {
      name: 'Number of Reviews',
      data: data.map(stat => stat.numberOfReviews),
    },
  ];

  return (
    <div className="flex flex-col items-start h-full">
      <RestaurantSelector
        selectedRestaurant={selectedRestaurant}
        setSelectedRestaurant={setSelectedRestaurant}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        data.length > 0 ? (
          <div className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg">
            <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
          </div>
        ) : (
          <p>No data available for the selected restaurant.</p>
        )
      )}
    </div>
  );
};

export default ReviewStatisticsChart;
