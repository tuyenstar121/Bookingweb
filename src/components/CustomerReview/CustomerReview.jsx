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
        categories: [], // Các tháng và năm sẽ được đặt vào đây
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

  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  useEffect(() => {
    fetchMonthlyReservationStats(); // Gọi hàm khi load
  }, [startDate, endDate]); // Gọi lại khi ngày thay đổi

  const fetchMonthlyReservationStats = async () => {
    try {
      const token = Cookies.get("token"); // Lấy token từ cookie
      if (!token) {
        throw new Error("No JWT token found");
      }

      const response = await axios.get(
        `http://localhost:8080/api/reservations/monthly-stats-by-restaurant`, {
          params: {
            restaurant_id: 1, // ID của nhà hàng, thay nếu cần
            start_date: startDate,
            end_date: endDate,
          },
          headers: {
            Authorization: `Bearer ${token}`, // Đưa vào header authorization
          },
        }
      );

      const data = response.data;  // Dữ liệu từ API trả về

      const filledData = fillMissingMonths(data); // Xử lý dữ liệu trống
      const months = filledData.map((item) => `${item.year}-${String(item.month).padStart(2, "0")}`); // Hiển thị tháng - năm
      const reservations = filledData.map((item) => item.count);  // Lấy số lượng đặt bàn

      setChartData((prevState) => ({
        ...prevState,
        series: [{ ...prevState.series[0], data: reservations }],
        options: {
          ...prevState.options,
          xaxis: { ...prevState.options.xaxis, categories: months }, // Thêm tháng vào biểu đồ
        },
      }));
    } catch (error) {
      console.error("Error fetching reservation stats:", error);
    }
  };

  const fillMissingMonths = (data) => {
    const allMonths = [
      { month: 1, year: 2024 }, { month: 2, year: 2024 }, { month: 3, year: 2024 }, { month: 4, year: 2024 },
      { month: 5, year: 2024 }, { month: 6, year: 2024 }, { month: 7, year: 2024 }, { month: 8, year: 2024 },
      { month: 9, year: 2024 }, { month: 10, year: 2024 }, { month: 11, year: 2024 }, { month: 12, year: 2024 },
    ];

    const dataMap = data.reduce((map, item) => {
      const formattedMonth = `${item.year}-${String(item.month).padStart(2, "0")}`;
      map[formattedMonth] = item.count;
      return map;
    }, {});

    return allMonths.map(({ month, year }) => {
      const formattedMonth = `${year}-${String(month).padStart(2, "0")}`;
      return {
        month,
        year,
        count: dataMap[formattedMonth] || 0,
      };
    });
  };

  return (
    <div className="w-full">
      {/* Form để chọn ngày */}
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg max-w-lg mx-auto">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Chọn khoảng thời gian</h2>
  
  <div className="flex flex-wrap gap-4">
    <div className="flex items-center">
      <label className="text-lg mr-2 text-gray-700">Từ ngày:</label>
      <input
        type="date"
        className="py-2 px-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>

    <div className="flex items-center">
      <label className="text-lg mr-2 text-gray-700">Đến ngày:</label>
      <input
        type="date"
        className="py-2 px-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>
  </div>
</div>

      {/* Biểu đồ hiển thị */}
      <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default CustomerReview;
