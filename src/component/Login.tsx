// src/components/Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";

import "../css/loginCss.css";
import type { User } from "../type/userType"; 
// פרופס לקומפוננטת Login
interface LoginProps {
  onLoginSuccess: (user: {
    userName: string;
    UserMail: string;
    token: string;
  }) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // מונע רענון עמוד

    try {
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

      const text = await response.text(); // מקבלים תגובה כטקסט

      try {
        const data = JSON.parse(text); // מנסים לפרסר JSON

        if (response.ok) {
          // אם התחברות הצליחה
          console.log("response text:", text);
          console.log("parsed username:", data.user.userName);

          // שומרים את הטוקן בלוקאל סטורג'
          localStorage.setItem("token", data.token);

          // שומרים את שם המשתמש ודוא"ל בלוקאל סטורג'
          localStorage.setItem("userName", data.user.userName);
          localStorage.setItem("userMail", data.user.UserEmail);

          // יוצרים אובייקט משתמש להעברה לאבא
          const user = {
            userName: data.user.userName,
            UserMail: data.user.UserEmail,
            token: data.token,
          };

          onLoginSuccess(user); // מעדכנים את האבא (App / HomePage)
          alert("התחברת בהצלחה!");
        } else {
          alert(data.message || "שגיאה בהתחברות");
        }
      } catch (parseError) {
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

        <button type="submit">התחבר</button>
      </form>
    </div>
  );
};

export default Login;

// import React, { useState } from "react";
// import "../css/loginCss.css";

// const Login = ({ onLoginSuccess }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // מונע רענון עמוד

//     try {
//       const response = await fetch("https://localhost:7111/api/Login/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           UserMail: email,
//           Password: password,
//         }),
//       });

//       const text = await response.text(); // מקבלים תגובה כטקסט

//       try {
//         const data = JSON.parse(text); // מנסים לפרסר JSON

//         if (response.ok) {
//           // אם התחברות הצליחה
//             console.log("response text:", text);
//             console.log("parsed username11111111:", data.user.userName);

//           // שומרים את הטוקן בלוקאל סטורג'
//           localStorage.setItem("token", data.token);

//           // שומרים את שם המשתמש בלוקאל סטורג'
//           localStorage.setItem("userName", data.user.userName);
//           localStorage.setItem("userMail", data.user.UserEmail);

//           // יוצרים אובייקט משתמש מלא
//           const user = {
//             userName: data.user.userName,
//             UserMail:data.user.UserEmail,
//             token: data.token,
//           };

//           // מעדכנים את האבא (App למשל)
//           onLoginSuccess(user);
//           console.log("userName from login response", data.user.userName);

//           alert("התחברת בהצלחה!");
//         } else {
//           alert(data.message || "שגיאה בהתחברות");
//         }
//       } catch (parseError) {
//         alert("שגיאה בפענוח התגובה מהשרת:\n" + text);
//       }
//     } catch (error) {
//       alert("שגיאה בשרת או ברשת");
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="login-form">
//         <h2>התחברות</h2>

//         <label>אימייל:</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <label>סיסמה:</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit">התחבר</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
