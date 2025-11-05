// CategoryProfessionals.tsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { fetchProfessionalsByCategory } from "../features/Professional/professionalSlice"; // אקשן שמביא אנשי מקצוע לפי קטגוריה
import "../css/professionals.css"; // עיצוב ייעודי
import type { Professional } from "../type/professionalType"; // טיפוס איש מקצוע
import type { AppDispatch, RootState } from '../store/store'; // טיפוסים מה־store
import { Link, useNavigate, useParams } from "react-router-dom"; // ניווט ופרמטרים מה־URL

// שימוש ב־Typed dispatch ו־selector
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function CategoryProfessionals() {
  const dispatch = useAppDispatch(); // משגר פעולות ל־redux
  const navigate = useNavigate(); // מאפשר ניווט בעזרת קוד
  const { categoryId } = useParams<{ categoryId: string }>(); // קבלת מזהה הקטגוריה מה־URL
  const categoryIdNumber = categoryId ? parseInt(categoryId, 10) : undefined; // המרה למספר

  const { professionals, loading, error } = useAppSelector((state) => state.professionals); // גישה ל־state מתוך ה־slice

  // טעינה בעת שינוי מזהה הקטגוריה
  useEffect(() => {
    if (categoryIdNumber !== undefined) {
      dispatch(fetchProfessionalsByCategory(categoryIdNumber)); // קריאה ל־redux thunk
    }
  }, [categoryIdNumber, dispatch]);

  // מציג טקסט טעינה אם הנתונים עדיין מגיעים
  if (loading) return <p>Loading...</p>;

  // הצגת שגיאה במקרה של תקלה
  if (error) return <p>Error: {error}</p>;

  // פונקציה לניווט לעמוד של איש מקצוע
  const handleViewClick = (professionalId: number) => {
    navigate(`/professional/${professionalId}`);
  };

  return (
    <div className="professionals-container">
      {/* מיפוי על כל אנשי המקצוע */}
      {professionals.map((professional: Professional) => (
        <div className="professional-card" key={professional.professionalId}>
          <div className="circle-icon">
            {/* אות ראשונה של שם העסק */}
            {professional.professionalName ? professional.professionalName.charAt(0).toUpperCase() : "?"}
          </div>
          <h3>{professional.professionalName}</h3>
          <p>{professional.professionalPhone}</p>
          <p className="address">{professional.professionalAdress}</p>
          <div className="buttons">
            {/* כפתור לצפייה בפרטים */}
            <button onClick={() => handleViewClick(professional.professionalId)} className="btn-view">
              View
            </button>
            {/* כפתור עתידי להוספה למועדפים */}
            <button>Add to favourites</button>
          </div>
        </div>
      ))}
    </div>
  );
}
