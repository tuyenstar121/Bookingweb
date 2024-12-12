import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReviewStatisticsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewStatistics = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token'); // Get the JWT token from the cookie
        if (!token) {
          throw new Error('No JWT token found');
        }

        // Always fetch data for restaurant_id = 1
        const response = await axios.get(
          `http://localhost:8080/api/reviews/statistics/1`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the Authorization header with the JWT token
            },
          }
        );

        const aggregatedData = aggregateReviewsByRating(response.data);
        setData(aggregatedData);
      } catch (error) {
        console.error('Error fetching review statistics:', error);
        setData(getDefaultData()); // Set to default data if there is an error
      } finally {
        setLoading(false);
      }
    };

    fetchReviewStatistics();
  }, []);

  const aggregateReviewsByRating = (reviews) => {
    const aggregatedData = reviews.reduce((acc, review) => {
      const { rating, numberOfReviews } = review;
      if (!acc[rating]) {
        acc[rating] = 0;
      }
      acc[rating] += numberOfReviews;
      return acc;
    }, getDefaultDataObject());

    return Object.keys(aggregatedData).map((rating) => ({
      rating: parseInt(rating),
      numberOfReviews: aggregatedData[rating],
    }));
  };

  const getDefaultDataObject = () => {
    const defaultData = {};
    for (let i = 1; i <= 5; i++) {
      defaultData[i] = 0;
    }
    return defaultData;
  };

  const getDefaultData = () => {
    return Object.keys(getDefaultDataObject()).map((rating) => ({
      rating: parseInt(rating),
      numberOfReviews: 0,
    }));
  };

  const chartOptions = {
    chart: {
      id: 'review-statistics',
    },
    xaxis: {
      categories: data.map((stat) => `Rating ${stat.rating}`),
    },
    yaxis: {
      title: {
        text: 'Số lượng đánh giá',
      },
    },
    title: {
      text: 'Thống kê số sao đánh giá',
      align: 'center',
    },
  };

  const chartSeries = [
    {
      name: 'Số lượng đánh giá',
      data: data.map((stat) => stat.numberOfReviews),
    },
  ];

  return (
    <div className="flex flex-col items-center h-full">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg">
          <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>
      )}
    </div>
  );
};

export default ReviewStatisticsChart;
