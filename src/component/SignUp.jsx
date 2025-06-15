
import React, { useState } from "react";
import "../css/loginCss.css";

const SignUp = ({ onSignupSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log("111111");

    try {
      console.log("222222222");

      const response = await fetch("https://localhost:7111/api/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: name,
          UserEmail: email,
          UserPassword: password,
        }),

      });

      const text = await response.text();

      try {
                console.log("33");

        const data = JSON.parse(text);

        if (response.ok) {
          alert("נרשמת והתחברת בהצלחה!");

          // שמירת פרטי המשתמש
          localStorage.setItem("token", data.user.token);
          localStorage.setItem("userName", data.user.userName);
          if (data.user.profileImage)
            localStorage.setItem("profileImage", data.user.profileImage);

          onSignupSuccess({
            userName: data.user.userName,
            profileImage: data.user.profileImage || null,
          });

        } else {
          alert(data.user.message || "שגיאה בהרשמה");
        }
      } catch (e) {
        alert("errorrrrr: ",text);
      }
    } catch (error) {
      alert("שגיאה בשרת או ברשת");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>הרשמה</h2>

        <label>שם:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>אימייל:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>סיסמה:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">הרשמה</button>
      </form>
    </div>
  );
};

export default SignUp;
