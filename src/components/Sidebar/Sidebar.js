import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import Logo from "../../assets/images/logo.png";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { SidebarData } from "../data/data";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  };

  const handleSignOut = () => {
    navigate("/login");
  };

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpanded(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            Sh<span>o</span>ps
          </span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "menuItem active" : "menuItem"
              }
              key={index}
            >
              <item.icon />
              <span>{item.heading}</span>
            </NavLink>
          ))}

          <div style={{ display: 'flex', paddingLeft: 30, gap: 16, color: 'white', cursor: 'pointer' }} onClick={handleSignOut}>
            <UilSignOutAlt />
            <span>Đăng xuất</span>
          </div>
        </div>
      </motion.div >
    </>
  );
};

export default Sidebar;
