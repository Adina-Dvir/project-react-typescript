import React from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import Header from "./Header";
import TrendingProfessionals from "./TrendingProfessionals";
import "../css/HomePage.css";
import type { UserForHomePage } from "../type/userType";

export default function HomePage() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const isLoggedIn = !!token && !!userName;

  return (
    <div className="home-container">
      {/* ✅ מוצג רק אם המשתמש באמת מחובר */}
      {isLoggedIn && <TrendingProfessionals />}

      <div className="logo-card">
        <img src="src/images/background.jpg" alt="My Bcard" />
        <p>כרטיס הביקור החכם שלך</p>
      </div>
    </div>
  );
}
