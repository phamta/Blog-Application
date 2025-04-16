import React from "react";
import "../css/Navbar.css";

const Navbar = () => {
  return (
    <header className="header">
      <div className="container container--narrow">
        <a href="#" className="header__logo">
          Blag
        </a>
        <nav className="header__nav">
          <input type="checkbox" id="responsive-menu" />
          <label htmlFor="responsive-menu" className="toggle-menu">
            <span>Menu</span>
            <div className="toggle-menu__lines"></div>
          </label>
          <ul className="header__menu">
            <li className="header__menuItem">
              <a href="#">Developers</a>
            </li>
            <li className="header__menuItem">
              <a href="#">Projects</a>
            </li>
            <li className="header__menuItem">
              <a href="#">Inbox</a>
            </li>
            <li className="header__menuItem">
              <a href="#">Account</a>
            </li>
            <li className="header__menuItem">
              <a href="#" className="btn btn--sub">
                Logout
              </a>
            </li>
            <li className="header__menuItem">
              <a href="#" className="btn btn--sub">
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
