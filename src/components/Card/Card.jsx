import React, { useState } from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

// parent Card

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <motion.div
      className="Card"
      style={{
        background: props.color.backGround,
        boxShadow: props.color.boxShadow,
      }}
      layoutId="expandableCard"
      onClick={toggleExpanded}
    >
      {expanded ? (
        <ExpandedCard param={props} />
      ) : (
        <CompactCard param={props} />
      )}
    </motion.div>
  );
};

// Compact Card
function CompactCard({ param }) {
  const Png = param.png;
  return (
    <div className="CompactCard">
      <div className="radialBar">
        <CircularProgressbar value={param.barValue} text={`${param.barValue}%`} />
        <span>{param.title}</span>
      </div>
      <div className="detail">
        <Png />
        <span>${param.value}</span>
        <span>Last 24 hours</span>
      </div>
    </div>
  );
}

// Expanded Card
function ExpandedCard({ param }) {
  const data = {
    // ... your data options
  };

  return (
    <motion.div className="ExpandedCard">
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes />
      </div>
      <span>{param.title}</span>
      <div className="chartContainer">
        <Chart options={data.options} series={param.series} type="area" />
      </div>
      <span>Last 24 hours</span>
    </motion.div>
  );
}

export default Card;
