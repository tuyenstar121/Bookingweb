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

  // Các state để lưu trữ ngày bắt đầu và kết thúc
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  useEffect(() => {
    fetchMonthlyReservationStats(); // Lấy dữ liệu khi load
  }, [startDate, endDate]); // Khi thay đổi ngày bắt đầu hoặc kết thúc, lấy lại dữ liệu

  const fetchMonthlyReservationStats = async () => {
    try {
      const token = Cookies.get("token"); // Lấy token từ cookie
      if (!token) {
        throw new Error("No JWT token found");
      }

      const response = await axios.get(
        `http://localhost:8080/api/reservations/monthly-stats-by-restaurant`, {
          params: {
            restaurant_id: 1, // Thay đổi id nhà hàng nếu cần
            start_date: startDate, // Truyền ngày bắt đầu
            end_date: endDate, // Truyền ngày kết thúc
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      const filledData = fillMissingMonths(data);
      const months = filledData.map((item) => `${item.year}-${String(item.month).padStart(2, "0")}`);
      const reservations = filledData.map((item) => item.total_reservations);

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
      "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06", "2024-07",
      "2024-08", "2024-09", "2024-10", "2024-11", "2024-12",
    ];

    const dataMap = data.reduce((map, item) => {
      const formattedMonth = `${item.year}-${String(item.month).padStart(2, "0")}`;
      map[formattedMonth] = item.total_reservations;
      return map;
    }, {});

    return allMonths.map((month) => ({
      month,
      total_reservations: dataMap[month] || 0,
    }));
  };

  return (
    <div className="w-full">
      {/* Form nhập ngày */}
      <div className="mb-4">
        <label className="mr-2">Chọn từ ngày: </label>
        <input
          type="date"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}  // Lưu giá trị ngày bắt đầu
        />
        <label className="ml-4 mr-2">đến ngày: </label>
        <input
          type="date"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)} // Lưu giá trị ngày kết thúc
        />
      </div>

      {/* Biểu đồ hiển thị */}
      <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default CustomerReview;
