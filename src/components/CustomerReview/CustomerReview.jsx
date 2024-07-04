import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const CustomerReview = () => {
  const [chartData, setChartData] = useState({
    series: [{ name: "Reservations", data: [] }],
    options: {
      chart: {
        type: "bar",
        height: "auto",
      },
      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#ff929f"],
      },
      tooltip: {
        x: {
          format: "MM/yyyy",
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        type: "datetime",
        categories: [],
      },
      yaxis: {
        show: false,
      },
      toolbar: {
        show: false,
      },
    },
  });

  useEffect(() => {
    const fetchMonthlyReservationStats = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/reservations/monthly-stats-by-restaurant?restaurantName=Restaurant%20a");
        const data = response.data;

        // Log the response to verify its structure
        console.log("API Data: ", data);

        if (data && Array.isArray(data)) {
          // Prepare months array for all 12 months
          const months = [
            "2024-01", "2024-02", "2024-03",
            "2024-04", "2024-05", "2024-06",
            "2024-07", "2024-08", "2024-09",
            "2024-10", "2024-11", "2024-12"
          ];

          // Initialize counts array with zeros for all 12 months
          let counts = Array(12).fill(0);

          // Update counts with fetched data where available
          data.forEach(item => {
            const index = parseInt(item.month.split("-")[1], 10) - 1; // Extract month index (0-based)
            counts[index] = item.reservationCount;
          });

          setChartData(prevState => ({
            series: [{ name: "Reservations", data: counts }],
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: months,
              },
            },
          }));
        } else {
          console.error("Invalid data format", data);
        }
      } catch (error) {
        console.error("Error fetching monthly reservation statistics", error);

        // Use mock data if the API call fails
        const mockData = [
          { month: "2024-01", reservationCount: 10 },
          { month: "2024-02", reservationCount: 15 },
          { month: "2024-03", reservationCount: 20 },
          { month: "2024-04", reservationCount: 25 },
          { month: "2024-05", reservationCount: 30 },
          { month: "2024-06", reservationCount: 35 },
          // Fill the rest of the months with zero counts
          { month: "2024-07", reservationCount: 40 },
          { month: "2024-08", reservationCount: 45 },
          { month: "2024-09", reservationCount: 50 },
          { month: "2024-10", reservationCount: 55 },
          { month: "2024-11", reservationCount: 60 },
          { month: "2024-12", reservationCount: 65 },
        ];

        // Prepare months array for all 12 months
        const months = [
          "2024-01", "2024-02", "2024-03",
          "2024-04", "2024-05", "2024-06",
          "2024-07", "2024-08", "2024-09",
          "2024-10", "2024-11", "2024-12"
        ];

        // Initialize counts array with zeros for all 12 months
        let counts = Array(12).fill(0);

        // Update counts with mock data
        mockData.forEach(item => {
          const index = parseInt(item.month.split("-")[1], 10) - 1; // Extract month index (0-based)
          counts[index] = item.reservationCount;
        });

        setChartData(prevState => ({
          series: [{ name: "Reservations", data: counts }],
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: months,
            },
          },
        }));
      }
    };

    fetchMonthlyReservationStats();
  }, []);

  return (
    <div className="CustomerReview">
      <Chart options={chartData.options} series={chartData.series} type="bar" />
    </div>
  );
};

export default CustomerReview;
