import React,{ useState } from "react";
import { Link, NavLink } from "react-router-dom";
import iconSrc from "../assets/images/icon.png";
import settingsImage from "../assets/icons/settings.svg";
import {FormattedMessage} from "react-intl"


const NavBar = ({ theme }) => {
  function toggleMenu() {
    setMenuOpened(!menuOpened)
  }
  const [menuOpened,setMenuOpened] = useState(false)
  return (
    <nav className={`nav-${theme || ""}`}>
      <Link to="/" className="nav-bar-brand">
        <img src={iconSrc} alt="" className="logo-image" />
        <span> AIMATE</span>
      </Link>
      <ul className="links-list">
        {window.location.pathname === "/" && (
          <li className="link-item">
            <a href="#discover">
              <FormattedMessage
                      id = "app.discover-link"
                      defaultMessage="discover"
                /></a>
          </li>
        )}
        <li className="link-item">
          <NavLink to="/chat">
            <FormattedMessage
                      id = "app.chat-link"
                      defaultMessage="chat"
                />
          </NavLink>
        </li>
        <li className="link-item">
          <NavLink to="/settings" className="settings-btn">
            <img src={settingsImage} alt="" className="settings-link" />
          </NavLink>
        </li>
      </ul>
      <div className="menu-container"
      style={{
         display : menuOpened ? "flex" : "none"
       }}>
         <ul>
        {window.location.pathname === "/" && (
          <li className="link-item">
            <a href="#discover">
              <FormattedMessage
                      id = "app.discover-link"
                      defaultMessage="discover"
                /></a>
          </li>
        )}
        <li className="link-item">
          <NavLink to="/chat">
            <FormattedMessage
                      id = "app.chat-link"
                      defaultMessage="chat"
                />
          </NavLink>
        </li>
        <li className="link-item">
          <NavLink to="/settings" className="settings-btn">
            <FormattedMessage
                      id="app.settings-heading"
                      defaultMessage="settings"
                />
          </NavLink>
        </li>
      </ul>
     </div>
      <div className="menu" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpened ? 'opened' : ""}`}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
    </nav>
  );
};

export default NavBar;
