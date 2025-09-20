import React from "react";
import styles from "./Navbar.module.css";
import Logout from "../Logout"; // Thêm dòng này

const Navbar = () => {
  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles["container--narrow"]}`}>
        <a href="#" className={styles.header__logo}>
          Blag 
        </a>
        <nav className={styles.header__nav}>
          {/* <input type="checkbox" id="responsive-menu" /> */}
          <label htmlFor="responsive-menu" className={styles["toggle-menu"]}>
            <span>Menu</span>
            <div className={styles["toggle-menu__lines"]}></div>
          </label>
          <ul className={styles.header__menu}>
            <li className={styles.header__menuItem}>
              <a href="#">Developers</a>
            </li>
            <li className={styles.header__menuItem}>
              <a href="#">Projects</a>
            </li>
            <li className={styles.header__menuItem}>
              <a href="#">Inbox</a>
            </li>
            <li className={styles.header__menuItem}>
              <a href="#">Account</a>
            </li>
            <li className={styles.header__menuItem}>
              <Logout /> {/* Thay nút Logout bằng component Logout */}
            </li>
            <li className={styles.header__menuItem}>
              <a href="#" className={`${styles.btn} ${styles["btn--sub"]}`}>
                Login/Sign Up
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;