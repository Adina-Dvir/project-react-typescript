
import React, { useState, useEffect } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import Header from "./Header";
import "../css/HomePage.css";
import type{UserForHomePage} from '../type/userType'
export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [currentUser, setCurrentUser] = useState<UserForHomePage | null>(null);

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const profileImage = localStorage.getItem("profileImage");
    if (userName) {
      setCurrentUser({ username: userName, profileImage });
    }
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userName");
  //   localStorage.removeItem("profileImage");
  //   setCurrentUser(null);
  // };

  // // נוסיף פונקציות שייקראו מה-Header
  // const openLogin = () => {
  //   setMode("login");
  //   setModalOpen(true);
  // };

  // const openSignup = () => {
  //   setMode("signup");
  //   setModalOpen(true);
  // };

  return (
    <div className="home-container">
      {/* <Header
        user={currentUser}
        onLogout={handleLogout}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
      /> */}

      <div className="logo-card">
        <img src="src/images/background.jpg" alt="My Bcard" />
        <p>כרטיס הביקור החכם שלך</p>
      </div>

    </div>
  );
}
