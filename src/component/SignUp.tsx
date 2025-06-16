import { useState } from "react";
import type { FormEvent } from "react";

import "../css/loginCss.css";

// טיפוס לפרטי המשתמש שמעבירים לאבא
interface SignUpProps {
  onSignupSuccess: (user: {
    userName: string;
    profileImage: string | null;
  }) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignupSuccess }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("📤 נשלח טופס הרשמה");

    try {
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
        const data = JSON.parse(text);

        if (response.ok) {
          alert("נרשמת והתחברת בהצלחה!");

          // שמירת נתונים ב־localStorage
          localStorage.setItem("token", data.user.token);
          localStorage.setItem("userName", data.user.userName);
          if (data.user.profileImage) {
            localStorage.setItem("profileImage", data.user.profileImage);
          }

          // עדכון אבא
          onSignupSuccess({
            userName: data.user.userName,
            profileImage: data.user.profileImage || null,
          });

        } else {
          alert(data.user?.message || "שגיאה בהרשמה");
        }
      } catch (parseError) {
        alert("שגיאה בפענוח תגובת השרת:\n" + text);
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
