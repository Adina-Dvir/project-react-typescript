
import React, { useState } from "react";
import { Link } from "react-router-dom"; // בשביל קישורים פנימיים
//import Categories from "./Category";
import "../css/header.css";

export default function Header({ user, onLogout, onLoginClick, onSignupClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const userName = localStorage.getItem("userName");

  return (
    <div className="header">
      <div  className="logo">My Bcard</div>

      {user ? (
        <>
          {/* 🔗 קישורים נוספים למשתמש מחובר */}
          <nav className="nav-links">
            <Link to="/HomePage">HOME PAGE</Link>
            <Link to="/Category">CATEGORIES</Link>
            <Link to="/professionals">ALL PROFESSIONALS</Link>
            <Link to="/comments">COMMENTS SITE</Link>
            <Link to="/enter">ENTER PROFESSIONAL</Link>
          </nav>

          {/* 🔒 אזור משתמש מחובר */}
          <div className="user-info">
            <div
              className="user-initial-circle"
              onClick={toggleMenu}
              title={userName}
            >
              {userName?.charAt(0).toUpperCase()}
            </div>

            {menuOpen && (
              <div className="profile-menu">
                <p onClick={() => alert("פרטי משתמש כאן")}>👤 הפרופיל שלי</p>
                <p onClick={onLogout}>🚪 התנתק</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="auth-container">
          <button className="auth-button" onClick={() => setAuthMenuOpen((prev) => !prev)}>
            LOGIN / SIGNUP ⬇
          </button>
          {authMenuOpen && (
            <div className="auth-dropdown">
              <p onClick={() => { setAuthMenuOpen(false); onLoginClick(); }}>🔑 התחברות</p>
              <p onClick={() => { setAuthMenuOpen(false); onSignupClick(); }}>📝 הרשמה</p>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}
