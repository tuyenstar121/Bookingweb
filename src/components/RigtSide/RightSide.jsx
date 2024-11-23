import React from "react";
import CustomerReview from "../CustomerReview/CustomerReview";
import ReviewStatisticsChart from "../CustomerReview/ReviewStatisticsChart ";
import Updates from "../Updates/Updates";
import "./RightSide.css";

const RightSide = () => {
  return (
    <div className="RightSide">
      <div>
        <h3>Đánh giá</h3>
        <Updates />
      </div>
      <div>
        <h3 className="mt-8">Thống kê đặt chỗ</h3>
        <CustomerReview />
      </div>
      <div>
        <h3 className="mt-8">Thống kê review</h3>
        < ReviewStatisticsChart />
      </div>
    </div>
  );
};

export default RightSide;
