// ייבוא React ו־useState לניהול סטייט מקומי
import { useState } from "react";
import type { FormEvent } from "react";

// ייבוא קובץ עיצוב לדף ההרשמה
import "../css/loginCss.css";

// טיפוס לפרופס שמצפה לפונקציה שמופעלת אחרי הרשמה מוצלחת
interface SignUpProps {
  onSignupSuccess: (user: {
    userName: string;
    profileImage: string | null;
  }) => void;
}

// קומפוננטת SignUp שמקבלת prop של onSignupSuccess
const SignUp: React.FC<SignUpProps> = ({ onSignupSuccess }) => {
  // סטייטים לטופס – שם, אימייל וסיסמה
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // בעת שליחת הטופס – בקשת POST לשרת
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // מניעת רענון ברירת מחדל
    console.log("📤 נשלח טופס הרשמה");

    try {
      const response = await fetch("https://localhost:7111/api/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // שליחת הנתונים לגוף הבקשה
        body: JSON.stringify({
          UserName: name,
          UserEmail: email,
          UserPassword: password,
        }),
      });

      const text = await response.text(); // קריאת טקסט מהתגובה

      try {
        const data = JSON.parse(text); // ניסיון לפענח את המידע

        if (response.ok) {
          alert("נרשמת והתחברת בהצלחה!");

          // שמירת הנתונים בלוקאל סטורג'
          localStorage.setItem("token", data.user.token);
          localStorage.setItem("userName", data.user.userName);
          if (data.user.profileImage) {
            localStorage.setItem("profileImage", data.user.profileImage);
          }

          // קריאה לפונקציה מההורה עם פרטי המשתמש
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
      {/* טופס ההרשמה */}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>הרשמה</h2>

        {/* שדה שם */}
        <label>שם:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
        <button type="submit">הרשמה</button>
      </form>
    </div>
  );
};

export default SignUp;
