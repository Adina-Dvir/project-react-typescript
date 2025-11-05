// src/components/Login.tsx

// שימוש ב־useState לניהול שדות הטופס
import { useState } from "react";
import type { FormEvent } from "react";

// קובץ CSS לעיצוב הטופס
import "../css/loginCss.css";

// טיפוס עבור הפרופס שמתקבל מהורה – פונקציה שמתבצעת לאחר התחברות מוצלחת
interface LoginProps {
  onLoginSuccess: (user: {
    userName: string;
    userEmail: string;
    token: string;
  }) => void;
}

// קומפוננטת התחברות
const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  // סטייטים עבור שדות טופס ההתחברות
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // טיפול בשליחת טופס ההתחברות
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ביטול רענון ברירת מחדל של הדפדפן

    try {
      // קריאה לשרת עם פרטי ההתחברות
      const response = await fetch("https://localhost:7111/api/Login/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserMail: email,
          Password: password,
        }),
      });

      const text = await response.text(); // קבלת הטקסט המקורי מהשרת

      try {
        const data = JSON.parse(text); // ניסיון לפענח JSON

        if (response.ok) {
          // התחברות הצליחה – שמירת המידע המקומית
          localStorage.setItem("token", data.token);
          localStorage.setItem("userName", data.user.userName);
          localStorage.setItem("userEmail", data.user.userEmail);

          const user = {
            userName: data.user.userName,
            userEmail: data.user.userEmail,
            token: data.token,
          };

          // קריאה לפונקציה מהורה לציון שההתחברות הצליחה
          onLoginSuccess(user);
          alert("התחברת בהצלחה!");
        } else {
          // הודעת שגיאה מהשרת
          alert(data.message || "שגיאה בהתחברות");
        }
      } catch (parseError) {
        // לא הצליח לפענח JSON
        alert("שגיאה בפענוח התגובה מהשרת:\n" + text);
      }
    } catch (error) {
      alert("שגיאה בשרת או ברשת");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>התחברות</h2>

        {/* שדה אימייל */}
        <label>אימייל:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* שדה סיסמה */}
        <label>סיסמה:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* כפתור שליחה */}
        <button type="submit">התחבר</button>
      </form>
    </div>
  );
};

export default Login;
