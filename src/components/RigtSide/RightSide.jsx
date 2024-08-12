import React from "react";
import CustomerReview from "../CustomerReview/CustomerReview";
import ReviewStatisticsChart from "../CustomerReview/ReviewStatisticsChart ";
import Updates from "../Updates/Updates";
import "./RightSide.css";

const RightSide = () => {
  return (
    <div className="RightSide">
      <div>
        <h3>Reviews</h3>
        <Updates />
      </div>
      <div>
        <h3>Reservation Stats</h3>
        <CustomerReview />
      </div>
      <div>
        <h3>Review Statistics</h3>
        < ReviewStatisticsChart />
      </div>
    </div>
  );
};

export default RightSide;
