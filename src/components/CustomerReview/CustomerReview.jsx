import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import Cookies from "js-cookie";

const CustomerReview = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Reservations",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: "Số lượng đặt bàn",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  });

  useEffect(() => {
    fetchMonthlyReservationStats();
  }, []);

  const fetchMonthlyReservationStats = async () => {
    try {
      const token = Cookies.get("token"); // Get the JWT token from the cookie
      if (!token) {
        throw new Error("No JWT token found");
      }

      const response = await axios.get(
        `http://localhost:8080/api/reservations/monthly-stats-by-restaurant?restaurant_id=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Authorization header with the JWT token
          },
        }
      );
      const data = response.data;

      const filledData = fillMissingMonths(data);
      const months = filledData.map((item) => item.month);
      const reservations = filledData.map((item) => item.count);

      setChartData((prevState) => ({
        ...prevState,
        series: [{ ...prevState.series[0], data: reservations }],
        options: {
          ...prevState.options,
          xaxis: { ...prevState.options.xaxis, categories: months },
        },
      }));
    } catch (error) {
      console.error("Error fetching reservation stats:", error);
    }
  };

  const fillMissingMonths = (data) => {
    const allMonths = [
      "2024-01",
      "2024-02",
      "2024-03",
      "2024-04",
      "2024-05",
      "2024-06",
      "2024-07",
      "2024-08",
      "2024-09",
      "2024-10",
      "2024-11",
      "2024-12",
    ];

    const dataMap = data.reduce((map, item) => {
      map[item.month] = item.count;
      return map;
    }, {});

    return allMonths.map((month) => ({
      month,
      count: dataMap[month] || 0,
    }));
  };

  return (
    <div className="w-full">
      <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default CustomerReview;
