// ייבוא React ו־useState, useEffect
import { useEffect, useState } from "react";

// פונקציה שמביאה את העסקים הטרנדיים מהשרת
import { getTrendingProfessionals } from "../services/professionalApi";

// טיפוס של Professional
import type { Professional } from "../type/professionalType";

// ייבוא קישור של React Router
import { Link } from "react-router-dom";

// עיצוב של הקומפוננטה
import "../css/TrendingProfessionals.css";

// קומפוננטת TrendingProfessionals
export default function TrendingProfessionals() {
  // סטייט לשמירת רשימת אנשי המקצוע הטרנדיים
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  // בעת עליית הקומפוננטה – שליפה מהשרת
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingProfessionals(); // קריאה ל־API
        setProfessionals(data); // שמירה בסטייט
      } catch (error) {
        console.error("שגיאה בטעינת העסקים הטרנדיים:", error);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="trending-container">
      {/* כותרת */}
      <h2>🔥 העסקים הטרנדיים</h2>

      {/* רשימת עסקים */}
      <div className="trending-list">
        {professionals.map((p) => (
          <Link
            key={p.professionalId} // מפתח ייחודי
            to={`/professional/${p.professionalId}`} // קישור לעמוד העסק
            className="trending-item"
          >
            {/* תצוגת תמונה */}
            <img
              src={
                p.images && p.images.length > 0
                  ? `data:image/jpeg;base64,${p.images[0].imageBase64}` // תמונה מה־Base64
                  : "/images/default-professional.jpg" // תמונה ברירת מחדל
              }
              alt={p.professionalName}
            />

            {/* שם העסק */}
            <h3>{p.professionalName}</h3>

            {/* תיאור מקוצר */}
            <p className="description">
              {p.professionalDescription?.substring(0, 50) || "אין תיאור"}
            </p>

            {/* כמות צפיות */}
            <div className="trending-clicks">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
              </svg>
              {p.totalClicks ?? 0} צפיות
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
