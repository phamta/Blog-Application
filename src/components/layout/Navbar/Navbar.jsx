import React, { useState } from "react";
import styles from "./Navbar.module.css";
import reactLogo from "../../../assets/react.svg";

import {Bell} from "lucide-react";

const Navbar = ({
  avatar
}) => {
  const [activeItem, setActiveItem] = useState("Home");

  const menuItems = ["Home", "Service", "Forum", "Contact Us"];

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src={reactLogo} alt="React Logo" className={styles.logoIcon} />
        <span className={styles.logoText}>ReactApp</span>
      </div>

      {/* Menu */}
      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item}
            className={`${styles.menuItem} ${
              activeItem === item ? styles.active : ""
            }`}
            onClick={() => setActiveItem(item)}
          >
            {item}
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.notifBtn}>
          <Bell size={22} color="#4C4DDC" />
        </button>
        <div className={styles.profile}>
          <img
            src={avatar}
            alt="User Avatar"
            className={styles.avatar}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;